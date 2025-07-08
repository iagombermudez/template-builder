import { useState, type JSX } from "react";
import type {
  BuilderParameter,
  TextSelection,
  TextSelectionPosition,
} from "./template-builder-page.types";

export const useTemplateBuilderPageHooks = () => {
  const [code, setCode] = useState(`<div className="flex h-screen w-screen">
        <section className="absolute top-0 left-0 my-16 ml-16">
          <h3 className="mb-8 text-xl font-semibold text-white">Tokens</h3>
          <ul>
            {tokens.map((token, index) => (
              <li key={index}>{token}</li>
            ))}
          </ul>
        </section>
        <section className="mx-64 my-16 flex h-full w-full flex-col items-center">
          <h1 className="mb-8 text-3xl font-semibold text-white">
            AI Template Builder
          </h1>
          <h2 className="text-lg text-white">
            Paste your code, highlight the names you would like to parameterize
            and BOOM!
          </h2>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onSelect={handleSelect}
            className="h-[700px] w-[800px] rounded-2xl border border-gray-400 p-8 text-white"
          />
        </section>
      </div>`);

  const [highlightedText, setHighlightedText] = useState<
    TextSelection | undefined
  >(undefined);
  const [parameters, setParameters] = useState<Array<BuilderParameter>>([]);

  const [confirmationPopup, setConfirmationPopup] = useState<boolean>(false);

  // Detect when a text selection has ended. After the text selection
  // has ended, a new popup should be opened that asks the user to confirm
  // if the selected text should be added to the list of tokens that will be build
  // in the template
  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const start = (e.target as HTMLTextAreaElement).selectionStart;
    const end = (e.target as HTMLTextAreaElement).selectionEnd;
    const selectedText = code.substring(start, end);
    setHighlightedText({
      text: selectedText,
      position: { start, end },
    });

    //Open the popup if any text has actually been selected
    if (selectedText.length > 0) {
      setConfirmationPopup(true);
    }
  };

  // When we accept the highlighted text to be added to the list of tokens
  // we should add it to the list of tokens, reset the highlighted text
  // and close the popup
  const acceptConfirmation = () => {
    if (highlightedText) {
      setParameters([...parameters, { selections: [highlightedText] }]);
    }
    setHighlightedText(undefined);
    setConfirmationPopup(false);
  };

  // When we choose not to add the highlighted text to the list of tokens
  // we should reset the highlighted text and close the popup
  const cancelConfirmation = () => {
    setHighlightedText(undefined);
    setConfirmationPopup(false);
  };

  // Build a node that contains all the text given by the user. Every term that
  // the user added as parameter should be highlighted using a <span> tag.
  // To highlight this strings, we will use the positions stored for each element.
  // We should:
  // 1) Sort the positions. This step is crucial to be able to build the string again succesfully
  // 2) For each position. We should:
  //  2.1) If it's the first one, we should make sure to append all the text that came
  //       before as a normal string. (Only if there was text that came before)
  //  2.2) For each position, append a <span> tag including the text in that position
  //  2.3) If it's the first or in the middle, we should append the rest of string
  //       until the next position as a normal string
  //  2.4) If it's the last one, we should do the same as in the first one, but appending the end
  //       instead of the beginning
  // This function should return only one ReactNode that will be rendered.
  const buildHighlightedCode = (): JSX.Element => {
    const positionsToHighlight: Array<TextSelectionPosition> = parameters
      .flatMap((p) => p.selections.map((s) => s.position))
      .sort((p1, p2) => p1.start - p2.start);
    const nodes: Array<JSX.Element | string> = [];
    for (const [i, position] of positionsToHighlight.entries()) {
      if (i === 0 && position.start > 0) {
        nodes.push(code.substring(0, position.start));
      }
      nodes.push(
        <span className="bg-yellow-500">
          {code.substring(position.start, position.end)}
        </span>,
      );
      if (i == positionsToHighlight.length - 1) {
        nodes.push(code.substring(position.end, code.length));
      } else {
        const nextPosition = positionsToHighlight[i + 1];
        nodes.push(code.substring(position.end, nextPosition.start));
      }
    }
    return (
      <div className="h-[700px] w-[500px] overflow-auto rounded-2xl border border-gray-400 p-8 whitespace-pre text-white">
        {nodes.map((node) => node)}
      </div>
    );
  };

  return {
    code,
    setCode,
    builderParameters: parameters,
    setBuilderParameters: setParameters,
    confirmationPopup,
    acceptConfirmation,
    cancelConfirmation,
    highlightedText,
    buildHighlightedCode,
    handleSelect,
  };
};
