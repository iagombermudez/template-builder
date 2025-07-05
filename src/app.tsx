import { useState } from "react";

export const App = () => {
  const [text, setText] = useState(
    "This is some sample text. Try selecting part of it!",
  );
  const [highlightedText, setHighlightedText] = useState("");

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const start = (e.target as HTMLTextAreaElement).selectionStart;
    const end = (e.target as HTMLTextAreaElement).selectionEnd;
    const selected = text.substring(start, end);
    setHighlightedText(selected);
  };

  console.log(highlightedText);
  return (
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
          value={text}
          onChange={(e) => setText(e.target.value)}
          onSelect={(e) => handleSelect(e)}
          className="p-8 border text-white border-gray-400 w-full h-full rounded-lg"
        />
      </section>
    </div>
  );
};
