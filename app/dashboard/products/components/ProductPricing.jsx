import { FaArrowRight } from "react-icons/fa";
import { asProductArray } from "./productData";

export default function ProductPricing({ product, onShowVariants, variant = "desktop" }) {
  const sizes = asProductArray(product?.sizes);
  const hasSizes = sizes.length > 0;
  const basePrice = product.price;

  if (variant === "mobile") {
    return (
      <div>
        <strong className="d-block mb-1 small">Pricing:</strong>
        {hasSizes ? (
          <div className="d-flex flex-column gap-1">
            {sizes.slice(0, 2).map((size) => (
              <div key={size.id} className="d-flex align-items-center gap-1 small">
                <span className="badge bg-secondary">
                  {size.size?.size || `Size ${size.size_id}`}
                </span>
                <FaArrowRight size={10} />
                <span className="badge bg-success">৳{size.pivot?.price || size.price}</span>
              </div>
            ))}
            {sizes.length > 2 && (
              <button 
                className="btn btn-sm btn-outline-primary mt-1"
                onClick={onShowVariants}
              >
                +{sizes.length - 2} more variants
              </button>
            )}
          </div>
        ) : basePrice ? (
          <span className="badge bg-success">Base Price: ৳{basePrice}</span>
        ) : (
          <span className="badge bg-warning text-dark">No price set</span>
        )}
      </div>
    );
  }

  // Desktop view
  return (
    <div className="d-flex flex-column gap-1">
      {hasSizes && (
        <>
          {sizes.slice(0, 3).map((size) => (
            <div key={size.id} className="d-flex align-items-center gap-1 small">
              <span className="badge bg-light text-dark border">
                {size?.size || `Size ${size.size_id}`}
              </span>
              <FaArrowRight size={10} className="text-muted" />
              <span className="text-success fw-semibold">
               {size.pivot?.price || size.price && "৳"}{size.pivot?.price || size.price}
              </span>
              <span className="text-muted">({size.pivot?.stock || 0} stock)</span>
            </div>
          ))}
          {sizes.length > 3 && (
            <button 
              className="mt-1 view_all"
              onClick={onShowVariants}
            >
              View all
            </button>
          )}
        </>
      )}  
      {
        basePrice &&(
        <div>
          <span className="badge bg-success" style={{ width: 'fit-content' }}>
            Base Price: ৳{basePrice}
          </span>
        </div>
      ) 
      }
    </div>
  );
}
