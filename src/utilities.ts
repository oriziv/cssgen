import { OUTPUT_FORMAT } from './constants';

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
        return '--';
    }
  }

  export function getMixinPrefix(fileFormat: OUTPUT_FORMAT, mixinName: string) {
    return fileFormat === OUTPUT_FORMAT.SCSS ? `@mixin ${mixinName}` : `.${mixinName}()`;
  }

  export function formatVariable(variable: string, output: OUTPUT_FORMAT) {
    let res = variable.replace(/[^a-zA-Z\d\s\-\_]/g, '');
    res = res
      .replace(/[\.\s]/g, '-')
      .replace(/^\d+/g, '')
      .replace(/\-+/g, '-')
      .replace(/^\-/, '');
    const prefix = getVariablePrefix(output);
    return prefix + res;
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
