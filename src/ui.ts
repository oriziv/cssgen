import '../node_modules/prismjs/themes/prism.css';
import '../node_modules/file-saver/dist/FileSaver.js';
import '../node_modules/prismjs';
import '../node_modules/prismjs/components/prism-scss';
import '../node_modules/prismjs/components/prism-less';
import '../node_modules/prismjs/components/prism-stylus';
import './ui.scss';

declare var Prism: any;

const generateButton = document.querySelector<HTMLButtonElement>('#generate');
const codeElement = document.querySelector('#code');
const pre = document.querySelector('pre');
const downloadButton = document.querySelector<HTMLButtonElement>('#download');
const copyButton = document.querySelector<HTMLButtonElement>('#copy');
const textarea = document.querySelector<HTMLTextAreaElement>('#generatedCode');
const selectedFormat = document.querySelector<HTMLSelectElement>('#codeFormat');

generateButton.addEventListener('click', event => {
    parent.postMessage(
        {
            pluginMessage: {
                command: 'GENERATE_CODE',
                format: selectedFormat.value
            }
        },
        '*'
    );
});

downloadButton.addEventListener('click', event => {
    parent.postMessage(
        {
            pluginMessage: { command: 'DOWNLOAD', format: selectedFormat.value }
        },
        '*'
    );
    const file = new File([textarea.value], 'styles.' + selectedFormat.value, {
        type: 'text/plain;charset=utf-8'
    });
    saveAs(file);
});

copyButton.addEventListener('click', event => {
    parent.postMessage(
        { pluginMessage: { command: 'COPY', format: selectedFormat.value } },
        '*'
    );
    selectText(codeElement);
    document.execCommand('copy');
});

window.addEventListener('message', event => {
    if (event.data.pluginMessage.command === 'clean') {
        codeElement.innerHTML = '';
        downloadButton.setAttribute('disabled', 'true');
        copyButton.setAttribute('disabled', 'true');
        return;
    }

    if (event.data.pluginMessage.count === 0) {
        codeElement.innerHTML = '<span>No styles were found<span>';
        return;
    }

    if (!event.data.pluginMessage || !event.data.pluginMessage.code) {
        codeElement.innerHTML = '';
        downloadButton.setAttribute('disabled', 'true');
        copyButton.setAttribute('disabled', 'true');
        return;
    }

    downloadButton.removeAttribute('disabled');
    copyButton.removeAttribute('disabled');
    const code = event.data.pluginMessage.code;
    textarea.value = code;
    pre.setAttribute('class', 'language-' + selectedFormat.value);
    const html = Prism.highlight(
        code,
        Prism.languages[selectedFormat.value],
        selectedFormat.value
    );
    codeElement.innerHTML = html;
});

function selectText(node) {
    if ((document.body as any).createTextRange) {
        const range = (document.body as any).createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        console.warn('Could not select text in node: Unsupported browser.');
    }
}
