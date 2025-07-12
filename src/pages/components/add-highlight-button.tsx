export const AddHighlightButton = (props: { onClick: () => void }) => {
  const { onClick } = props;
  return (
    <button
      type="button"
      onClick={onClick}
      className="pointer-events-auto absolute left-0 h-8 w-8 -translate-y-1 cursor-pointer rounded bg-white text-center text-lg text-black"
    >
      +
    </button>
  );
};
