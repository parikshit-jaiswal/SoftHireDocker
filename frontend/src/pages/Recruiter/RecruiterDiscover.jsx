import { searchApplicants } from '@/Api/ApplicantServices';
import Loader from '@/components/miniComponents/Loader';
import DiscoverProfile from '@/components/Recruiter/Discover/DiscoverProfile';
import DiscoverSidebar from '@/components/Recruiter/Discover/DiscoverSidebar';
import React, { useEffect, useState } from 'react';

function RecruiterDiscover() {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    document.body.style.overflow = 'hidden'; // Disable page scroll
    return () => {
      document.body.style.overflow = 'auto'; // Restore on unmount
    };
  }, []);

  const discoverApplicants = async (filters, page, limit) => {
    try {
      setLoading(true);
      const response = await searchApplicants(filters, page, limit);
      setData(response.applicants);
      // If your API returns total count, use it to set totalPages
      if (response.totalCount) {
        setTotalPages(Math.ceil(response.totalCount / limit));
      } else {
        // Fallback: if less than limit, assume last page
        setTotalPages(response.applicants.length < limit ? page : page + 1);
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    discoverApplicants({}, page, 10);
  }, [page]);

  return (
    <div className="relative h-screen w-screen pb-20">
      <div className="flex h-full w-full">
        <DiscoverSidebar />
        <div className="w-full overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center w-full h-full"><Loader /></div>
          ) : (
            <div className="flex-col w-full space-y-5 ">
              {data.length === 0 ? (
                <div className="flex justify-center items-center h-full w-full text-gray-500 text-lg font-semibold">
                  No applicants found.
                </div>
              ) : (
                data.map((applicant) => (
                  <DiscoverProfile key={applicant._id} data={applicant} />
                ))
              )}
            </div>
          )}
          {/* Pagination Controls only when not loading */}
          {!loading && (
            <div className="flex justify-center items-center space-x-4 w-full pb-6 bg-white z-10  mt-5">
              <button
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || loading}
              >
                Previous
              </button>
              <span className="text-gray-700 font-medium">Page {page}{totalPages > 1 ? ` of ${totalPages}` : ''}</span>
              <button
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                onClick={() => setPage((p) => (totalPages ? Math.min(totalPages, p + 1) : p + 1))}
                disabled={loading || (totalPages ? page >= totalPages : false)}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Pagination Controls fixed at the bottom */}
    </div>
  );
}

export default RecruiterDiscover;