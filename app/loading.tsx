export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-lectra-surface">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 border-4 border-lectra-primary/30 border-t-lectra-primary rounded-full animate-spin"></div>
          {/* Inner pulsing circle */}
          <div className="absolute inset-3 bg-lectra-primary/20 rounded-full animate-pulse"></div>
          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center text-3xl">
            📚
          </div>
        </div>
        <h2 className="text-2xl font-bold text-lectra-text mb-2">Loading Lectra</h2>
        <p className="text-lectra-text-secondary text-sm">Preparing your learning experience...</p>
      </div>
    </div>
  );
}
