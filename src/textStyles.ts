import { FigmaTextCaseStyles, FigmaTextDecorationStyles, FigmaTextStyles, ROOT_FONT_SIZE } from "./constants";
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
            textValues['font-family'] = `"${style.fontName.family}"`;
            const fontStyle = style.fontName.style.toLowerCase();
            if (FigmaTextStyles[fontStyle]) {
                textValues['font-weight'] = FigmaTextStyles[fontStyle].fontWeight;
                textValues['font-style'] = FigmaTextStyles[fontStyle].fontStyle;
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
        if(style.name === 'Segoe UI/20/lh-base-semibold') {
            console.log(style);
        }
        styleOutput.styles[style.name] = textValues;
        output.push(styleOutput);
    });
    return output;
}


export function formatTextStyleCode(pluginOptions: IMessageFormat,textStyles: IOutputStyle[]): string {
    let generatedCode = '';
    textStyles.forEach(textStyle => {
        if (pluginOptions.addComments && textStyle.description) {
            generatedCode += `\n/* ${textStyle.description} */\n`;
        }
        for (const key in textStyle.styles) {
            const element = textStyle.styles[key];
            const mixinName = Utilities.formatVariable(key, pluginOptions.nameFormat).replace(/^\$|\@/g, '');
            let value: string = `${Utilities.getMixinPrefix(pluginOptions.format, mixinName, pluginOptions.nameFormat, 'text', pluginOptions.usePrefix)} {\n`;
            for (const cssRule in element) {
                const cssValue = element[cssRule];
                value += `\t${cssRule}:${cssValue};\n`;
            }
            value += `}\n`;
            generatedCode += value;
        }
    })
    return generatedCode;
}