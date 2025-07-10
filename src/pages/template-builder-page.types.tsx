export type Template = {
  script: string;
  usage: string;
};
export type BuilderParameter = {
  color: HexColor;
  selections: Array<TextSelection>;
};

export type TextSelection = {
  text: string;
  position: TextSelectionPosition;
};

export type TextSelectionPosition = {
  start: number;
  end: number;
};

export type HexColor = `#${string}`;
