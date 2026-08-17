"use client"
import { FaQuestionCircle, FaVideo, FaBox, FaListUl } from "react-icons/fa";
import ProductImage from "./ProductImage";
import ProductCategories from "./ProductCategories";
import ProductPricing from "./ProductPricing";
import ProductActions from "./ProductActions";
import ProductSpecifications from "./ProductSpecifications";
import './productIndex.css'
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { asProductArray } from "./productData";

export default function DesktopTableView({ products, onShowVariants, onDelete, onShowSpecifications }) {
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
        <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th style={{ width: '70px' }}>#</th>
                                <th style={{ width: '70px' }}>Image</th>
                                <th style={{ minWidth: '70px' }}>Product Info</th>
                                <th style={{ minWidth: '70px' }}>Sku</th>
                                <th style={{ minWidth: '70px' }}>Colors</th>
                                <th style={{ minWidth: '50px' }}>Status</th>
                                <th style={{ minWidth: '70px' }}>Categories</th>
                                <th style={{ minWidth: '90px' }}>Pricing & Variants</th>
                                <th style={{ width: '60px' }}>Specs</th>
                                <th style={{ width: '60px' }}>FAQ</th>
                                <th style={{ width: '60px' }}>Video</th>
                                <th style={{ width: '90px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productList.map((product, index) => (
                                <tr key={product.id} className="product-row">
                                    <td>
                                        {index + 1}
                                    </td>
                                    <td>
                                        <ProductImage
                                            images={product.images}
                                            title={product.title}
                                            size="sm"
                                        />
                                    </td>

                                    <td>
                                        <h6 className="fw-bold mb-1 text-dark">{truncateText(product.title, 40)}</h6>
                                        {product.short_description && (
                                            <small className="text-muted d-block">
                                                {truncateText(product.short_description, 60)}
                                            </small>
                                        )}
                                        <small className="text-muted d-block">
                                            Created: {formatCreatedAt(product.created_at)}
                                        </small>
                                        {product.discount && (
                                            <small className="text-success fw-semibold d-block">
                                                Discount: {product.discount}
                                            </small>
                                        )}
                                        <div className="mt-1">
                                            <span className="badge bg-secondary">ID: {product.id}</span>
                                        </div>
                                    </td>
                                    
                                    <td>
                                        <span className="badge bg-dark">{product.sku}</span>
                                    </td>
                                    
                                    <td>
                                        {asProductArray(product?.colors).length > 0 ? (
                                            <div className="d-flex flex-wrap gap-2 mt-2">
                                                {asProductArray(product.colors).slice(0, 3).map((color, index) => (
                                                    <div
                                                        key={index}
                                                        className="d-flex flex-column align-items-center p-1 border rounded"
                                                        style={{ width: '60px', backgroundColor: '#f8f9fa' }}
                                                    >
                                                        <Zoom>
                                                            {color.image ? (
                                                                <img
                                                                    src={baseUrl + color.image}
                                                                    alt={color.name || "Color"}
                                                                    className="rounded-circle border"
                                                                    style={{ width: '28px', height: '28px', objectFit: 'cover' }}
                                                                    onError={(e) => (e.target.style.display = 'none')}
                                                                />
                                                            ) : (
                                                                <div
                                                                    className="rounded-circle border"
                                                                    style={{
                                                                        width: '28px',
                                                                        height: '28px',
                                                                        backgroundColor: color.code || '#ccc',
                                                                    }}
                                                                ></div>
                                                            )}
                                                        </Zoom>

                                                        <span
                                                            className="mt-1 text-center xsmall fw-medium"
                                                            style={{ fontSize: '10px', wordBreak: 'break-word' }}
                                                        >
                                                            {color.name || "Not Found"}
                                                        </span>
                                                    </div>
                                                ))}
                                                {asProductArray(product.colors).length > 3 && (
                                                    <div className="d-flex align-items-center">
                                                        <small className="text-muted">+{asProductArray(product.colors).length - 3} more</small>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-muted small">No colors</span>
                                        )}
                                    </td>

                                    <td>
                                        <span className={`badge ${
                                            product.status === 'in-stock' ? 'bg-success' :
                                            product.status === 'prebook' ? 'bg-warning text-dark' :
                                            'bg-danger'
                                        }`}>
                                            {product.status || "N/A"}
                                        </span>
                                    </td>

                                    <td>
                                        <ProductCategories categories={product.category} />
                                    </td>

                                    <td>
                                        <ProductPricing
                                            product={product}
                                            onShowVariants={() => onShowVariants(product)}
                                        />
                                    </td>

                                    <td className="text-center">
                                        <ProductSpecifications 
                                            specifications={product.specifications}
                                            onShowSpecifications={() => onShowSpecifications(product)}
                                        />
                                    </td>

                                    <td className="text-center">
                                        {asProductArray(product.faqs).length > 0 ? (
                                            <span className="text-primary">
                                                <FaQuestionCircle className="me-1" />
                                                {asProductArray(product.faqs).length}
                                            </span>
                                        ) : (
                                            <span className="text-muted">-</span>
                                        )}
                                    </td>

                                    <td className="text-center">
                                        {product.video_url ? (
                                            <a href={product.video_url} target="_blank" rel="noopener noreferrer" className="text-success">
                                                <FaVideo />
                                            </a>
                                        ) : (
                                            <span className="text-muted">-</span>
                                        )}
                                    </td>

                                    <td>
                                        <ProductActions
                                            productId={product.id}
                                            onDelete={() => onDelete(product.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
