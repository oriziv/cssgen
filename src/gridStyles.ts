import { IMessageFormat, IOutputStyle } from './interfaces';

export async function generateGridStyles(pluginOptions: IMessageFormat): Promise<IOutputStyle[]> {
  let output: IOutputStyle[] = [{ styles: {} }];
  const localGridStyles = await figma.getLocalGridStylesAsync();
  localGridStyles.forEach((style: GridStyle) => {
    console.log(style);
  });
  return output;
}
