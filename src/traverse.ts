import { COLOR_MODE } from "./constants";
import { Utilities } from "./utilities";

let colorStyles = {};
let textStyles = {};
let colorMode = COLOR_MODE.RGB;
let count = 0;

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