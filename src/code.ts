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

// Define listener to message from the ui and choose what to do based on the command type
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
    }
}

// Iterate over the figma tree and fetch the styles.
// Current support is text styles and color styles
function generateCode(message: IMessageFormat) {
    figma.ui.postMessage({command: CommandType.CLEAN});
    let generatedCode = '';
    
    if(message.format) {
        format = message.format; 
    }
    
    // Release the ui thread to paint and exec traverse.
    setTimeout(()=> {
        if(typeof figma.getLocalPaintStyles === 'function') {
            getLocalStyles();
        } else {
            traverse(figma.root);
        }
        console.log('count', count);
        for (const key in colorStyles) {
            const val = colorStyles[key];
            const preprocessorVariable = `${formatVariable(key, format)}:${val};\n`;
            generatedCode += preprocessorVariable;
        }
    
        if (format !== 'css') {
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
        }
        figma.ui.postMessage({code: generatedCode, count: count});
        currentGeneratedCode = generatedCode;
    }, 10);
}



// This plugin counts the number of layers, ignoring instance sublayers,
// in the document
function getLocalStyles() {
    const paintStyles = figma.getLocalPaintStyles();
    paintStyles.forEach((style: PaintStyle) => {
        // Prepare style
        if(!style.paints || !style.paints.length || !style.paints[0]['color']) {
            return;
        }
        const color = style.paints[0]['color'];
        const opacity = style.paints[0].opacity;
        const val = getColorValue(color, opacity);
        
        // Count styles
        colorStyles[style.name] = val;
        count++;
    });

    const tStyles = figma.getLocalTextStyles();
    tStyles.forEach((style: TextStyle) => {
        let textValues = {};
        if(style.fontSize) {
            textValues['font-size'] = `${style.fontSize}px`;
        }
        if(style.fontName && style.fontName.style) {
            textValues['font-family'] = `"${style.fontName.family}"`;
            const fontStyle = style.fontName.style.toLowerCase();
            const fontStyleValue = fontStyle === 'regular' ? 'normal' : fontStyle;
            textValues['font-style'] = fontStyleValue;
        }
        
        // TODO by UNIT
        if(style.lineHeight && style.lineHeight['value']) {
            textValues['line-height'] = style.lineHeight['value'] + 'px';
        }
        textStyles[style.name] = textValues;
        count++;
    });
}

function traverse(node: BaseNode) {
    if(!node) {
        return;
    }

    if ("children" in node) {
        if (node.type !== 'INSTANCE') {
            for (const child of node.children) {
                traverse(child);
                if(child.type === 'FRAME' ) {
                    const styleId: any = child.backgroundStyleId;
                    const style = figma.getStyleById(styleId);
                    
                    if(!style) {
                        continue;
                    }

                    console.log('FRAME', style);
                    const key = style.name;
                    if(colorStyles[key]) {
                        continue;
                    }

                    // Prepare style
                    const color = style['paints'][0].color;
                    const opacity = style['paints'][0].opacity;
                    const val = getColorValue(color, opacity);
                    
                    // Count styles
                    colorStyles[key] = val;
                    count++;                    
                }

                if(child.type === 'RECTANGLE' && child.fillStyleId) {
                    const styleId: any = child.fillStyleId;
                    const style = figma.getStyleById(styleId);
                    
                    if(!style) {
                        continue;
                    }

                    
                    const key = style.name;
                    if(colorStyles[key]) {
                        continue;
                    }

                    // Prepare style
                    const color = style['paints'][0].color;
                    const opacity = style['paints'][0].opacity;
                    const val = getColorValue(color, opacity);
                    
                    // Count styles
                    colorStyles[key] = val;
                    count++;
                }

                if(child.type === 'TEXT') {
                    console.log(child);
                    const styleId: any = child.textStyleId;
                    if(!styleId || typeof styleId !== 'string') {
                        continue;
                    }

                    // Get the style
                    const style:any = figma.getStyleById(styleId);
                    
                    if(!style){
                        continue;
                    }
                    console.log(style);
                    const key = style.name;
                    // Check that the key is not already calculated
                    if(textStyles[key]) {
                        continue;
                    }
                    
                    let textValues = {};
                    textValues['font-size'] = `${style.fontSize}px`;
                    textValues['font-family'] = `"${style.fontName.family}"`;
                    const fontStyle = style.fontName.style.toLowerCase();
                    const fontStyleValue = fontStyle === 'regular' ? 'normal' : fontStyle;
                    textValues['font-style'] = fontStyleValue;
                    // TODO by UNIT
                    textValues['line-height'] = style.lineHeight['value'] + 'px';
                    textStyles[key] = textValues;
                    count++;
                }
                
            }
        }
    }
}
