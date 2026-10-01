/**
 * Sahifa yuklanayotgan paytdagi kichik skeleton.
 * Bo'sh joy qoldirmaydi, mobil'da tez ko'rinadi.
 */
export default function RouteFallback() {
  return (
    <div className="mx-auto min-h-[70vh] w-full max-w-7xl px-4 pt-16 sm:px-6 lg:px-8" aria-busy="true">
      <div className="skeleton-shimmer h-4 w-32 rounded-full" />
      <div className="skeleton-shimmer mt-6 h-12 w-3/4 max-w-xl rounded-2xl" />
      <div className="skeleton-shimmer mt-4 h-4 w-2/3 max-w-md rounded-full" />
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="skeleton-shimmer aspect-[4/5] rounded-[1.35rem]"
            style={{ animationDelay: `${index * 70}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
