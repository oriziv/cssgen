export enum OUTPUT_FORMAT {
  SCSS = 'SCSS',
  LESS = 'LESS',
  CSS = 'CSS'
  // TODO enable json output
}

export enum NAME_FORMAT {
  KEBAB_HYPHEN = 'kebab-case',
  CAMEL_HYPHEN = 'camelCase',
  PASCAL_HYPHEN = 'PascalCase',
  SNAKE_HYPHEN = 'snake_case'
}

export enum COMMAND_TYPE {
  COPY = 'COPY',
  GENERATE_CODE = 'GENERATE_CODE',
  DOWNLOAD = 'DOWNLOAD',
  CLEAN = 'CLEAN'
}

export enum COLOR_MODE {
  RGBA = 'RGBA',
  RGB = 'RGB',
  HEX = 'HEX',
  HSL = 'HSL',
  HSLA = 'HSLA',
  HEXA = 'HEXA'
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
  "SemiBold": {
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

export const FigmaTextDecorationStyles = {
  "STRIKETHROUGH": 'line-through',
  "NONE": 'none',
  "UNDERLINE": 'underline'
}