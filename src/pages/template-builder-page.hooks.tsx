import { useState, type JSX } from "react";
import type {
  BuilderParameter,
  HexColor,
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

  // In order to confirm that a chunk is added, the user must select
  // between adding the chunk to a new parameter or adding it to a new
  // parameter.
  // When the user selects to add it to an existing parameter, we simply
  // append it at the ened of the selections array.
  // When the user selects to add it to a NEW parameter, we need to create
  // this new parameter and initialze it to include the new chunk
  // Finally, we need to reset the highlighted text
  // as well as closing the popup
  const confirmAddNewChunk = (parameterIndex?: number) => {
    if (!highlightedText) return;
    try {
      const newParameters = buildNewParameters(parameterIndex, highlightedText);
      setParameters(newParameters);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        alert("There was an unexpected error:\n " + error?.message);
      }
    } finally {
      //Reset the highlighted text and close the popup
      setHighlightedText(undefined);
      setConfirmationPopup(false);
    }
  };

  // We need to pass highlightedText to this function to assure it's defined
  const buildNewParameters = (
    parameterIndex: number | undefined,
    highlightedText: TextSelection,
  ): Array<BuilderParameter> => {
    return parameterIndex !== undefined
      ? (() => {
          //If there is a parameter index, we are adding the highlighted text to an existing parameter
          if (parameterIndex < 0 || parameterIndex > parameters.length) {
            // Throw if index is out of bounds
            throw new Error("Parameter index out of bounds");
          }
          const existingParameter = parameters[parameterIndex];
          return [
            ...parameters.slice(0, parameterIndex),
            {
              ...existingParameter,
              selections: [...existingParameter.selections, highlightedText],
            },
            ...parameters.slice(parameterIndex + 1),
          ];
        })()
      : (() =>
          //If there is no parameter index, we are creating a new parameter
          [
            ...parameters,
            { color: randomColor(), selections: [highlightedText] },
          ])();
  };

  // Generates a random color in Hex format
  // The color generated should be bright enough to be visible on a dark background
  const randomColor = (): HexColor => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color as HexColor;
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
    const highlights: Array<{
      color: HexColor;
      position: TextSelectionPosition;
    }> = parameters
      .flatMap((p) =>
        p.selections.map((s) => ({
          color: p.color,
          position: s.position,
        })),
      )
      .sort((p1, p2) => p1.position.start - p2.position.start);
    const nodes: Array<JSX.Element | string> = [];
    for (const [i, highlight] of highlights.entries()) {
      if (i === 0 && highlight.position.start > 0) {
        nodes.push(code.substring(0, highlight.position.start));
      }
      nodes.push(
        <span
          key={`highlight-${highlight.position.start}`}
          className="relative"
        >
          {/* This div is used to add the highlight color. This is necessary because we are 
              adding a little bit of padding to the highlight. If it was added directly in the span,
              the text position would be affected*/}
          <div
            style={{
              background: highlight.color,
            }}
            className="absolute top-0 -left-0.5 -z-10 h-full w-[calc(100%+4px)] rounded"
          />
          {code.substring(highlight.position.start, highlight.position.end)}
        </span>,
      );
      if (i == highlights.length - 1) {
        nodes.push(code.substring(highlight.position.end, code.length));
      } else {
        const nextPosition = highlights[i + 1];
        nodes.push(
          code.substring(highlight.position.end, nextPosition.position.start),
        );
      }
    }
    return (
      <div className="h-[700px] w-[500px] overflow-auto rounded-2xl border border-gray-400 p-8 font-mono whitespace-pre text-white">
        {nodes.map((node) => node)}
      </div>
    );
  };

  return {
    code,
    setCode,
    parameters,
    setParameters,
    confirmationPopup,
    confirmAddNewChunk,
    cancelConfirmation,
    highlightedText,
    buildHighlightedCode,
    handleSelect,
  };
};
