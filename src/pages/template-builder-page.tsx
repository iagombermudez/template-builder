import { useTemplateBuilderPageHooks } from "./template-builder-page.hooks";

export const TemplateBuilderPage = () => {
  const {
    code,
    setCode,
    builderParameters,
    confirmationPopup,
    handleSelect,
    highlightedText,
    buildHighlightedCode,
    acceptConfirmation,
    cancelConfirmation,
  } = useTemplateBuilderPageHooks();

  return (
    <>
      <div className="flex h-screen w-screen">
        <section className="absolute top-0 left-0 my-16 ml-16">
          <h3 className="mb-8 text-xl font-semibold text-white">Tokens</h3>
          <ul>
            {builderParameters.map((parameter, index) => (
              <li key={index}>Parameter ${index}</li>
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
            className="mb-8 min-h-[700px] w-[800px] rounded-2xl border border-gray-400 p-8 text-white"
          />
          {buildHighlightedCode()}
        </section>
      </div>
      {confirmationPopup && (
        <div className="absolute top-0 flex h-full w-full items-center justify-center">
          <div className="rounded-2xl border border-[#333333] bg-[#0C0C0C] px-16 py-8">
            <h3 className="mb-4">
              Would you like to add{" "}
              <span className="font-bold italic">{highlightedText?.text}</span>{" "}
              as a parameter?
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
