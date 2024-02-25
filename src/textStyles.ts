import { FigmaTextCaseStyles, FigmaTextDecorationStyles, ROOT_FONT_SIZE } from "./constants";
import { fontWeights } from "./fontWeights";
import { IMessageFormat, IOutputStyle } from "./interfaces";
import { formatNumericValue, Utilities } from "./utilities";

export function generateTextStyles(pluginOptions: IMessageFormat): IOutputStyle[] {
    let output: IOutputStyle[] = [{ styles: {} }];
    const tStyles = figma.getLocalTextStyles();
    tStyles.forEach((style: TextStyle) => {
        let styleOutput: IOutputStyle = { styles: {} };
        let textValues = {};
        if (style.fontSize) {
            if (pluginOptions.useRem) {
                const rFontSize = pluginOptions.rootFontSize || ROOT_FONT_SIZE.PX16;
                textValues['font-size'] = formatNumericValue(style.fontSize / parseInt(rFontSize), 'rem');
            } else {
                textValues['font-size'] = `${style.fontSize}px`;
            }
        }
        if (style.fontName && style.fontName.style) {
            let fontStyle = style.fontName.style.toLowerCase();
            const fontName = style.fontName.family.toLowerCase();
            
            // Check if its italic
            textValues['font-family'] = style.fontName.family;
            if(fontStyle.indexOf('italic')!==-1 || fontName.indexOf('italic')!==-1) {
                textValues['font-style'] = 'italic';
                fontStyle = fontStyle.replace('italic', '');
            }
            const styleIndex = getStyleIndex(fontStyle);
            if (styleIndex !== -1) {
                let key = Object.keys(fontWeights)[styleIndex];
                textValues['font-weight'] = fontWeights[key].fontWeight;
                textValues['font-style'] = fontWeights[key].fontStyle;
                if(fontStyle.indexOf('italic')!==-1) {
                    textValues['font-style'] = 'italic';
                }
            }
        }

        // TODO by UNIT
        if (style.lineHeight && style.lineHeight['value']) {
            let lineHeightVal = parseFloat(style.lineHeight['value'].toFixed(2));
            if (style.lineHeight.unit === 'PERCENT') {
                textValues['line-height'] = lineHeightVal + '%';
            } else {
                textValues['line-height'] = lineHeightVal + 'px';
            }
        }

        if (style.letterSpacing && style.letterSpacing.value) {
            let letterSpacingtVal = parseFloat(style.letterSpacing.value.toFixed(2));
            if (style.letterSpacing.unit === 'PERCENT') {
                textValues['letter-spacing'] = letterSpacingtVal / 100 + 'em';
            } else {
                textValues['letter-spacing'] = letterSpacingtVal + 'px';
            }
        }

        if (style.textDecoration) {
            let textDecorationVal = FigmaTextDecorationStyles[style.textDecoration];
            textValues['text-decoration'] = textDecorationVal;
        }

        if(style.textCase) {
            let textCaseVal = FigmaTextCaseStyles[style.textCase];
            textValues['text-transform'] = textCaseVal;
        }
        if (style.description) {
            styleOutput.description = style.description;
        }
        if(style.paragraphIndent) {
            let textIndentVal = parseFloat(style.paragraphIndent.toFixed(2));
            textValues['text-indent'] = textIndentVal + 'px';
        }
        
        styleOutput.styles[style.name] = textValues;
        output.push(styleOutput);
    });
    return output;
}


export function formatTextStyleCode(pluginOptions: IMessageFormat,textStyles: IOutputStyle[]): string {
    let generatedCode = '';
    const closingDelimeter = Utilities.getClosingDelimeter(pluginOptions.format);
    const openingScopeDelimeter = Utilities.getOpeningScopeDelimeter(pluginOptions.format);
    const closingScopeDelimeter = Utilities.getClosingScopeDelimeter(pluginOptions.format);
    const functionBrackets = Utilities.getFunctionBracket(pluginOptions.format);

    textStyles.forEach(textStyle => {
        if (pluginOptions.addComments && textStyle.description) {
            generatedCode += `\n/* ${textStyle.description} */\n`;
        }
        for (const key in textStyle.styles) {
            const element = textStyle.styles[key];
            const mixinName = Utilities.formatVariable(key, pluginOptions.nameFormat).replace(/^\$|\@/g, '');
            let value: string = `${Utilities.getMixinPrefix(pluginOptions.format, mixinName, pluginOptions.nameFormat, 'text', pluginOptions.usePrefix)}${functionBrackets} ${openingScopeDelimeter}\n`;
            for (const cssRule in element) {
                const cssValue = element[cssRule];
                value += `\t${cssRule}: ${cssValue}${closingDelimeter}\n`;
            }
            value += `${closingScopeDelimeter}\n`;
            generatedCode += value;
        }
    })
    return generatedCode;
}

// Get the font weight and style from the font name
function getStyleIndex(fontStyle: string): number {
    let index = -1;
    if(fontWeights[fontStyle]) {
        index = Object.keys(fontWeights).indexOf(fontStyle);
    }

    // try to eliminate the spaces and search again
    const noSpaceFontStyle = fontStyle.replace(/\s/g, '');
    if(fontWeights[noSpaceFontStyle]) {
        index = Object.keys(fontWeights).indexOf(noSpaceFontStyle);
        if(index !== -1) {
            return index;
        }
    }

    // if there isnt a match break font style and search.
    let breakStyle = fontStyle.split(' ');
    if(breakStyle.length > 1 && index === -1) {
        breakStyle.forEach((style) => {
            if(fontWeights[style]) {
                index = Object.keys(fontWeights).indexOf(style);
            };
        });
    }

    return index;
}