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
    fontWeight: 300
  },
  "Regular": {
    fontStyle: 'normal',
    fontWeight: 400
  },
  "Medium": {
    fontStyle: 'normal',
    fontWeight: 500
  },
  "Bold": {
    fontStyle: 'normal',
    fontWeight: 700
  },
  "ExtraBold": {
    fontStyle: 'normal',
    fontWeight: 800
  },
  "UtraBold": {
    fontStyle: 'normal',
    fontWeight: 800
  },
  "SemiBold": {
    fontStyle: 'normal',
    fontWeight: 600
  },
  "DemiBold": {
    fontStyle: 'normal',
    fontWeight: 600
  },
  "Demi": {
    fontStyle: 'normal',
    fontWeight: 600
  },
  "Black": {
    fontStyle: 'normal',
    fontWeight: 900
  },
  "Heavy": {
    fontStyle: 'normal',
    fontWeight: 900
  },
  "UltraBlack": {
    fontStyle: 'normal',
    fontWeight: 950
  },
  "ExtraBlack": {
    fontStyle: 'normal',
    fontWeight: 950
  },
  "Thin Italic": {
    fontStyle: 'italic',
    fontWeight: 100
  },
  "Light Italic": {
    fontStyle: 'italic',
    fontWeight: 300
  },
  "Italic": {
    fontStyle: 'italic',
    fontWeight: 400
  },
  "Medium Italic": {
    fontStyle: 'italic',
    fontWeight: 500
  },
  "Bold Italic": {
    fontStyle: 'italic',
    fontWeight: 700
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

export enum ROOT_FONT_SIZE {
  PX='10',
  PX11='11',
  PX12='12',
  PX13='13',
  PX14='14',
  PX15='15',
  PX16='16',
  PX17='17',
  PX18='18',
  PX19='19',
  PX20='20'
}


export enum GRADIENT_TYPES {
  GRADIENT_LINEAR=''
}