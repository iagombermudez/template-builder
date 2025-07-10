import {
  useSynchronizeScrolls,
  useTemplateBuilderPageHooks,
} from "./template-builder-page.hooks";

export const TemplateBuilderPage = () => {
  const {
    code,
    setCode,
    parameters,
    confirmationPopup,
    handleSelect,
    highlightedText,
    buildHighlightedCode,
    confirmAddNewChunk,
    cancelConfirmation,
    template,
    templateCreatedPopup,
    openTemplateCreatedPopup,
    closeTemplateCreatedPopup,
    copyTemplateScriptToClipboard,
  } = useTemplateBuilderPageHooks();

  const { syncScroll, synchingElementRef } = useSynchronizeScrolls();

  return (
    <>
      <div className="my-8 flex h-screen w-screen justify-center">
        <section className="absolute top-0 left-0 my-16 ml-16 w-fit">
          <h3 className="mb-8 text-xl font-semibold text-white">Tokens</h3>
          <ul>
            {parameters.map((parameter, i) => (
              <li key={i}>
                <span className="font-semibold underline">Parameter ${i}</span>
                <ul className="ml-4">
                  {parameter.selections.map((selection, j) => (
                    <li key={`list-parameters-${i}-${j}`}>{selection.text}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>
        <section className="flex flex-col items-center">
          <h1 className="mb-8 text-3xl font-semibold text-white">
            AI Template Builder
          </h1>
          <h2 className="text-lg text-white">
            Paste your code, highlight the names you would like to parameterize
            and BOOM!
          </h2>
          <div className="relative flex gap-4">
            <div
              ref={synchingElementRef}
              className="pointer-events-none absolute h-[700px] w-[1000px] overflow-auto rounded-2xl border border-gray-400 p-8 font-mono whitespace-pre text-transparent"
            >
              {buildHighlightedCode()}
            </div>
            <textarea
              value={code}
              onScroll={syncScroll}
              onChange={(e) => setCode(e.target.value)}
              onSelect={handleSelect}
              className="mb-8 min-h-[700px] w-[1000px] overflow-auto rounded-2xl border border-gray-400 p-8 font-mono text-nowrap text-white"
            />
          </div>
        </section>
        <button
          type="button"
          onClick={openTemplateCreatedPopup}
          className="h-10 w-28 cursor-pointer rounded bg-white text-black hover:bg-gray-200"
        >
          Generate
        </button>
      </div>
      {confirmationPopup && (
        <div className="absolute top-0 flex h-full w-full items-center justify-center">
          <div className="rounded-2xl border border-[#333333] bg-[#0C0C0C] px-16 py-8">
            <h3 className="mb-2">
              Would you like to add{" "}
              <span className="font-bold italic">{highlightedText?.text}</span>{" "}
              as a parameter?
            </h3>
            <ul className="mb-4 ml-4 list-disc">
              {parameters.map((_, i) => (
                <li
                  className="cursor-pointer"
                  onClick={() => confirmAddNewChunk(i)}
                >
                  Parameter ${i}
                </li>
              ))}
              <li
                className="cursor-pointer"
                onClick={() => confirmAddNewChunk()} //Not passing the parameter index, since we are creating a new parameter
              >
                New Parameter
              </li>
            </ul>
            <div className="flex w-full items-center justify-center gap-4">
              <button
                type="button"
                onClick={cancelConfirmation}
                className="h-10 w-28 cursor-pointer rounded border border-[#333333] bg-[#0C0C0C] text-white hover:border-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {templateCreatedPopup && (
        <div className="absolute top-0 flex h-full w-full items-center justify-center">
          <div className="rounded-2xl border border-[#333333] bg-[#0C0C0C] px-16 py-8">
            <h3 className="mb-2 text-center text-xl font-bold">
              Template Created!!
            </h3>

            <p className="mb-2 text-lg">Copy the following script</p>
            <div className="relative mb-4 max-h-96 overflow-y-auto rounded border border-[#ccc] bg-black p-4 font-mono whitespace-pre">
              <button
                type="button"
                className="absolute top-2 right-2 h-fit w-fit cursor-pointer rounded border border-[#333333] bg-[#0C0C0C] p-2 text-white hover:border-white"
                onClick={copyTemplateScriptToClipboard}
              >
                Copy to clipboard
              </button>
              {template?.script}
            </div>

            <p className="mb-2 text-lg">Usage</p>
            <div className="mb-4 rounded border border-[#ccc] bg-black p-4 font-mono whitespace-pre">
              {template?.usage}
            </div>

            <button
              type="button"
              onClick={closeTemplateCreatedPopup}
              className="h-10 w-28 cursor-pointer rounded border border-[#333333] bg-[#0C0C0C] text-white hover:border-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
