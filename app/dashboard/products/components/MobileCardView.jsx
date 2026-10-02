"use client";
import { FaQuestionCircle, FaVideo, FaBox, FaListUl } from "react-icons/fa";
import ProductImage from "./ProductImage";
import ProductCategories from "./ProductCategories";
import ProductPricing from "./ProductPricing";
import ProductActions from "./ProductActions";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { asProductArray } from "./productData";

export default function MobileCardView({ products, onShowVariants, onDelete, onShowSpecifications, onManageStock }) {
  const formatCreatedAt = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" }).toLowerCase();
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const productList = asProductArray(products);

  if (productList.length === 0) {
    return (
      <div className="card border-0 shadow-sm">
        <div className="card-body text-center py-5">
          <div className="text-muted">
            <FaBox className="fa-3x mb-3 opacity-50" />
            <h5>No Products Found</h5>
            <p className="mb-0">Get started by adding your first product</p>
          </div>
        </div>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  return (
    <div className="row g-3">
      {productList.map((product, index) => (
        <div key={product.id} className="col-12">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              {/* Header with Image and Basic Info */}
              <div className="d-flex gap-3 mb-3">
                <div style={{ flexShrink: 0 }}>
                  <ProductImage
                    images={product.images}
                    title={product.title}
                    size="md"
                  />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h6 className="fw-bold mb-1">{truncateText(product.title, 50)}</h6>
                  {product.short_description && (
                    <p className="text-muted small mb-2">
                      {truncateText(product.short_description, 80)}
                    </p>
                  )}
                  <div className="d-flex flex-wrap gap-1 align-items-center">
                    <span className="badge bg-secondary">#{index + 1}</span>
                    <span className="badge bg-dark">SKU: {product.sku}</span>
                    <span className={`badge ${
                      product.status === 'in-stock' ? 'bg-success' :
                      product.status === 'prebook' ? 'bg-warning text-dark' :
                      'bg-danger'
                    }`}>
                      {product.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <hr className="my-2" />

              {/* Colors */}
              {asProductArray(product.colors).length > 0 && (
                <div className="mb-3">
                  <strong className="d-block mb-2 small">Colors:</strong>
                  <div className="d-flex flex-wrap gap-2">
                    {asProductArray(product.colors).map((color, idx) => (
                      <div
                        key={idx}
                        className="d-flex flex-column align-items-center p-2 border rounded"
                        style={{ width: '65px', backgroundColor: '#f8f9fa' }}
                      >
                        <Zoom>
                          {color.image ? (
                            <img
                              src={baseUrl + color.image}
                              alt={color.name || "Color"}
                              className="rounded-circle border"
                              style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                              onError={(e) => (e.target.style.display = 'none')}
                            />
                          ) : (
                            <div
                              className="rounded-circle border"
                              style={{
                                width: '32px',
                                height: '32px',
                                backgroundColor: color.code || '#ccc',
                              }}
                            ></div>
                          )}
                        </Zoom>
                        <span className="mt-1 text-center" style={{ fontSize: '10px' }}>
                          {color.name || "N/A"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="mb-3">
                <strong className="d-block mb-1 small">Categories:</strong>
                <ProductCategories categories={product.category} />
              </div>

              {/* Pricing */}
              <div className="mb-3">
                <ProductPricing
                  product={product}
                  onShowVariants={() => onShowVariants(product)}
                  variant="mobile"
                />
              </div>

              {/* Additional Info Row */}
              <div className="d-flex flex-wrap gap-2 mb-3">
                {/* Specifications */}
                {asProductArray(product.specifications).length > 0 && (
                  <button
                    className="btn btn-sm btn-outline-info"
                    onClick={() => onShowSpecifications(product)}
                  >
                    <FaListUl className="me-1" />
                    {asProductArray(product.specifications).length} Specs
                  </button>
                )}

                {/* FAQs */}
                {asProductArray(product.faqs).length > 0 && (
                  <span className="btn btn-sm btn-outline-primary disabled">
                    <FaQuestionCircle className="me-1" />
                    {asProductArray(product.faqs).length} FAQs
                  </span>
                )}

                {/* Video */}
                {product.video_url && (
                  <a
                    href={product.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-success"
                  >
                    <FaVideo className="me-1" />
                    Video
                  </a>
                )}

                {/* Discount */}
                {product.discount && (
                  <span className="btn btn-sm btn-outline-warning disabled">
                    Discount: {product.discount}
                  </span>
                )}
              </div>

              {/* Footer with Actions and Date */}
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Created: {formatCreatedAt(product.created_at)}
                </small>
                <ProductActions
                  productId={product.id}
                  onDelete={() => onDelete(product.id)}
                  onManageStock={() => onManageStock(product.id)}
                  variant="mobile"
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
