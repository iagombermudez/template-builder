import { useTemplateBuilderPageHooks } from "./template-builder-page.hooks";

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
  } = useTemplateBuilderPageHooks();

  return (
    <>
      <div className="flex h-screen w-screen">
        <section className="absolute top-0 left-0 my-16 ml-16">
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
        <section className="mx-64 my-16 flex h-full w-full flex-col items-center">
          <h1 className="mb-8 text-3xl font-semibold text-white">
            AI Template Builder
          </h1>
          <h2 className="text-lg text-white">
            Paste your code, highlight the names you would like to parameterize
            and BOOM!
          </h2>
          <div className="flex gap-4">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onSelect={handleSelect}
              className="mb-8 min-h-[700px] w-[500px] rounded-2xl border border-gray-400 p-8 font-mono text-white"
            />
            {buildHighlightedCode()}
          </div>
        </section>
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
                className="h-10 w-28 rounded border border-[#333333] bg-[#0C0C0C] text-white hover:border-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
