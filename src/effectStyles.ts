import { IMessageFormat, IOutputStyle } from './interfaces';
import { OUTPUT_FORMAT } from './constants';
import { formatNumericValue, Utilities } from './utilities';

export function generateEffectStyles(pluginOptions: IMessageFormat): IOutputStyle[] {
  let output: IOutputStyle[] = [{ styles: {} }];
  const localEffectStyles = figma.getLocalEffectStyles();
  localEffectStyles.forEach((style: EffectStyle) => {
    let styleOutput: IOutputStyle = { styles: {} };
    let textValues = {};
    if (!style.effects || !style.effects.length) {
      return;
    }
    const visibleEffects = style.effects.filter(p => p.visible).reverse();
    if (!visibleEffects.length) {
      return;
    }
    visibleEffects.forEach(e => {
      const type = e.type;
      if (type === 'DROP_SHADOW' || type === 'INNER_SHADOW') {
        const effect: InnerShadowEffect = e as InnerShadowEffect;
        const color = effect.color;
        const opacity = effect.color.a;
        const val = Utilities.getColorValue(color, opacity !== undefined ? opacity : 1, pluginOptions.colorMode);
        // Count styles
        const strVal = `${type === 'INNER_SHADOW' ? 'inset ' : ''}${formatNumericValue(
          effect.offset.x,
          'px',
          2
        )} ${formatNumericValue(effect.offset.y, 'px', 2)} ${formatNumericValue(effect.radius, 'px', 2)}${
          effect.spread ? ' ' + formatNumericValue(effect.spread, 'px', 2) : ''
        } ${val}`;
        if (textValues['box-shadow']) {
          textValues['box-shadow'] += `, ${strVal}`;
        } else {
          textValues['box-shadow'] = strVal;
        }
        styleOutput.styles[style.name] = textValues;
      }
      if (type === 'BACKGROUND_BLUR' || type === 'LAYER_BLUR') {
        const effect: BlurEffect = e as BlurEffect;
        // Count styles
        textValues[`${type === 'BACKGROUND_BLUR' ? 'backdrop-filter ' : 'filter'}`] = `blur(${formatNumericValue(
          effect.radius,
          'px',
          2
        )})`;
        if (style.description) {
          styleOutput.description = style.description;
        }
        styleOutput.styles[style.name] = textValues;
      }
    });
    output.push(styleOutput);
  });
  return output;
}

export function formatEffectStylesCode(pluginOptions: IMessageFormat, effectStyles: IOutputStyle[]): string {
  if (pluginOptions.format === OUTPUT_FORMAT.JSON) {
    const jsonOutput = {
      effects: {}
    };
    effectStyles.forEach(effectStyle => {
      for (const key in effectStyle.styles) {
        const mixinName = Utilities.formatVariable(key, pluginOptions.nameFormat).replace(/^\$|\@/g, '');
        const element = effectStyle.styles[key];
        jsonOutput.effects[mixinName] = {
          cssProperty: element,
          ...(effectStyle?.description && { description: effectStyle.description })
        };
      }
    });
    return JSON.stringify(jsonOutput, null, 2);
  } else {
    let generatedCode = '';
    const closingDelimeter = Utilities.getClosingDelimeter(pluginOptions.format);
    const openingScopeDelimeter = Utilities.getOpeningScopeDelimeter(pluginOptions.format);
    const closingScopeDelimeter = Utilities.getClosingScopeDelimeter(pluginOptions.format);
    const functionBrackets = Utilities.getFunctionBracket(pluginOptions.format);

    effectStyles.forEach(effectStyle => {
      if (pluginOptions.addComments && effectStyle.description) {
        generatedCode += `\n/* ${effectStyle.description} */\n`;
      }
      for (const key in effectStyle.styles) {
        const element = effectStyle.styles[key];
        const mixinName = Utilities.formatVariable(key, pluginOptions.nameFormat).replace(/^\$|\@/g, '');
        let value: string = `${Utilities.getMixinPrefix(
          pluginOptions.format,
          mixinName,
          pluginOptions.nameFormat,
          'effect',
          pluginOptions.usePrefix
        )}${functionBrackets} ${openingScopeDelimeter}\n`;
        for (const cssRule in element) {
          const cssValue = element[cssRule];
          value += `\t${cssRule}: ${cssValue}${closingDelimeter}\n`;
        }
        value += `${closingScopeDelimeter}\n`;
        generatedCode += value;
      }
    });
    return generatedCode;
  }
}
