import type { HexColor } from "../template-builder-page.types";
import { HighlightButton } from "./highlight-button";

export const Highlight = (props: {
  key: string;
  text: string;
  color: HexColor;
}) => {
  const { text, key, color } = props;
  return (
    <span key={key} className="relative inline-block">
      {/* This div is used to add the highlight color. This is necessary because we are 
      adding a little bit of padding to the highlight. If it was added directly in the span,
              the text position would be affected
            */}
      <div
        style={{
          background: color,
        }}
        className="absolute -top-0.5 -left-0.5 -z-10 h-full w-[calc(100%+4px)] rounded"
      />
      <HighlightButton
        type="remove"
        text={text}
        onClick={() => console.log("clicked")}
      />
    </span>
  );
};
