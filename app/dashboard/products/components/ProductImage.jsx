import { FaImage } from "react-icons/fa";
import { asProductArray } from "./productData";

export default function ProductImage({ images, title, size = "sm" }) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  const sizeClasses = {
    sm: "50px",
    md: "80px",
    lg: "120px"
  };

  const dimensions = {
    width: sizeClasses[size],
    height: sizeClasses[size]
  };

  const imageList = asProductArray(images);

  if (imageList.length > 0 && imageList[0]?.image) {
    return (
      <img
        src={`${baseUrl}${imageList[0].image}`}
        alt={title}
        className="img-thumbnail rounded"
        style={{ 
          width: dimensions.width, 
          height: dimensions.height, 
          objectFit: "cover" 
        }}
      />
    );
  }

  return (
    <div 
      className="img-thumbnail rounded d-flex align-items-center justify-content-center bg-light"
      style={dimensions}
    >
      <FaImage className="text-muted" size={size === "sm" ? 14 : 24} />
    </div>
  );
}
