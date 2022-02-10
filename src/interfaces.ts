import { OUTPUT_FORMAT, COMMAND_TYPE, NAME_FORMAT, COLOR_MODE, ROOT_FONT_SIZE } from './constants';

export interface IOutputStyle {
  fills: IFillsOutput;
  textStyles: ITextStyleOutput;
}

export interface IFillsOutput {
  [key: string]: string;
}

export interface ITextStyleOutput {
  [key: string]: {};
}

export interface IMessageFormat extends Partial<MessageEvent> {
  format: OUTPUT_FORMAT;
  rootFontSize?: ROOT_FONT_SIZE;
  useRem?: boolean;
  usePrefix?: boolean;
  colorMode: COLOR_MODE;
  command: COMMAND_TYPE;
  nameFormat: NAME_FORMAT;
  count?: number; // number of styles (colors, text styles, etc) found by the plugin
  code?: any;
}
