import { OUTPUT_FORMAT } from "./constants";
import { IMessageFormat, IOutputStyle } from "./interfaces";
import { Utilities } from "./utilities";


export async function generatePaintsStyles(pluginOptions: IMessageFormat): Promise<IOutputStyle[]> {
    let output: IOutputStyle[] = [{ styles: {} }];
    const paintStyles = await figma.getLocalPaintStylesAsync();
    paintStyles.forEach((style: PaintStyle) => {
        let styleOutput: IOutputStyle = { styles: {} };
        // Prepare style - currently supports only solid color
        if (!style.paints || !style.paints.length) {
            return;
        }

        const visiblePaints = style.paints.filter(p => p.visible).reverse();
        if (!visiblePaints.length) {
            return;
        }

        const type = visiblePaints[0].type;
        if (type === 'SOLID') {
            const paint = visiblePaints[0] as SolidPaint;
            const color = paint.color;
            const opacity = paint.opacity;
            const val = Utilities.getColorValue(color, opacity !== undefined ? opacity : 1, pluginOptions.colorMode);
            styleOutput.styles[style.name] = val;
        };

        if (type === 'GRADIENT_LINEAR' || type === 'GRADIENT_RADIAL' || type === 'GRADIENT_ANGULAR') {
            const paint = visiblePaints[0] as GradientPaint;
            const val = Utilities.getGradientValue(paint, paint.opacity, pluginOptions.colorMode);
            styleOutput.styles[style.name] = val;
        }
        if (style.description) {
            styleOutput.description = style.description;
        }
        output.push(styleOutput);
    });
    return output;
}


export function formatPaintStylesCode(pluginOptions: IMessageFormat, paintStyles: IOutputStyle[]): string {
    if (pluginOptions.format === OUTPUT_FORMAT.JSON) {
        const jsonOutput = {
            variables: {},
            textStyles: {}
        };
        paintStyles.forEach(paintStyle => {
            for (const key in paintStyle.styles) {
                const colorPrefix = pluginOptions.usePrefix ? 'color-' : '';
                const formattedKey = Utilities.formatVariable(
                    `${colorPrefix}${key}`,
                    pluginOptions.nameFormat
                );
                const val = paintStyle.styles[key];
                jsonOutput.variables[formattedKey] = {
                    value: val,
                    ...(paintStyle.description && { description: paintStyle.description })
                };
            }
        });
        return JSON.stringify(jsonOutput, null, 2);
    } else {
        let generatedCode = '';
        let delimeter = pluginOptions.format === OUTPUT_FORMAT.STYLUS ? ' = ' : ': ';
        let closingDelimeter = Utilities.getClosingDelimeter(pluginOptions.format);
        paintStyles.forEach(paintStyle => {
            if (pluginOptions.addComments && paintStyle.description) {
                generatedCode += `\n/* ${paintStyle.description} */\n`;
            }
            for (const key in paintStyle.styles) {
                const val = paintStyle.styles[key];
                const colorPrefix = pluginOptions.usePrefix ? 'color-' : '';
                const preprocessorVariable = `${Utilities.getVariablePrefix(pluginOptions.format)}${Utilities.formatVariable(
                    `${colorPrefix}${key}`,
                    pluginOptions.nameFormat
                )}${delimeter}${val}${closingDelimeter}\n`;
                generatedCode += preprocessorVariable;
            }
        })

        // In case of CSS we wrap it inside root element
        if (pluginOptions.format === OUTPUT_FORMAT.CSS) {
            generatedCode = `:root {\n${generatedCode}}\n`;
        }
        return generatedCode;
    }
}
