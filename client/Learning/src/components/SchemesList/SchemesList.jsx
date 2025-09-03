import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SchemesList.css"; // Make sure to create this CSS file

const SchemesList = () => {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalSchemes, setTotalSchemes] = useState(0);
  const [limit, setLimit] = useState(10);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true);
        console.log(
          `Making request to: http://localhost:8001/api/v1/schemes?page=${currentPage}&limit=${limit}`
        );

        // Include pagination parameters in the request
        const response = await axios.get(
          `http://localhost:8001/api/v1/schemes?page=${currentPage}&limit=${limit}`
        );

        // Debug the response structure
        console.log("Full response:", response);
        console.log("Response data:", response.data);
        console.log("Response data.data:", response.data.data);

        if (response.data && response.data.data && response.data.data.scheme) {
          console.log("Schemes array:", response.data.data.scheme);
          setSchemes(response.data.data.scheme);

          // Set pagination info from response
          setTotalPages(response.data.data.TotalPages || 0);
          setCurrentPage(response.data.data.CurrentPage || 1);
          // Calculate total schemes if not provided
          setTotalSchemes(
            response.data.data.TotalSchemes ||
              response.data.data.TotalPages * limit
          );
        } else {
          console.log("No schemes found in expected structure");
          setSchemes([]);
          setTotalPages(0);
          setTotalSchemes(0);
        }

        setError(null);
      } catch (err) {
        console.error("Full error object:", err);
        console.error("Error response:", err.response);
        setError(`Failed to load schemes: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, [currentPage, limit]); // Re-fetch when page or limit changes

  // Handle page navigation
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0); // Scroll to top when page changes
    }
  };

  // Handle items per page change
  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing limit
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // If total pages is small, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      // Adjust if we're near the beginning or end
      if (currentPage <= 3) {
        endPage = 5;
      }
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  // Debug what we're trying to render
  console.log("Current schemes state:", schemes);
  console.log("Pagination state:", {
    currentPage,
    totalPages,
    totalSchemes,
    limit,
  });

  if (loading) return <div className="loading">Loading schemes...</div>;
  if (error) return <div className="error">{error}</div>;
  if (schemes.length === 0 && !loading)
    return <div className="empty">No schemes available.</div>;

  return (
    <div className="schemes-container">
      <h1>Government Schemes</h1>

      {/* Pagination Controls at the top */}
      <div className="pagination-controls">
        <div className="per-page">
          <label htmlFor="limit-select" className="label-text text-slate-600">
            Items per page:
          </label>
          <select
            id="limit-select"
            value={limit}
            onChange={handleLimitChange}
            disabled={loading}
            className="label-text text-slate-600"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>

        <div className="page-info">
          {totalSchemes > 0 && (
            <>
              Showing <b>{schemes.length}</b> of <b>{totalSchemes}</b> schemes |
              Page <b>{currentPage}</b> of <b>{totalPages}</b>
            </>
          )}
        </div>
      </div>

      {/* Schemes list */}
      <div className="schemes-list">
        {schemes.map((scheme) => {
          // Debug each scheme object
          console.log("Rendering scheme:", scheme);

          /**/

          return (
            <div
              className="card bg-slate-600 text-primary-content w-96"
              key={scheme._id}
            >
              <div className="card-body">
                <h2 className="card-title font-medium text-2xl">
                  {scheme.scheme_name || scheme.schemeName || "No Name"}
                </h2>
                <div className="scheme-details">
                  {scheme.schemeCategory && (
                    <p>
                      <b className="text-lg">Category:</b> {scheme.schemeCategory}
                    </p>
                  )}
                  {scheme.level && (
                    <p>
                      <b className="text-lg">Level:</b> {scheme.level}
                    </p>
                  )}
                  {scheme.details && (
                    <p>
                      <b className="text-lg">Details:</b> {scheme.details.substring(0, 200)}
                      ...
                    </p>
                  )}
                </div>
                {/* <p>
                  A card component has a figure, a body part, and inside body
                  there are title and actions parts
                </p> */}
                <div className="card-actions justify-end">
                  <button className="btn">Details</button>
                </div>
              </div>
            </div>
            // <div className="scheme-card" key={scheme._id}>
            //   <h2>{scheme.scheme_name || scheme.schemeName || "No Name"}</h2>
            // <div className="scheme-details">
            //   {scheme.schemeCategory && (
            //     <p>
            //       <strong>Category:</strong> {scheme.schemeCategory}
            //     </p>
            //   )}
            //   {scheme.level && (
            //     <p>
            //       <strong>Level:</strong> {scheme.level}
            //     </p>
            //   )}
            //   {scheme.details && (
            //     <p>
            //       <strong>Details:</strong> {scheme.details.substring(0, 200)}
            //       ...
            //     </p>
            //   )}
            // </div>
            //   {/* Temporarily show all data for debugging */}
            //   {/* <details>
            //     <summary>View all fields (Debug)</summary>
            //     <pre>{JSON.stringify(scheme, null, 2)}</pre>
            //   </details> */}
            // </div>
          );
        })}
      </div>

      {/* Pagination Navigation */}
      {totalPages > 1 && (
        <div className="pagination text-slate-600">
          {/* First and Previous buttons */}
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1 || loading}
            className="pagination-button"
            title="First Page"
          >
            &laquo; First
          </button>

          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="pagination-button"
            title="Previous Page"
          >
            &lsaquo; Prev
          </button>

          {/* Page numbers */}
          <div className="page-numbers">
            {currentPage > 3 && totalPages > 5 && (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  className="pagination-button"
                >
                  1
                </button>
                <span className="ellipsis">...</span>
              </>
            )}

            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                disabled={loading}
                className={`pagination-button ${
                  currentPage === pageNum ? "active" : ""
                }`}
              >
                {pageNum}
              </button>
            ))}

            {currentPage < totalPages - 2 && totalPages > 5 && (
              <>
                <span className="ellipsis">...</span>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  className="pagination-button"
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          {/* Next and Last buttons */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="pagination-button"
            title="Next Page"
          >
            Next &rsaquo;
          </button>

          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages || loading}
            className="pagination-button"
            title="Last Page"
          >
            Last &raquo;
          </button>
        </div>
      )}

      {/* Page jump input */}
      {totalPages > 10 && (
        <div className="page-jump">
          <label>
            Go to page:
            <input
              type="number"
              min="1"
              max={totalPages}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= totalPages) {
                    handlePageChange(page);
                    e.target.value = "";
                  }
                }
              }}
              placeholder={`1-${totalPages}`}
            />
          </label>
        </div>
      )}
    </div>
  );
};

export default SchemesList;
