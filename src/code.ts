import { formatVariable, getMixinPrefix, getColorValue } from "./utils";
import { OutputFormat, CommandType, IMessageFormat } from "./interfaces";

let count = 0;
let colorStyles = {};
let textStyles = {};
let format: OutputFormat = 'scss';
let currentGeneratedCode: string = '';

// Display UI
figma.showUI(__html__, {
    height: 300,
    width: 300
});

// Define listener to message from the ui
figma.ui.onmessage = (message) => {
    switch (message.command) {
        case CommandType.DOWNLOAD:
            download(message);
            break;
        case CommandType.GENERATE_CODE:
            generateCode(message);
            break;
    
        default:
            break;
        }
    }


// figma.closePlugin();
function download(message: IMessageFormat) {
    if(message.format) {
        // const blob:any = new Blob([currentGeneratedCode], {type: "text/plain;charset=utf-8"});
        // saveAs(blob, `styles.${format}`);
    }
}

function generateCode(message: IMessageFormat) {
    figma.ui.postMessage({code: ""});
    let generatedCode = '';
    console.log("got this from the UI", message);
    if(message.format) {
        format = message.format; 
    }

    setTimeout(()=> {
        traverse(figma.root);
        for (const key in colorStyles) {
            const val = colorStyles[key];
            const preprocessorVariable = `${formatVariable(key, format)}:${val};\n`;
            console.log(key, preprocessorVariable);
            generatedCode += preprocessorVariable;
        }
    
        for (const key in textStyles) {
            const element = textStyles[key];
            const mixinName = formatVariable(key, format).replace(/^\$|\@/g, "");
            let value: string = `${getMixinPrefix(format, mixinName)} {\n`;
            for (const cssRule in element) {
                const cssValue = element[cssRule];
                value+= `\t${cssRule}:${cssValue};\n`;
            }
            value += `}\n`;
            generatedCode += value;
        }
        figma.ui.postMessage({code: generatedCode});
        currentGeneratedCode = generatedCode;
    }, 10);
}



// This plugin counts the number of layers, ignoring instance sublayers,
// in the document

function traverse(node: BaseNode) {
    if(!node) {
        return;
    }

    if ("children" in node) {
        count++
        if (node.type !== 'INSTANCE') {
            for (const child of node.children) {
                traverse(child);

                if(child.type === 'RECTANGLE' && child.fillStyleId) {
                    const styleId: any = child.fillStyleId;
                    const style = figma.getStyleById(styleId);
                    const color = style['paints'][0].color;
                    const opacity = style['paints'][0].opacity;
                    const key = style.name;
                    const val = getColorValue(color, opacity);
                    
                    if(!colorStyles[key]) {
                        colorStyles[key] = val;
                    }
                }

                if(child.type === 'TEXT') {
                    const styleId: any = child.textStyleId;
                    if(!styleId || typeof styleId !== 'string') {
                        continue;
                    }
                    const style:any = figma.getStyleById(styleId);
                    const key = style.name;

                    // Check that the key is not already calculated
                    if(textStyles[key]) {
                        continue;
                    }

                    let textValues = {};
                    textValues['font-size'] = style.fontSize;
                    textValues['font-family'] = `"${style.fontName.family}"`;
                    textValues['font-weight'] = `"${style.fontName.style}"`;
                    // TODO by UNIT
                    textValues['line-height'] = style.lineHeight['value'] + 'px';
                    textStyles[key] = textValues;
                }
                
            }
        }
    }
}
