interface PaginationProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
}

export default function Pagination({
   currentPage,
   totalPages,
   onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null

    return (
        <div className="flex items-center justify-end gap-2 mt-4">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="
                  px-3 py-1 text-sm rounded
                  disabled:opacity-40
                  hover:bg-gray-100
                "
            >
                Prev
            </button>
            {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1

                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`
                            px-3 py-1 text-sm rounded
                            ${page === currentPage
                                ? "bg-gray-900 text-white"
                                : "hover:bg-gray-100"
                            }
                        `}
                    >
                        {page}
                    </button>
                )
            })}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="
                  px-3 py-1 text-sm rounded
                  disabled:opacity-40
                  hover:bg-gray-100
                "
            >
                Next
            </button>
        </div>
    )
}