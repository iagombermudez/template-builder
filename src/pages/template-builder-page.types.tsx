export type BuilderParameter = {
  selections: Array<TextSelection>;
};

export type TextSelection = {
  text: string;
  position: {
    start: number;
    end: number;
  };
};
