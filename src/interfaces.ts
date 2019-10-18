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

export type OutputFormat = "scss" | "less" | "css";
export enum CommandType {
  GENERATE_CODE = "GENERATE_CODE",
  DOWNLOAD = "DOWNLOAD",
  CLEAN = "CLEAN"
}
export interface IMessageFormat extends MessageEvent {
  format: OutputFormat;
  command: CommandType;
}
