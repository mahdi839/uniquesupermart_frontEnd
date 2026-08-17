"use client";
import { FaTimes } from "react-icons/fa";
import { asProductArray } from "./productData";

export default function SpecificationsModal({ product, onClose }) {
  if (!product) return null;
  const specifications = asProductArray(product.specifications);

  return (
    <div 
      className="modal fade show" 
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div 
        className="modal-dialog modal-dialog-centered modal-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header bg-light">
            <div>
              <h5 className="modal-title fw-bold">Product Specifications</h5>
              <small className="text-muted">{product.title}</small>
            </div>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          
          <div className="modal-body">
            {specifications.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-bordered table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '40%' }}>Specification</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specifications.map((spec, index) => (
                      <tr key={spec.id || index}>
                        <td className="fw-semibold bg-light">{spec.key}</td>
                        <td>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5 text-muted">
                <p className="mb-0">No specifications available for this product</p>
              </div>
            )}
          </div>

          <div className="modal-footer bg-light">
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

      <style jsx>{`
        .modal {
          overflow-y: auto;
        }
        .table td, .table th {
          padding: 12px 15px;
          vertical-align: middle;
        }
      `}</style>
    </div>
  );
}
