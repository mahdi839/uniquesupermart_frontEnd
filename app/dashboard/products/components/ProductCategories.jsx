import { asProductArray } from "./productData";

export default function ProductCategories({ categories }) {
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const categoryList = asProductArray(categories);

  if (categoryList.length === 0) {
    return <span className="text-muted small">No categories</span>;
  }

  return (
    <div className="d-flex flex-column gap-1">
      {categoryList.slice(0, 3).map((category) => (
        <span 
          key={category.id} 
          className="badge bg-info text-white small" 
          style={{ width: 'fit-content' }}
        >
          {truncateText(category.name, 20)}
        </span>
      ))}
      {categoryList.length > 3 && (
        <small className="text-muted">+{categoryList.length - 3} more</small>
      )}
    </div>
  );
}
