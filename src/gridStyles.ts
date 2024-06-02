import { IMessageFormat, IOutputStyle } from './interfaces';
import { formatNumericValue, Utilities } from './utilities';

export function generateGridStyles(pluginOptions: IMessageFormat): IOutputStyle[] {
  let output: IOutputStyle[] = [{ styles: {} }];
  const localGridStyles = figma.getLocalGridStyles();
  localGridStyles.forEach((style: GridStyle) => {
    console.log(style);
  });
  return output;
}
