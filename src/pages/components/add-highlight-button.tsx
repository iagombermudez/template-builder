export const AddHighlightButton = (props: {
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
        className="pointer-events-auto absolute -top-4 -left-4 h-5 w-5 -translate-y-1 cursor-pointer rounded bg-white text-center text-base text-black"
      >
        +
      </button>
    </span>
  );
};
