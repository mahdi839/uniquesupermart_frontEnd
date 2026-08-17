import { FaListUl } from "react-icons/fa";
import { asProductArray } from "./productData";

export default function ProductSpecifications({ specifications, onShowSpecifications }) {
  const specificationList = asProductArray(specifications);

  if (specificationList.length === 0) {
    return <span className="text-muted">-</span>;
  }

  return (
    <button
      className="btn btn-sm btn-outline-info d-flex align-items-center gap-1"
      onClick={onShowSpecifications}
      title="View specifications"
    >
      <FaListUl />
      <span>{specificationList.length}</span>
    </button>
  );
}
