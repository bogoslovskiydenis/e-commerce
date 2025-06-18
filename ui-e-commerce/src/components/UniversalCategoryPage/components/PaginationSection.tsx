'use client'

interface PaginationSectionProps {
    currentPage?: number;
    totalPages?: number;
    onPageChange?: (page: number) => void;
}

export default function PaginationSection({
                                              currentPage = 1,
                                              totalPages = 10,
                                              onPageChange
                                          }: PaginationSectionProps) {
    const handlePageChange = (page: number) => {
        if (onPageChange) {
            onPageChange(page);
        }
    };

    return (
        <div className="mt-12 flex items-center justify-center gap-1 sm:gap-2">
            <button
                className="px-2 sm:px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
            >
                ←
            </button>

            <button
                className={`px-2 sm:px-3 py-2 rounded text-sm ${
                    currentPage === 1 ? 'bg-teal-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handlePageChange(1)}
            >
                1
            </button>

            {currentPage > 3 && <span className="px-1 sm:px-2 text-sm">...</span>}

            {currentPage > 2 && currentPage < totalPages && (
                <button
                    className="px-2 sm:px-3 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    {currentPage - 1}
                </button>
            )}

            {currentPage !== 1 && currentPage !== totalPages && (
                <button
                    className="px-2 sm:px-3 py-2 bg-teal-600 text-white rounded text-sm"
                    onClick={() => handlePageChange(currentPage)}
                >
                    {currentPage}
                </button>
            )}

            {currentPage < totalPages - 1 && currentPage > 1 && (
                <button
                    className="px-2 sm:px-3 py-2 text-gray-700 hover:bg-gray-100 rounded text-sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    {currentPage + 1}
                </button>
            )}

            {currentPage < totalPages - 2 && <span className="px-1 sm:px-2 text-sm">...</span>}

            {totalPages > 1 && (
                <button
                    className={`px-2 sm:px-3 py-2 rounded text-sm ${
                        currentPage === totalPages ? 'bg-teal-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => handlePageChange(totalPages)}
                >
                    {totalPages}
                </button>
            )}

            <button
                className="px-2 sm:px-3 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
                disabled={currentPage >= totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
            >
                →
            </button>
        </div>
    )
}