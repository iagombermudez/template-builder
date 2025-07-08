type TokenPosition = {
  start: number;
  end: number;
};

export type Token = {
  token: string;
  positions: Array<TokenPosition>;
};
