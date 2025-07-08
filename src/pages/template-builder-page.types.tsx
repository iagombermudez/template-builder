export type BuilderParameter = {
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
