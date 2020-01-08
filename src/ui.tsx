import React from 'react';
import ReactDOM from 'react-dom';
import Prism from 'prismjs';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-less';
import 'prismjs/components/prism-stylus';
import 'file-saver/dist/FileSaver.js';

import { IMessageFormat } from './interfaces';
import { COMMAND_TYPE, OUTPUT_FORMAT } from './constants';

/**
 * CSS imports (global)
 */
import 'prismjs/themes/prism.css';

/**
 * SCSS imports (local)
 */
import styles from './ui.scss';

type OwnProps = {};

type State = {
  outputFormat: OUTPUT_FORMAT;
};

class UI extends React.Component<OwnProps, State> {
  codeRef?: React.RefObject<HTMLElement>;
  textareaRef?: React.RefObject<HTMLTextAreaElement>;

  constructor(props: OwnProps) {
    super(props);
    this.state = {
      outputFormat: OUTPUT_FORMAT.SCSS
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
              className={styles.select}
              value={this.state.outputFormat}
              onChange={event => {
                this.setState({ outputFormat: event.target.value as OUTPUT_FORMAT });
              }}
            >
              {Object.values(OUTPUT_FORMAT).map(format => (
                <option value={format}>{format}</option>
              ))}
            </select>
          </div>

          <div className={styles.inputWrapper}>
            <div className={styles.label}>Name format</div>

            <select className={styles.select} name="nameFormat" id="codeFormat">
              <option value="lowcase-hyphen">Lower case with hyphens ($blue-dark)</option>
            </select>
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
          <pre>
            <code className={`language-${this.state.outputFormat.toLowerCase()}`} ref={this.codeRef}></code>
          </pre>
        </div>

        <div className={styles.toolbarBottom}>
          <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={this.generate}>
            Generate
          </button>

          <div className={styles.toolbarBottomButtons}>
            <button
              disabled={disableButtons}
              className={`${styles.button} ${styles.buttonSecondary}`}
              onClick={this.download}
            >
              Download
            </button>
            <button
              disabled={disableButtons}
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

    if (data.pluginMessage.command === COMMAND_TYPE.CLEAN && this.codeRef && this.codeRef.current) {
      this.codeRef.current.innerHTML = '';
      return;
    }

    if (data.pluginMessage.count === 0 && this.codeRef && this.codeRef.current) {
      this.codeRef.current.innerHTML = '<span>No styles were found<span>';
      return;
    }

    const code = data.pluginMessage.code;
    if (!(this.textareaRef && this.textareaRef.current && this.codeRef && this.codeRef.current)) {
      return;
    }
    this.textareaRef.current.value = code;
    const html = Prism.highlight(
      code,
      Prism.languages[this.state.outputFormat.toLowerCase()],
      this.state.outputFormat.toLowerCase()
    );
    this.codeRef.current.innerHTML = html;
  };

  generate = () => {
    this.postMessage({
      command: COMMAND_TYPE.GENERATE_CODE,
      format: this.state.outputFormat
    });
  };

  copy = () => {
    this.postMessage({ command: COMMAND_TYPE.COPY, format: this.state.outputFormat });
    if (!this.codeRef) {
      return;
    }
    this.selectText(this.codeRef.current);
    document.execCommand('copy');
  };

  download = () => {
    this.postMessage({
      command: COMMAND_TYPE.DOWNLOAD,
      format: this.state.outputFormat
    });

    if (!(this.textareaRef && this.textareaRef.current)) {
      return;
    }
    const file = new File([this.textareaRef.current.value], `styles.${this.state.outputFormat.toLowerCase()}`, {
      type: 'text/plain;charset=utf-8'
    });
    saveAs(file);
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
