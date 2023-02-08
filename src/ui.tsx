import React from 'react';
import ReactDOM from 'react-dom';
import Prism from 'prismjs';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-less';
import 'prismjs/components/prism-stylus';
import 'prismjs/components/prism-sass';
import 'file-saver/dist/FileSaver.js';

import { IMessageFormat } from './interfaces';
import { COLOR_MODE, COMMAND_TYPE, NAME_FORMAT, OUTPUT_FORMAT, ROOT_FONT_SIZE } from './constants';

/**
 * CSS imports (global)
 */
import 'prismjs/themes/prism.css';

/**
 * SCSS imports (local)
 */
import styles from './ui.scss';
import { Utilities } from './utilities';

type OwnProps = {};

type State = {
  outputFormat: OUTPUT_FORMAT;
  nameFormat: NAME_FORMAT;
  colorMode: COLOR_MODE;
  rootFontSize: ROOT_FONT_SIZE;
  useRem: boolean;
  usePrefix: boolean;
  addComments: boolean;
};

class UI extends React.Component<OwnProps, State> {
  codeRef?: React.RefObject<HTMLElement>;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;

  constructor(props: OwnProps) {
    super(props);
    this.state = {
      nameFormat: NAME_FORMAT.KEBAB_HYPHEN,
      outputFormat: OUTPUT_FORMAT.SCSS,
      colorMode: COLOR_MODE.RGBA,
      rootFontSize: ROOT_FONT_SIZE.PX16,
      useRem: false,
      usePrefix: true,
      addComments: false
    };
    this.textareaRef = React.createRef();
    this.codeRef = React.createRef();
  }

  componentDidMount() {
    window.addEventListener('message', this.handlePluginMessage);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.handlePluginMessage);
  }

  render() {
    const disableButtons = !!this.codeRef && !!this.codeRef.current && this.codeRef.current.innerHTML === '';

    return (
      <div className={styles.__}>
        <div className={styles.options}>
          <div className={styles.sectionTitle}>Plugin Options</div>

          <div className={styles.inputWrapper}>
            <div className={styles.label}>Output</div>

            <select
              id="outputFormat"
              className={styles.select}
              value={this.state.outputFormat}
              onChange={event => {
                this.setState({ outputFormat: event.target.value as OUTPUT_FORMAT });
              }}
            >
              {Object['values'](OUTPUT_FORMAT).map(format => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
          </div>
          <div className={styles.inputWrapper}>
            <div className={styles.label}>Color mode</div>

            <select
              id="colorMode"
              className={styles.select}
              value={this.state.colorMode}
              onChange={event => {
                this.setState({ colorMode: event.target.value as COLOR_MODE });
              }}
            >
              {Object['values'](COLOR_MODE).map(format => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
          </div>

          <div className={styles.inputWrapper}>
            <div className={styles.label}>Name format</div>

            <select
              className={styles.select}
              name="nameFormat" id="nameFormat"
              onChange={event => {
                this.setState({ nameFormat: event.target.value as NAME_FORMAT });
              }}
            >
              {Object['values'](NAME_FORMAT).map(format => (
                <option key={format} value={format}>{format}</option>
              ))}
            </select>
          </div>
          <div className={styles.inputWrapper}>
            <div className={styles.label}>Root font size</div>

            <select
              id="rootFontSize"
              className={styles.select}
              value={this.state.rootFontSize}
              onChange={event => {
                this.setState({ rootFontSize: event.target.value as ROOT_FONT_SIZE });
              }}
            >
              {Object['values'](ROOT_FONT_SIZE).map(format => (
                <option key={format} value={format}>{`${format}px`}</option>
              ))}
            </select>
          </div> 
          <div className={styles.inputWrapper}>
            <div className={styles.label} title="Generate rem value based on the root font size for font-size property">Use rem font size</div>
            
            <input type="checkbox"  className={styles.autoWidth} id="useRem" defaultChecked={this.state.useRem} onChange={event => {
                this.setState({ useRem: !this.state.useRem });
              }}/>

          </div>          
          <div className={styles.inputWrapper}>
            <div className={styles.label} title="Add variables and mixin prefix. for example --color">Add prefix</div>
            
            <input type="checkbox"  className={styles.autoWidth} id="usePrefix" defaultChecked={this.state.usePrefix} onChange={event => {
                this.setState({ usePrefix: !this.state.usePrefix });
              }}/>

          </div>          
          <div className={styles.inputWrapper}>
            <div className={styles.label} title="Add comments based on style description">Add style description</div>
            
            <input type="checkbox"  className={styles.autoWidth} id="addComments" defaultChecked={this.state.addComments} onChange={event => {
                this.setState({ addComments: !this.state.addComments });
              }}/>

          </div>          
        </div>

        <div className={styles.output}>
          {/* Hidden textarea to output the generated code */}
          <textarea
            className={styles.textarea}
            id="generatedCode"
            cols={30}
            rows={10}
            ref={this.textareaRef}
          ></textarea>
          {/* Prism highlighted code output */}
          <pre className={`language-${this.state.outputFormat.toLowerCase()}`}>
            <code className={`language-${this.state.outputFormat.toLowerCase()}`} ref={this.codeRef}></code>
          </pre>
        </div>

        <div className={styles.toolbarBottom}>
          <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={this.generate}>
            Generate
          </button>

          <div className={styles.toolbarBottomButtons}>
            <button
              // disabled={disableButtons}
              className={`${styles.button} ${styles.buttonSecondary}`}
              onClick={this.download}
            >
              Download
            </button>
            <button
              // disabled={disableButtons}
              className={`${styles.button} ${styles.buttonSecondary}`}
              onClick={this.copy}
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    );
  }

  handlePluginMessage = event => {
    const data: { pluginMessage: IMessageFormat } = event.data;
    const code = data.pluginMessage.code;

    if (data.pluginMessage.command === COMMAND_TYPE.CLEAN && this.codeRef && this.codeRef.current) {
      this.codeRef.current.innerHTML = '';
      return;
    }

    if ((!code || data.pluginMessage.count === 0) && this.codeRef && this.codeRef.current) {
      this.codeRef.current.innerHTML = '<div style="text-align:center">No local styles were found.<br>Learn <a href="https://cutt.ly/css-gen-styles" target="_blank">here</a> how to add your first styles<div>';
      return;
    }


    if (!(this.textareaRef && this.textareaRef.current && this.codeRef && this.codeRef.current)) {
      return;
    }

    // Render generated code
    const html = Prism.highlight(
      code,
      Prism.languages[this.state.outputFormat.toLowerCase()],
      this.state.outputFormat.toLowerCase()
      );
      this.codeRef.current.innerHTML = html;
      this.textareaRef.current.value = code;

    // If download was requested - create a download
    if(data.pluginMessage.command === COMMAND_TYPE.DOWNLOAD) {
        const file = new File([code], `styles.${Utilities.getFileFormat(this.state.outputFormat)}`, {
          type: 'text/plain;charset=utf-8'
        });
        saveAs(file);      
    }
  };

  generate = () => {
    this.postMessage({
      nameFormat: this.state.nameFormat,
      colorMode: this.state.colorMode,
      command: COMMAND_TYPE.GENERATE_CODE,
      format: this.state.outputFormat,
      useRem: this.state.useRem,
      rootFontSize: this.state.rootFontSize,
      usePrefix: this.state.usePrefix,
      addComments: this.state.addComments
    });
  };

  copy = () => {
    this.postMessage({ 
      command: COMMAND_TYPE.COPY,
      colorMode: this.state.colorMode, 
      format: this.state.outputFormat, 
      nameFormat: this.state.nameFormat,
      usePrefix: this.state.usePrefix,
      useRem: this.state.useRem, 
      rootFontSize: this.state.rootFontSize,
      addComments: this.state.addComments
     });
    if (!this.codeRef) {
      return;
    }
    this.selectText(this.codeRef.current);
    document.execCommand('copy');
  };

  download = () => {
    this.postMessage({
      command: COMMAND_TYPE.DOWNLOAD,
      colorMode: this.state.colorMode,
      format: this.state.outputFormat,
      nameFormat: this.state.nameFormat,
      usePrefix: this.state.usePrefix,
      useRem: this.state.useRem,
      rootFontSize: this.state.rootFontSize,
      addComments: this.state.addComments
    });

    if (!(this.textareaRef && this.textareaRef.current)) {
      return;
    }
    // const file = new File([this.textareaRef.current.value], `styles.${this.state.outputFormat.toLowerCase()}`, {
    //   type: 'text/plain;charset=utf-8'
    // });
    // saveAs(file);
  };

  postMessage = (message: IMessageFormat, targetOrigin: string = '*') => {
    parent.postMessage({ pluginMessage: message }, '*');
  };

  selectText = node => {
    if ((document.body as any).createTextRange) {
      const range = (document.body as any).createTextRange();
      range.moveToElementText(node);
      range.select();
    } else if (window.getSelection) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(node);
      if (!selection) {
        return;
      }
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      console.warn('Could not select text in node: Unsupported browser.');
    }
  };
}

ReactDOM.render(<UI />, document.getElementById('react'));
