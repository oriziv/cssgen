export enum OUTPUT_FORMAT {
  SCSS = 'SCSS',
  LESS = 'LESS',
  CSS = 'CSS'
  // TODO enable json output
}

export enum NAME_FORMAT {
  CAMEL_HYPHEN = 'camel-hyphen',
  LOWCASE_HYPHEN = 'lowcase-hyphen'
}

export enum COMMAND_TYPE {
  COPY = 'COPY',
  GENERATE_CODE = 'GENERATE_CODE',
  DOWNLOAD = 'DOWNLOAD',
  CLEAN = 'CLEAN'
}

export const FigmaTextStyles = {
  "Thin": {
    fontStyle: 'normal',
    fontWeight: 100
  },
  "Light": {
    fontStyle: 'normal',
    fontWeight: 'lighter'
  },
  "Regular": {
    fontStyle: 'normal',
    fontWeight: 'normal'
  },
  "Medium": {
    fontStyle: 'normal',
    fontWeight: 'bold'
  },
  "Bold": {
    fontStyle: 'normal',
    fontWeight: 'bolder'
  },
  "Black": {
    fontStyle: 'normal',
    fontWeight: 900
  },
  "Thin Italic": {
    fontStyle: 'italic',
    fontWeight: 100
  },
  "Light Italic": {
    fontStyle: 'italic',
    fontWeight: 'lighter'
  },
  "Italic": {
    fontStyle: 'italic',
    fontWeight: 'normal'
  },
  "Medium Italic": {
    fontStyle: 'italic',
    fontWeight: 'bold'
  },
  "Bold Italic": {
    fontStyle: 'italic',
    fontWeight: 'bolder'
  },
  "Black Italic": {
    fontStyle: 'italic',
    fontWeight: 900
  }
}
