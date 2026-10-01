export default function RouteFallback() {
  return (
    <div className="shell py-12" aria-busy="true">
      <div className="skeleton h-3 w-32 rounded-full" />
      <div className="skeleton mt-5 h-10 w-2/3 max-w-xl rounded-xl" />
      <div className="skeleton mt-4 h-3 w-1/2 max-w-md rounded-full" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="skeleton aspect-[4/5] rounded-[1.25rem]" />
        ))}
      </div>
    </div>
  );
}
