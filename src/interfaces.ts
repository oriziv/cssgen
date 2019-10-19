import { OUTPUT_FORMAT, COMMAND_TYPE } from './constants';

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
  command: COMMAND_TYPE;
}
