function Shimmer({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-gray-200 rounded ${className}`}>
      <div className='absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent' />
    </div>
  );
}

export default function CheckoutSkeleton() {
  return (
    <section className='flex justify-center items-center min-h-screen px-6' style={{ backgroundColor: '#E5E5E5' }}>
      <div className='mx-auto max-w-[733px] w-full mb-4'>
        {/* Indeterminate progress bar */}
        <div className='w-full h-1 bg-gray-200 rounded-t overflow-hidden'>
          <div className='h-full bg-primary animate-[progress_1.6s_ease-in-out_infinite]' />
        </div>

        <div className='sm:grid grid-cols-[240px_1fr]'>
          {/* Left sidebar skeleton */}
          <div className='bg-primary px-[22px] py-8'>
            <Shimmer className='w-24 h-8 mx-auto bg-white/20' />
            <div className='mt-[55px] space-y-2'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='flex items-center gap-3 px-3 py-5'>
                  <Shimmer className='w-5 h-5 shrink-0 rounded bg-white/20' />
                  <Shimmer className='h-4 w-24 bg-white/20' />
                </div>
              ))}
            </div>
          </div>

          {/* Right panel skeleton */}
          <div className='bg-white p-8'>
            {/* Header */}
            <div className='flex justify-between items-center mb-8'>
              <Shimmer className='w-6 h-6 rounded' />
              <Shimmer className='w-12 h-4 rounded' />
            </div>

            {/* Title + description */}
            <Shimmer className='h-4 w-36 mb-3' />
            <Shimmer className='h-3 w-full mb-1' />
            <Shimmer className='h-3 w-3/4 mb-4' />

            <div className='border border-gray-100 mt-4.5' />

            {/* Summary rows */}
            <div className='my-4.5 space-y-4'>
              <div className='grid grid-cols-[100px_1fr]'>
                <Shimmer className='h-3 w-20' />
                <Shimmer className='h-3 w-28 ml-auto' />
              </div>
              <div className='grid grid-cols-[100px_1fr]'>
                <Shimmer className='h-3 w-20' />
                <Shimmer className='h-3 w-36 ml-auto' />
              </div>
            </div>

            <div className='border-2 border-gray-100 mb-4.5' />

            <div className='grid grid-cols-[100px_1fr] mb-6'>
              <Shimmer className='h-3 w-14' />
              <Shimmer className='h-3 w-24 ml-auto' />
            </div>

            {/* Payment form area */}
            <div className='space-y-4 min-h-[280px]'>
              <Shimmer className='h-12 w-full rounded-lg' />
              <div className='grid grid-cols-2 gap-4'>
                <Shimmer className='h-12 rounded-lg' />
                <Shimmer className='h-12 rounded-lg' />
              </div>
              <Shimmer className='h-12 w-full rounded-lg' />
              <Shimmer className='h-12 w-full rounded-lg mt-2' />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className='flex justify-center items-center mt-4 gap-2'>
          <Shimmer className='w-4 h-4 rounded' />
          <Shimmer className='w-28 h-3 rounded' />
        </div>
      </div>
    </section>
  );
}
