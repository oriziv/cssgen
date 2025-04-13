import { IMessageFormat, IOutputStyle } from './interfaces';
import { COMMAND_TYPE, OUTPUT_FORMAT } from './constants';
import { formatTextStyleCode, generateTextStyles } from './textStyles';
import { formatEffectStylesCode, generateEffectStyles } from './effectStyles';
import { formatPaintStylesCode, generatePaintsStyles } from './paintStyles';

// Init
let count = 0;
let paintStyles: IOutputStyle[] = [];
let textStyles: IOutputStyle[] = [];
let gridStyles: IOutputStyle[] = [];
let effectStyles: IOutputStyle[] = [];
let currentGeneratedCode: string = '';
let pluginOptions: IMessageFormat;

// Display UI
figma.showUI(__html__, {
  height: 700,
  width: 500,
  themeColors: true
});

// Define listener to message from the ui and choose what to do based on the command type
figma.ui.onmessage = (message: IMessageFormat) => {
  switch (message.command) {
    case COMMAND_TYPE.DOWNLOAD:
      generateCode(message, COMMAND_TYPE.DOWNLOAD);
      break;
    case COMMAND_TYPE.GENERATE_CODE:
      generateCode(message);
      break;
    default:
      break;
  }
};


// Iterate over the figma tree and fetch the styles.
// Current support is text styles and color styles
function generateCode(message: IMessageFormat, command = COMMAND_TYPE.GENERATE_CODE) {
  figma.ui.postMessage({ command: COMMAND_TYPE.CLEAN });
  currentGeneratedCode = '';
  let generatedCode = '';
  paintStyles.length = 0;
  effectStyles.length = 0;
  textStyles.length = 0;
  pluginOptions = message;

  // Release the ui thread to paint and exec traverse.
  setTimeout(async () => {

    // Get all local styles by types
    await getLocalStyles();

    // Generate code
    if (pluginOptions.format === OUTPUT_FORMAT.JSON) {
      const paintStylesJson = JSON.parse(formatPaintStylesCode(pluginOptions, paintStyles));
      const textStylesJson = JSON.parse(formatTextStyleCode(pluginOptions, textStyles));
      const effectStylesJson = JSON.parse(formatEffectStylesCode(pluginOptions, effectStyles));

      const combinedJson = {
        variables: {
          ...paintStylesJson.variables,
        },
        textStyles: {
          ...textStylesJson.textStyles,
          ...effectStylesJson.textStyles
        },
        effectStyles: {
          ...effectStylesJson.effects
        }
      };

      generatedCode = JSON.stringify(combinedJson, null, 2);
    } else {
      generatedCode += formatPaintStylesCode(pluginOptions, paintStyles);
      generatedCode += formatTextStyleCode(pluginOptions, textStyles);
      generatedCode += formatEffectStylesCode(pluginOptions, effectStyles);
    }

    // Count the styles that were generated
    count = Object.keys(paintStyles).length + Object.keys(effectStyles).length + Object.keys(textStyles).length;
    figma.ui.postMessage({ code: generatedCode, count: count, command: command });
    currentGeneratedCode = generatedCode;
  });
}

// This plugin counts the number of layers, ignoring instance sublayers,
// in the document
async function getLocalStyles() {
  paintStyles = await generatePaintsStyles(pluginOptions);
  effectStyles = await generateEffectStyles(pluginOptions);
  textStyles = await generateTextStyles(pluginOptions);
  // gridStyles = generateGridStyles(pluginOptions);
}
