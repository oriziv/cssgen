import { formatNumericValue, Utilities } from './utilities';
import { IMessageFormat } from './interfaces';
import { OUTPUT_FORMAT, COMMAND_TYPE, FigmaTextStyles, NAME_FORMAT, COLOR_MODE, FigmaTextDecorationStyles, ROOT_FONT_SIZE } from './constants';

let count = 0;
let colorStyles = {};
let textStyles = {};
let effectStyles = {};
let useRem = false; 
let rootFontSize: ROOT_FONT_SIZE = ROOT_FONT_SIZE.PX16;
let format: OUTPUT_FORMAT = OUTPUT_FORMAT.SCSS;
let colorMode: COLOR_MODE = COLOR_MODE.RGBA;
let nameFormat: NAME_FORMAT = NAME_FORMAT.KEBAB_HYPHEN;
let currentGeneratedCode: string = '';

// Display UI
figma.showUI(__html__, {
  height: 616,
  width: 500
});

// Define listener to message from the ui and choose what to do based on the command type
figma.ui.onmessage = (message: IMessageFormat) => {
  switch (message.command) {
    case COMMAND_TYPE.DOWNLOAD:
      download(message);
      break;
    case COMMAND_TYPE.GENERATE_CODE:
      generateCode(message);
      break;
    default:
      break;
  }
};

// figma.closePlugin();
function download(message: IMessageFormat) {
  if (message.format) {
  }
}

// Iterate over the figma tree and fetch the styles.
// Current support is text styles and color styles
function generateCode(message: IMessageFormat) {
  figma.ui.postMessage({ command: COMMAND_TYPE.CLEAN });
  let generatedCode = '';

  if (message.format) {
    format = message.format;
  }

  if (message.nameFormat) {
    nameFormat = message.nameFormat;
  }

  if (message.colorMode) {
    colorMode = message.colorMode;
  }

  if (message.rootFontSize) {
    rootFontSize = message.rootFontSize;
  }

  if (message.useRem !== undefined) {
    useRem = message.useRem;
  }
  
  // Release the ui thread to paint and exec traverse.
  setTimeout(() => {
    if (typeof figma.getLocalPaintStyles === 'function') {
      getLocalStyles();
    } else {
      traverse(figma.root);
    }
    if (format === OUTPUT_FORMAT.CSS) {
      generatedCode += `:root {\n`;
    }

    for (const key in colorStyles) {
      const val = colorStyles[key];
      const preprocessorVariable = `${Utilities.getVariablePrefix(format)}${Utilities.formatVariable(
        `color-${key}`,
        nameFormat
      )}: ${val};\n`;
      generatedCode += preprocessorVariable;
    }
    if (format === OUTPUT_FORMAT.CSS) {
      generatedCode += `}\n`;
    }

    for (const key in textStyles) {
      const element = textStyles[key];
      const mixinName = Utilities.formatVariable(key, nameFormat).replace(/^\$|\@/g, '');
      let value: string = `${Utilities.getMixinPrefix(format, mixinName, nameFormat)} {\n`;
      for (const cssRule in element) {
        const cssValue = element[cssRule];
        value += `\t${cssRule}:${cssValue};\n`;
      }
      value += `}\n`;
      generatedCode += value;
    }

    for (const key in effectStyles) {
      const element = effectStyles[key];
      const mixinName = Utilities.formatVariable(key, nameFormat).replace(/^\$|\@/g, '');
      let value: string = `${Utilities.getMixinPrefix(format, mixinName, nameFormat, 'effect')} {\n`;
      for (const cssRule in element) {
        const cssValue = element[cssRule];
        value += `\t${cssRule}:${cssValue};\n`;
      }
      value += `}\n`;
      generatedCode += value;
    }
    figma.ui.postMessage({ code: generatedCode, count: count });
    currentGeneratedCode = generatedCode;
  }, 10);
}

// This plugin counts the number of layers, ignoring instance sublayers,
// in the document
function getLocalStyles() {
  const paintStyles = figma.getLocalPaintStyles();
  paintStyles.forEach((style: PaintStyle) => {
    // Prepare style
    if (!style.paints || !style.paints.length || !style.paints[0]['color']) {
      return;
    }
    const color = style.paints[0]['color'];
    const opacity = style.paints[0].opacity;
    const val = Utilities.getColorValue(color, opacity !== undefined ? opacity : 1, colorMode);

    // Count styles
    colorStyles[style.name] = val;
    count++;
  });

  const localEffectStyles = figma.getLocalEffectStyles();
  localEffectStyles.forEach((style: EffectStyle) => {
    let textValues = {};
    if (!style.effects || !style.effects.length || !style.effects[0]['color']) {
      return;
    }
    if (style.effects[0].type === 'DROP_SHADOW' || style.effects[0].type === 'INNER_SHADOW') {
      console.log(style.effects);
      const effect: ShadowEffect = style.effects[0] as ShadowEffect;
      const color = effect.color;
      const opacity = effect.color.a;
      const val = Utilities.getColorValue(color, opacity !== undefined ? opacity : 1, colorMode);
      // Count styles
      textValues['box-shadow'] = `${style.effects[0].type === 'INNER_SHADOW'?'inset ':''}${formatNumericValue(effect.offset.x, 'px',2)} ${formatNumericValue(effect.offset.y, 'px',2)} ${formatNumericValue(effect.radius,'px',2)}${effect.spread ? ' ' + formatNumericValue(effect.spread, 'px', 2) : ''} ${val}`;
      effectStyles[style.name] = textValues;
    }
    count++;
  });

  const tStyles = figma.getLocalTextStyles();
  tStyles.forEach((style: TextStyle) => {
    let textValues = {};
    if (style.fontSize) {
      if(useRem) {
        textValues['font-size'] = formatNumericValue(style.fontSize/parseInt(rootFontSize), 'rem');
      } else {
        textValues['font-size'] = `${style.fontSize}px`;
      }
    }
    if (style.fontName && style.fontName.style) {
      textValues['font-family'] = `"${style.fontName.family}"`;
      const fontStyle = style.fontName.style;
      if (FigmaTextStyles[fontStyle]) {
        textValues['font-weight'] = FigmaTextStyles[fontStyle].fontWeight;
        textValues['font-style'] = FigmaTextStyles[fontStyle].fontStyle;
      }
    }

    // TODO by UNIT
    if (style.lineHeight && style.lineHeight['value']) {
      console.log(style);
      let lineHeightVal = parseFloat(style.lineHeight['value'].toFixed(2));
      if (style.lineHeight.unit === 'PERCENT') {
        textValues['line-height'] = lineHeightVal + '%';
      } else {
        textValues['line-height'] = lineHeightVal + 'px';
      }
    }

    if (style.letterSpacing && style.letterSpacing.value) {
      let letterSpacingtVal = parseFloat(style.letterSpacing.value.toFixed(2));
      if(style.letterSpacing.unit === 'PERCENT') {
        textValues['letter-spacing'] = letterSpacingtVal/100 + 'em';
      } else {
        textValues['letter-spacing'] = letterSpacingtVal + 'px';
      }
    }

    if (style.textDecoration) {
      let textDecorationVal = FigmaTextDecorationStyles[style.textDecoration];
      textValues['text-decoration'] = textDecorationVal;
    }

    textStyles[style.name] = textValues;
    count++;
  });
}

function traverse(node: BaseNode) {
  if (!node) {
    return;
  }

  if ('children' in node) {
    if (node.type !== 'INSTANCE') {
      for (const child of node.children) {
        traverse(child);
        if (child.type === 'FRAME') {
          const styleId: any = child.backgroundStyleId;
          const style = figma.getStyleById(styleId);

          if (!style) {
            continue;
          }

          const key = style.name;
          if (colorStyles[key]) {
            continue;
          }

          // Prepare style
          const color = style['paints'][0].color;
          const opacity = style['paints'][0].opacity;
          const val = Utilities.getColorValue(color, opacity, colorMode);

          // Count styles
          colorStyles[key] = val;
          count++;
        }

        if (child.type === 'RECTANGLE' && child.fillStyleId) {
          const styleId: any = child.fillStyleId;
          const style = figma.getStyleById(styleId);

          if (!style) {
            continue;
          }

          const key = style.name;
          if (colorStyles[key]) {
            continue;
          }

          // Prepare style
          const color = style['paints'][0].color;
          const opacity = style['paints'][0].opacity;
          const val = Utilities.getColorValue(color, opacity, colorMode);

          // Count styles
          colorStyles[key] = val;
          count++;
        }

        if (child.type === 'TEXT') {
          const styleId: any = child.textStyleId;
          if (!styleId || typeof styleId !== 'string') {
            continue;
          }

          // Get the style
          const style: any = figma.getStyleById(styleId);

          if (!style) {
            continue;
          }
          const key = style.name;
          // Check that the key is not already calculated
          if (textStyles[key]) {
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
