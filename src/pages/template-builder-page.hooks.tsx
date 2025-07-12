import { useRef, useState, type JSX } from "react";
import type {
  BuilderParameter,
  HexColor,
  Template,
  TextSelection,
  TextSelectionPosition,
} from "./template-builder-page.types";
import { findFirstDifference } from "./template-builder-page.utils";

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

  // Template popup variables
  const [template, setTemplate] = useState<Template | undefined>(undefined);
  const [templateCreatedPopup, setTemplateCreatedPopup] =
    useState<boolean>(false);
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
  const buildHighlightedCode = (): Array<JSX.Element | string> => {
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
            className="absolute -top-0.5 -left-0.5 -z-10 h-full w-[calc(100%+4px)] rounded"
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
    return nodes.map((node) => node);
  };

  // In order to generate the template script, we will need to substitute all the
  // selected highlights for it's corresponding params. Example: this_is_a_highlight -> $1
  // To achieve this, we will substitute each highlight in order of first to last position.
  // Since we are reducing the ammount of text every time we parse a highlight to a parameter
  // we will need to keep track of how many characters we have removed, taking into account that
  // we are also adding extra characters ($1, $22, $12313, etc.)
  const generateTemplateScript = (): Template => {
    const highlights: Array<{
      parameterNumber: number;
      start: TextSelectionPosition["start"];
      end: TextSelectionPosition["end"];
    }> = parameters
      .flatMap((p, index) =>
        p.selections.map((s) => ({
          parameterNumber: index,
          start: s.position.start,
          end: s.position.end,
        })),
      )
      .sort((p1, p2) => p1.start - p2.start);

    let parsedCode = code;
    let characterOffset = 0;
    for (const highlight of highlights) {
      const bashParameter = `$\{${highlight.parameterNumber}}`;
      parsedCode =
        parsedCode.substring(0, highlight.start - characterOffset) +
        bashParameter +
        parsedCode.substring(highlight.end - characterOffset);
      characterOffset += highlight.end - highlight.start - bashParameter.length;
    }

    //Escape all quotations
    parsedCode = parsedCode.replaceAll('"', '\\"');
    parsedCode = parsedCode.replaceAll("'", "\\'");
    return {
      script: `printf "${parsedCode}"`,
      usage: `sh ./script ${parameters.map((_, index) => `$${index}`).join(" ")}`,
    };
  };

  const openTemplateCreatedPopup = () => {
    const generatedTemplate = generateTemplateScript();
    setTemplate(generatedTemplate);
    setTemplateCreatedPopup(true);
  };

  // When closing the template created popup, we need to reset the template state
  const closeTemplateCreatedPopup = () => {
    setTemplate(undefined);
    setTemplateCreatedPopup(false);
  };

  //Handlers
  //-----------------------------------------------------------------------

  // When the user edits the code inside the text area, we need to make sure
  // to update the positions of the highlights in each of the parameters to match
  // the new length of the input.
  // To achieve this, we need 2 pieces of information:
  // * Ammount of characters added/deleted
  //    * To achieve this, we can subtract the length of the new value by the stored text
  //      (positive means characters were added, negative subtracted)
  // * Position of characters added/deleted
  //    * Since only one part of the text can be modified at each time, checking the
  //      position of the first difference between the original and the new text should
  //      suffice
  //
  // - With that information, we need to find all the tokens after the first difference (or within
  //   distance based on the difference of characters) and subtract the difference of characters.
  // - We also will need to update the text in the parameter to match the text that is being highlighted
  //   If the highlight has completely been erased, it should be deleted from the parameter list.
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newCode = e.target.value;
    const differenceOfCharacters = newCode.length - code.length;
    const firstDifferenceIndex = findFirstDifference(code, newCode);
    let newParameters = parameters.map((p) => ({
      ...p,
      selections: p.selections.map((s) => {
        const newPosition = {
          start:
            s.position.start > firstDifferenceIndex
              ? s.position.start + differenceOfCharacters
              : s.position.start,
          end:
            //splitting > and >= because when we append to the end, we want to add
            // the character to the highlight, but when we subtract the character after
            // the highlight, we don't want to reduce the size of the highlight
            s.position.end > firstDifferenceIndex ||
            (s.position.end >= firstDifferenceIndex &&
              differenceOfCharacters > 0)
              ? s.position.end + differenceOfCharacters
              : s.position.end,
        };
        return {
          ...s,
          text: newCode.substring(newPosition.start, newPosition.end),
          position: newPosition,
        };
      }),
    }));

    //Remove selections that are empty after the user erased it
    newParameters = newParameters.map((p) => ({
      ...p,
      selections: p.selections.filter((s) => s.text.length > 0),
    }));

    //TODO: when a parameter is completely empty with no selections
    // we should ask the user if they would like to erase it

    setParameters(newParameters);
    setCode(e.target.value);
  };

  const handleCopyTemplateScriptToClipboard = async () => {
    if (template) {
      await navigator.clipboard.writeText(template.script);
    }
  };

  //-----------------------------------------------------------------------

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
    generateTemplateScript,
    template,
    templateCreatedPopup,
    openTemplateCreatedPopup,
    closeTemplateCreatedPopup,
    handleCodeChange,
    handleCopyTemplateScriptToClipboard,
  };
};

export const useSynchronizeScrolls = () => {
  const elementToSyncRef = useRef<HTMLDivElement>(null);

  // This function should be assigned in the `onScroll` method of the element
  // that will be scrolled. For now, this only works for textareas, as this is
  // the only use case in the application and overengineering is ~no bueno~.
  // The other element will not need any functions.
  // This will sync both
  // - horizontal scroll (scrollLeft)
  // - vertical scroll (scrollTop)
  const syncScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (elementToSyncRef?.current) {
      elementToSyncRef.current.scrollTop = e.currentTarget.scrollTop;
      elementToSyncRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };
  return {
    syncScroll,
    synchingElementRef: elementToSyncRef,
  };
};
