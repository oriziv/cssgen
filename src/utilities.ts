import kebabCase from 'lodash-es/kebabCase';
import camelCase from 'lodash-es/camelCase';
import snakeCase from 'lodash-es/snakeCase';
import capitalize from 'lodash-es/capitalize';

import { NAME_FORMAT, OUTPUT_FORMAT } from './constants';

export namespace Utilities {
  export function camelCaseToDash(myStr) {
    return myStr.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  export function getVariablePrefix(fileFormat: OUTPUT_FORMAT) {
    switch (fileFormat) {
      case OUTPUT_FORMAT.SCSS:
        return '$';
      case OUTPUT_FORMAT.LESS:
        return '@';
      case OUTPUT_FORMAT.CSS:
        return '\t--';
    }
  }

  export function getMixinPrefix(fileFormat: OUTPUT_FORMAT, mixinName: string, nameFormat = NAME_FORMAT.KEBAB_HYPHEN, styleType='text') {
    let mixinPrefixResult = '';
    let name = formatVariable(`${styleType}-style-${mixinName}`,nameFormat);
    switch (fileFormat) {
      case OUTPUT_FORMAT.SCSS:
        mixinPrefixResult = `@mixin ${name}`;
        break;
      case OUTPUT_FORMAT.LESS:
        mixinPrefixResult = `.${name}`;
      default:
        mixinPrefixResult = `.${name}`;
        break;
    }
    return mixinPrefixResult;
  }

  export function formatVariable(variable: string, output: NAME_FORMAT) {
    let formatted = '';

    switch (output) {
      case NAME_FORMAT.CAMEL_HYPHEN:
        formatted = camelCase(variable);
        break;
      case NAME_FORMAT.SNAKE_HYPHEN:
        formatted = snakeCase(variable);
        break;
      case NAME_FORMAT.PASCAL_HYPHEN:
        formatted = variable.charAt(0).toUpperCase() + camelCase(variable.slice(1));
        break;
      default:
        formatted = kebabCase(variable);
        break;
    }
    return formatted;
  }

  // Get rgba(x,x,x,x) css value from color object and opacity
  export function getColorValue(color: RGB, opacity: number): string {
    // Convert color to web rgba format
    const r = color.r * 255;
    const g = color.g * 255;
    const b = color.b * 255;
    const a = opacity === 1 ? 1 : Number(opacity).toFixed(3);
    const rgba = `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${a})`;
    return rgba;
  }
}
