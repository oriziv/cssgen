import kebabCase from 'lodash-es/kebabCase';
import camelCase from 'lodash-es/camelCase';
import snakeCase from 'lodash-es/snakeCase';
import capitalize from 'lodash-es/capitalize';

import { COLOR_MODE, NAME_FORMAT, OUTPUT_FORMAT } from './constants';

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

  export function getMixinPrefix(fileFormat: OUTPUT_FORMAT, mixinName: string, nameFormat = NAME_FORMAT.KEBAB_HYPHEN, styleType = 'text') {
    let mixinPrefixResult = '';
    let name = formatVariable(`${styleType}-style-${mixinName}`, nameFormat);
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
  export function getColorValue(color: RGB, opacity: number, colorMode = COLOR_MODE.RGBA): string {
    // Convert color to web rgba format
    let res = '';
    const r = Math.round(color.r * 255);
    const g = Math.round(color.g * 255);
    const b = Math.round(color.b * 255);
    const a = opacity === 1 ? 1 : Number(opacity).toFixed(3);

    switch (colorMode) {
      case COLOR_MODE.HEX:
        res = RGBAToHexA(r, g, b);
        break;
      case COLOR_MODE.HEXA:
        res = RGBAToHexA(r, g, b, a);
        break;
      case COLOR_MODE.RGB:
        res = `rgba(${r},${g},${b})`;
        break;
      case COLOR_MODE.HSL:
        res = RGBToHSL(r,g,b);
        break;
      case COLOR_MODE.HSLA:
        res = RGBToHSL(r,g,b,a);
        break;
      default:
        res = `rgba(${r},${g},${b},${a})`;
        break;
    }

    return res;
  }

  export function RGBAToHexA(r, g, b, a?) {
    r = r.toString(16);
    g = g.toString(16);
    b = b.toString(16);
    if (a) {
      a = Math.round(a * 255).toString(16);
    }

    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;
    if (a && a.length == 1)
      a = "0" + a;

    return "#" + r + g + b + (a!==undefined ? a : '');
  }

  export function RGBToHSL(r, g, b, a?) {
    // Make r, g, and b fractions of 1
    r /= 255;
    g /= 255;
    b /= 255;

    // Find greatest and smallest channel values
    let cmin = Math.min(r, g, b),
      cmax = Math.max(r, g, b),
      delta = cmax - cmin,
      h = 0,
      s = 0,
      l = 0;
    // Calculate hue
    // No difference
    if (delta == 0)
      h = 0;
    // Red is max
    else if (cmax == r)
      h = ((g - b) / delta) % 6;
    // Green is max
    else if (cmax == g)
      h = (b - r) / delta + 2;
    // Blue is max
    else
      h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    // Make negative hues positive behind 360°
    if (h < 0)
      h += 360;
    // Calculate lightness
    l = (cmax + cmin) / 2;

    // Calculate saturation
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    // Multiply l and s by 100
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    if(a !== undefined) {
      return "hsla(" + h + "," + s + "%," +l + "%," + a + ")";
    }
  
    return "hsl(" + h + "," + s + "%," + l + "%)";
  }
}
