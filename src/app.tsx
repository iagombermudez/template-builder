import { useState } from "react";

export const App = () => {
  const [code, setCode] = useState("");
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

  return (
    <>
      <div className="flex h-screen w-screen bg-gray-800">
        <section className="flex h-full w-full flex-col items-center my-16 mx-64">
          <h1 className="text-3xl font-semibold text-white mb-8">
            AI Template Builder
          </h1>
          <h2 className="text-white text-lg">
            Paste your code, highlight the names you would like to parameterize
            and BOOM!
          </h2>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onSelect={(e) => handleSelect(e)}
            className="p-8 border text-white border-gray-400 w-full h-full rounded-lg"
          />
        </section>
      </div>
      {confirmationPopup && <div>Confirmation popup {highlightedText}</div>}
    </>
  );
};
