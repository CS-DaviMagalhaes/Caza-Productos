type TitleProps = {
  isSearching: boolean;
};

export function Title({ isSearching }: TitleProps) {
  return (
    <h1 className="text-4xl font-bold mb-6 text-center">
      Caza Productos
      {isSearching && (
        <span className="ml-2 text-base text-blue-500">Searching...</span>
      )}
    </h1>
  );
}
