"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import ProductCard from "@/app/components/frontEnd/home/slots/components/ProductCard";

export default function VirtualizedRelatedProducts({
  initialProducts,
  productId,
  handleOpenModal,
  handleRelatedAddToCart
}) {
  const parentRef = useRef(null);
  const [columnCount, setColumnCount] = useState(4);
  const [products, setProducts] = useState(initialProducts || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState("new");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  // Tab configuration
  const tabs = {
    new: { key: "new", label: "New Arrivals", slug: "new-arrivals" },
    top: { key: "top", label: "Best Sellers", slug: "best-sellers" },
    related: { key: "related", label: "Related" },
  };

  // Responsive column count and window width tracking
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      setWindowWidth(width);

      if (width < 375) setColumnCount(2);
      else if (width < 576) setColumnCount(2);
      else if (width < 768) setColumnCount(2);
      else if (width < 992) setColumnCount(3);
      else setColumnCount(4);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Fetch products based on active tab
  const fetchProducts = useCallback(async (tabKey, pageNum = 1, reset = false) => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      let url;
      
      if (tabKey === 'related') {
        // Fetch related products by product ID
        url = `${baseUrl}api/category_products/${productId}?page=${pageNum}`;
      } else {
        // Fetch by category slug
        const slug = tabs[tabKey].slug;
        url = `${baseUrl}api/category-slug-products/${slug}?page=${pageNum}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        setProducts(prev => reset ? data.data : [...prev, ...data.data]);
        setPage(pageNum);
        setHasMore(data.pagination?.has_more || false);
      } else {
        if (reset) setProducts([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, productId, baseUrl]);

  // Handle tab change
  const handleTabChange = useCallback((tabKey) => {
    if (tabKey === activeMenu) return;
    
    setActiveMenu(tabKey);
    setPage(1);
    setHasMore(true);
    setScrollProgress(0);
    
    // Scroll to top of container
    if (parentRef.current) {
      parentRef.current.scrollTop = 0;
    }
    
    // Fetch new data
    fetchProducts(tabKey, 1, true);
  }, [activeMenu, fetchProducts]);

  // Load more products (infinite scroll)
  const fetchMoreProducts = useCallback(async () => {
    if (isLoading || !hasMore) return;
    await fetchProducts(activeMenu, page + 1, false);
  }, [page, isLoading, hasMore, activeMenu, fetchProducts]);

  // Calculate row count
  const rowCount = Math.ceil(products.length / columnCount);

  // Dynamic row height
  const getRowHeight = () => {
    if (typeof window === 'undefined') return 420;
    if (windowWidth < 375) return 320;
    if (windowWidth < 576) return 340;
    if (windowWidth < 768) return 360;
    return 420;
  };

  // Viewport height (show 3 rows)
  const getViewportHeight = () => {
    const rowHeight = getRowHeight();
    const visibleRows = 3;
    return rowHeight * visibleRows;
  };

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => getRowHeight(),
    overscan: 3,
  });

  // Track scroll progress and load more
  useEffect(() => {
    const scrollElement = parentRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const scrollableDistance = scrollHeight - clientHeight;
      const progress = scrollableDistance > 0 ? (scrollTop / scrollableDistance) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));

      // Load more when 80% scrolled
      if (progress > 80 && hasMore && !isLoading) {
        fetchMoreProducts();
      }
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [fetchMoreProducts, hasMore, isLoading]);

  return (
    <div className="related-products-section mt-5">
      <div className="rounded-3 shadow-sm border border-gray-200 p-md-4 p-sm-1">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <div className="mb-3 mb-md-0 px-2 rel_product_div">
            <h3 className="h4 fw-semibold mb-1 text-dark">
              {activeMenu === 'new' ? 'New Arrivals' : 
               activeMenu === 'top' ? 'Best Sellers' : 
               'Related Products'}
            </h3>
            <p className="text-muted mb-0">
              {products.length.toLocaleString()} products available
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="nav nav-pills related-products-nav">
            {Object.values(tabs).map((item) => (
              <button
                key={item.key}
                onClick={() => handleTabChange(item.key)}
                className={`nav-link ${activeMenu === item.key ? "active" : ""}`}
                type="button"
              >
                {windowWidth < 768 ? item.label.split(' ')[0] : item.label}
              </button>
            ))}
          </div>
        </div>

        {/* No Products Message */}
        {(!products || products.length === 0) && !isLoading ? (
          <div className="text-center py-5">
            <div className="mb-3">
              <i className="bi bi-box-seam" style={{ fontSize: '3rem', color: '#dee2e6' }}></i>
            </div>
            <h5 className="text-muted mb-2">No products found</h5>
            <p className="text-muted small">
              {activeMenu === 'new' ? 'No new arrivals available at the moment.' :
               activeMenu === 'top' ? 'No best sellers available at the moment.' :
               'No related products available.'}
            </p>
          </div>
        ) : (
          <>
            {/* Scroll Progress Bar */}
            {rowCount > 3 && (
              <div className="progress mb-3" style={{ height: '3px' }}>
                <div
                  role="progressbar"
                  style={{
                    width: `${scrollProgress}%`
                  }}
                  className="progress-bar theme-bg-primary"
                  aria-valuenow={scrollProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                />
              </div>
            )}

            {/* Virtualized Products Grid */}
            <div className="position-relative">
              <div
                ref={parentRef}
                data-virtualized="true"
                className="virtualized-grid-container"
                style={{
                  height: `${getViewportHeight()}px`,
                  position: 'relative',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  border: '1px solid #dee2e6',
                  borderRadius: '0.375rem',
                }}
              >
                <div
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                  }}
                >
                  {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                    const startIdx = virtualRow.index * columnCount;
                    const rowProducts = products.slice(startIdx, startIdx + columnCount);

                    return (
                      <div
                        key={virtualRow.index}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        <div className="row g-2 g-md-3 mx-0" style={{ marginBottom: "16px" }}>
                          {rowProducts.map((product) => (
                            <div
                              key={product.id}
                              className="col-6 col-sm-6 col-md-4 col-lg-3"
                            >
                              <ProductCard
                                slotProducts={product}
                                handleOpenModal={handleOpenModal}
                                handleAddToCart={handleRelatedAddToCart}
                                slotLength={products.length}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}

                  {/* Loading Indicator */}
                  {isLoading && (
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                      }}
                    >
                      <div className="d-flex align-items-center gap-3 px-4 py-3 bg-white rounded-pill shadow-sm border">
                        <div className="spinner-border spinner-border-sm theme-text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <span className="text-muted">Loading more products...</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Scroll Hint */}
              {rowCount > 3 && (
                <div className="text-center mt-3">
                  <small className="text-muted">
                    <i className="bi bi-arrow-down me-1"></i>
                    Scroll to see more products
                    {hasMore && windowWidth > 576 && ' • More products will load automatically'}
                  </small>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .virtualized-grid-container {
          scrollbar-width: thin;
          scrollbar-color: var(--primary-color) #f8f9fa;
        }

        .virtualized-grid-container::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .virtualized-grid-container::-webkit-scrollbar-track {
          background: #f8f9fa;
          border-radius: 4px;
        }

        .virtualized-grid-container::-webkit-scrollbar-thumb {
          background-color: var(--primary-color);
          border-radius: 4px;
          border: 2px solid #f8f9fa;
        }

        .virtualized-grid-container::-webkit-scrollbar-thumb:hover {
          background-color: #6c0990;
        }

        .virtualized-grid-container {
          scroll-behavior: smooth;
        }

        .virtualized-grid-container > div {
          min-width: 100%;
          will-change: transform;
        }

        .nav-pills.related-products-nav {
          display: flex;
          flex-wrap: nowrap;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          white-space: nowrap;
          padding-bottom: 4px;
        }

        .nav-pills.related-products-nav::-webkit-scrollbar {
          display: none;
        }

        .nav-pills .nav-link {
          padding: 0.5rem 1rem;
          margin-right: 0.5rem;
          border-radius: 20px;
          color: #6c757d;
          border: 1px solid #dee2e6;
          background: transparent;
          flex-shrink: 0;
        }

        .nav-pills .nav-link.active {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
        }

        .nav-pills .nav-link:not(.active):hover {
          background-color: #f8f9fa;
          color: #495057;
        }

        @media (max-width: 992px) {
          .virtualized-grid-container {
            height: ${400 * 3}px !important;
          }
          
          .nav-pills .nav-link {
            padding: 0.4rem 0.8rem;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 768px) {
          .virtualized-grid-container {
            height: ${360 * 3}px !important;
          }
          
          .related-products-nav {
            width: 100%;
            margin-top: 1rem;
          }
          
          .nav-pills .nav-link {
            padding: 0.35rem 0.7rem;
            font-size: 0.85rem;
            margin-right: 0.4rem;
          }
        }

        @media (max-width: 576px) {
          .virtualized-grid-container {
            height: ${340 * 3}px !important;
          }
          
          .rel_product_div {
            margin: 15px 65px;
          }
          
          .related-products-nav {
            margin: 15px 65px;
          }
          
          h3.h4 {
            font-size: 1.25rem;
          }
          
          .nav-pills .nav-link {
            padding: 0.3rem 0.6rem;
            font-size: 0.8rem;
            margin-right: 0.3rem;
          }
        }

        @media (max-width: 375px) {
          .virtualized-grid-container {
            height: ${320 * 3}px !important;
          }
          
          h3.h4 {
            font-size: 1.1rem;
          }
          
          .nav-pills .nav-link {
            padding: 0.25rem 0.5rem;
            font-size: 0.75rem;
            margin-right: 0.25rem;
          }
        }

        .virtualized-grid-container {
          background-color: transparent;
        }
      `}</style>
    </div>
  );
}
