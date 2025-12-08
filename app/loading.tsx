export default function Loading() {
  return (
    <main className="relative w-full overflow-hidden">
      <div className="container mx-auto px-4 lg:px-10 xl:px-16">
        {/* Green Background - covers 2/3 of section */}
        <div
          className="absolute inset-0 bg-main-primary"
          style={{ height: "66.666%" }}
        />
        {/* Tertiary Background - covers bottom 1/3 of section */}
        <div
          className="absolute inset-x-0 bottom-0 bg-[#C0CDD1]"
          style={{ height: "33.334%" }}
        />

        {/* Main Container */}
        <div className="relative pt-20 lg:pt-24 xl:pt-32">
          <div className="relative">
            {/* Slider Skeleton */}
            <div className="relative w-full overflow-hidden rounded-2xl bg-gray-300 animate-pulse">
              <div className="h-[50vh] min-h-[500px] lg:h-[60vh]">
                {/* Content Skeleton */}
                <div className="flex h-full items-center px-6 sm:px-10 lg:px-16">
                  <div className="max-w-xl space-y-6">
                    {/* Title skeleton */}
                    <div className="space-y-3">
                      <div className="h-12 w-80 rounded bg-gray-400/50 sm:h-14 lg:h-16" />
                      <div className="h-12 w-64 rounded bg-gray-400/50 sm:h-14 lg:h-16" />
                    </div>
                    {/* Description skeleton */}
                    <div className="space-y-2">
                      <div className="h-4 w-96 max-w-full rounded bg-gray-400/30" />
                      <div className="h-4 w-72 rounded bg-gray-400/30" />
                    </div>
                    {/* Button skeleton */}
                    <div className="h-12 w-40 rounded-md bg-gray-400/50" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom padding */}
            <div className="h-20 lg:h-28" />
          </div>
        </div>
      </div>

      {/* Promo Banner Skeleton */}
      <section className="bg-[#C0CDD1] py-10">
        <div className="container mx-auto px-4 lg:px-10 xl:px-16 -mt-20 lg:-mt-28 relative z-10">
          <div className="rounded-lg bg-main-secondary/50 animate-pulse px-6 py-4 lg:px-10 lg:py-6">
            <div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
              <div className="space-y-2 text-center lg:text-left">
                <div className="h-5 w-64 rounded bg-main-primary/20 mx-auto lg:mx-0" />
                <div className="h-5 w-80 rounded bg-main-primary/20 mx-auto lg:mx-0" />
              </div>
              <div className="h-10 w-32 rounded-md bg-main-primary/20" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
