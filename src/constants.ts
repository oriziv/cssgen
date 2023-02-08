export enum OUTPUT_FORMAT {
  SCSS = 'SCSS',
  LESS = 'LESS',
  CSS = 'CSS',
  STYLUS = 'STYLUS',
  SASS = 'SASS'
  // JSON = 'JSON'
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