export const HighlightButton = (props: {
  type: "add" | "remove";
  text: string;
  onClick: () => void;
}) => {
  const { onClick, text } = props;
  return (
    <span className="relative">
      {text}
      <button
        type="button"
        onClick={onClick}
        className={`pointer-events-auto absolute top-0 -left-6 flex h-5 w-5 -translate-y-1 cursor-pointer items-center justify-center rounded border border-[#999] bg-[#0C0C0C] text-center text-lg text-black ${props.type === "add" ? "text-green-500" : "text-red-500"}`}
      >
        {props.type === "add" ? "+" : "-"}
      </button>
    </span>
  );
};
