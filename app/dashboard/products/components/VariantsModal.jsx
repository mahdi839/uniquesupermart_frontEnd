"use client";
import { FaTimes, FaRuler, FaMoneyBillWave, FaBox, FaTag } from "react-icons/fa";
import { asProductArray } from "./productData";

export default function VariantsModal({ product, onClose }) {
  const sizes = asProductArray(product?.sizes);
  const colors = asProductArray(product?.colors);
  const hasSizes = sizes.length > 0;
  const basePrice = product.price;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title fw-semibold">
              <FaTag className="me-2" />
              {product.title} - Variants & Pricing
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white" 
              onClick={onClose}
            ></button>
          </div>
          
          <div className="modal-body">
            {/* Base Price Section */}
            {basePrice && (
              <div className="card border-0 bg-light mb-4">
                <div className="card-body">
                  <h6 className="fw-semibold text-primary mb-3">
                    <FaMoneyBillWave className="me-2" />
                    Base Pricing
                  </h6>
                  <div className="row">
                    <div className="col-md-6">
                      <strong>Base Price:</strong> ৳{basePrice}
                    </div>
                    {product.discount && (
                      <div className="col-md-6">
                        <strong>Discount:</strong> {product.discount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Size Variants Section */}
            <div className="card border-0">
              <div className="card-header bg-transparent border-0 pb-0">
                <h6 className="fw-semibold text-dark mb-3">
                  <FaRuler className="me-2" />
                  Size Variants ({sizes.length})
                </h6>
              </div>
              <div className="card-body p-0">
                {hasSizes ? (
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th><FaRuler className="me-1" /> Size</th>
                          <th><FaMoneyBillWave className="me-1" /> Price</th>
                          <th><FaBox className="me-1" /> Stock</th>
                          <th>Total Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sizes.map((size) => {
                          const price = size.pivot?.price || size.price;
                          const stock = size.pivot?.stock || size.stock || 0;
                          const totalValue = price * stock;
                          
                          return (
                            <tr key={size.id}>
                              <td className="fw-semibold">
                                {size?.size || `No Size Found`}
                              </td>
                              <td className="text-success fw-bold">৳{price}</td>
                              <td>
                                <span className={`badge ${stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                                  {stock} units
                                </span>
                              </td>
                              <td className="text-primary fw-semibold">
                                ৳{totalValue.toLocaleString()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot className="bg-light">
                        <tr>
                          <td colSpan="3" className="fw-bold text-end">Total Inventory Value:</td>
                          <td className="fw-bold text-primary">
                            ৳{sizes.reduce((total, size) => {
                              const price = size.pivot?.price || size.price;
                              const stock = size.pivot?.stock || size.stock || 0;
                              return total + (price * stock);
                            }, 0).toLocaleString()}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    <FaRuler className="fa-2x mb-3 opacity-50" />
                    <p>No size variants configured</p>
                  </div>
                )}
              </div>
            </div>

            {/* Colors Section */}
            {colors.length > 0 && (
              <div className="card border-0 bg-light mt-4">
                <div className="card-body">
                  <h6 className="fw-semibold text-primary mb-3">
                    <FaTag className="me-2" />
                    Color Variants ({colors.length})
                  </h6>
                  <div className="d-flex flex-wrap gap-3">
                    {colors.map((color, index) => (
                      <div key={index} className="d-flex align-items-center gap-2">
                        <div 
                          className="color-swatch rounded border"
                          style={{
                            backgroundColor: color.code,
                            width: '30px',
                            height: '30px'
                          }}
                          title={color.code}
                        ></div>
                        <span className="small">{color.code}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="modal-footer border-0">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
