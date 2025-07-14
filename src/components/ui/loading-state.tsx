export function LoadingState() {
    return (
        <div className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading market data...</p>
            </div>
        </div>
    );
  }