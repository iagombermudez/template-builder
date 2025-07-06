import { useState } from "react";

export const App = () => {
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

  const [tokens, setTokens] = useState<string[]>([]);
  const [highlightedText, setHighlightedText] = useState("");

  const [confirmationPopup, setConfirmationPopup] = useState<boolean>(false);
  // Detect when a text selection has ended. After the text selection
  // has ended, a new popup should be opened that asks the user to confirm
  // if the selected text should be added to the list of tokens that will be build
  // in the template
  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const start = (e.target as HTMLTextAreaElement).selectionStart;
    const end = (e.target as HTMLTextAreaElement).selectionEnd;
    const selected = code.substring(start, end);
    setHighlightedText(selected);

    //Open the popup if any text has actually been selected
    if (selected.length > 0) {
      setConfirmationPopup(true);
    }
  };

  // When we accept the highlighted text to be added to the list of tokens
  // we should add it to the list of tokens, reset the highlighted text
  // and close the popup
  const acceptConfirmation = () => {
    setTokens([...tokens, highlightedText]);
    setHighlightedText("");
    setConfirmationPopup(false);
  };

  // When we choose not to add the highlighted text to the list of tokens
  // we should reset the highlighted text and close the popup
  const cancelConfirmation = () => {
    setHighlightedText("");
    setConfirmationPopup(false);
  };

  return (
    <>
      <div className="flex h-screen w-screen">
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
      </div>
      {confirmationPopup && (
        <div className="absolute top-0 flex h-full w-full items-center justify-center">
          <div className="rounded-2xl border border-[#333333] bg-[#0C0C0C] px-16 py-8">
            <h3 className="mb-4">
              Would you like to add{" "}
              <span className="font-bold italic">{highlightedText}</span> as a
              parameter?
            </h3>
            <div className="flex w-full items-center justify-center gap-4">
              <button
                type="button"
                onClick={acceptConfirmation}
                className="h-10 w-28 rounded bg-white text-black hover:bg-[#ccc]"
              >
                Yes
              </button>
              <button
                type="button"
                onClick={cancelConfirmation}
                className="h-10 w-28 rounded border border-[#333333] bg-[#0C0C0C] text-white hover:border-white"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
