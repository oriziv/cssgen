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
  "thin": {
    fontStyle: 'normal',
    fontWeight: 100
  },
  "light": {
    fontStyle: 'normal',
    fontWeight: 300
  },
  "regular": {
    fontStyle: 'normal',
    fontWeight: 400
  },
  "medium": {
    fontStyle: 'normal',
    fontWeight: 500
  },
  "bold": {
    fontStyle: 'normal',
    fontWeight: 700
  },
  "extrabold": {
    fontStyle: 'normal',
    fontWeight: 800
  },
  "ultrabold": {
    fontStyle: 'normal',
    fontWeight: 800
  },
  "semibold": {
    fontStyle: 'normal',
    fontWeight: 600
  },
  "demibold": {
    fontStyle: 'normal',
    fontWeight: 600
  },
  "demi": {
    fontStyle: 'normal',
    fontWeight: 600
  },
  "black": {
    fontStyle: 'normal',
    fontWeight: 900
  },
  "heavy": {
    fontStyle: 'normal',
    fontWeight: 900
  },
  "ultrablack": {
    fontStyle: 'normal',
    fontWeight: 950
  },
  "extrablack": {
    fontStyle: 'normal',
    fontWeight: 950
  },
  "thin italic": {
    fontStyle: 'italic',
    fontWeight: 100
  },
  "light italic": {
    fontStyle: 'italic',
    fontWeight: 300
  },
  "italic": {
    fontStyle: 'italic',
    fontWeight: 400
  },
  "medium italic": {
    fontStyle: 'italic',
    fontWeight: 500
  },
  "bold italic": {
    fontStyle: 'italic',
    fontWeight: 700
  },
  "black italic": {
    fontStyle: 'italic',
    fontWeight: 900
  }
}

export const FigmaTextDecorationStyles = {
  "STRIKETHROUGH": 'line-through',
  "NONE": 'none',
  "UNDERLINE": 'underline'
}

// https://www.w3schools.com/cssref/pr_text_text-transform.asp
//none|capitalize|uppercase|lowercase|initial|inherit; 
export const FigmaTextCaseStyles = {
  'ORIGINAL': 'none',
  'UPPER': 'uppercase',
  'LOWER': 'lowercase',
  'TITLE': 'capitalize'
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