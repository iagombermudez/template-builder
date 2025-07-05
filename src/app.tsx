export const App = () => {
  return (
    <div className="flex h-screen w-screen bg-gray-800">
      <section className="flex h-full w-full flex-col items-center my-16 mx-64">
        <h1 className="text-3xl font-semibold text-white mb-4">
          AI Template Builder
        </h1>
        <h2 className="text-white text-lg mb-8">
          Paste your code, highlight the names you would like to parameterize
          and BOOM!
        </h2>
        <textarea className="border border-gray-400 w-full h-full rounded-lg" />
      </section>
    </div>
  );
};
