// components/UI/Table/TablePagination.tsx
interface TablePaginationProps {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
  }
  
  export default function TablePagination({
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    onPageChange
  }: TablePaginationProps) {
    const startItem = (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);
  
    const getPageNumbers = () => {
      const pages = [];
      const showPages = 5;
      
      let start = Math.max(1, currentPage - Math.floor(showPages / 2));
      let end = Math.min(totalPages, start + showPages - 1);
      
      if (end - start + 1 < showPages) {
        start = Math.max(1, end - showPages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      return pages;
    };
  
    if (totalPages <= 1) return null;
  
    return (
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="text-sm text-gray-700">
            Menampilkan <span className="font-medium">{startItem}</span> sampai{' '}
            <span className="font-medium">{endItem}</span> dari{' '}
            <span className="font-medium">{totalItems}</span> hasil
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
  
            {/* Page Numbers */}
            {getPageNumbers().map(page => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`
                  min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-colors
                  ${currentPage === page
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                {page}
              </button>
            ))}
  
            {/* Next Button */}
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="h-5 w-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }