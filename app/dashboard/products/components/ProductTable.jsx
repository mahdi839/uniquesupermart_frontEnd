"use client";
import { useState, useEffect } from "react";
import DesktopTableView from "./DesktopTableView";
import MobileCardView from "./MobileCardView";
import VariantsModal from "./VariantsModal";
import SpecificationsModal from "./SpecificationsModal";
import ProductStockModal from "../../inventory/components/ProductStockModal";
import { asProductArray } from "./productData";
import "../../inventory/inventory.css";

export default function ProductTable({ productData }) {
  const [products, setProducts] = useState(() => asProductArray(productData));
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showVariantsModal, setShowVariantsModal] = useState(false);
  const [showSpecificationsModal, setShowSpecificationsModal] = useState(false);
  const [stockProductId, setStockProductId] = useState(null);

  // ✅ FIX — Update table whenever parent sends new data
  useEffect(() => {
    setProducts(asProductArray(productData));
  }, [productData]);

  const handleShowVariants = (product) => {
    setSelectedProduct(product);
    setShowVariantsModal(true);
  };

  const handleShowSpecifications = (product) => {
    setSelectedProduct(product);
    setShowSpecificationsModal(true);
  };

  const handleDelete = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    // 🔥 invalidate cache
    fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tags: ["products"],
      }),
    });
  };

  return (
    <>
      <div className="d-none d-lg-block">
        <DesktopTableView
          products={products}
          onShowVariants={handleShowVariants}
          onShowSpecifications={handleShowSpecifications}
          onDelete={handleDelete}
          onManageStock={setStockProductId}
        />
      </div>

      <div className="d-block d-lg-none">
        <MobileCardView
          products={products}
          onShowVariants={handleShowVariants}
          onShowSpecifications={handleShowSpecifications}
          onDelete={handleDelete}
          onManageStock={setStockProductId}
        />
      </div>

      {showVariantsModal && selectedProduct && (
        <VariantsModal
          product={selectedProduct}
          onClose={() => setShowVariantsModal(false)}
        />
      )}

      {showSpecificationsModal && selectedProduct && (
        <SpecificationsModal
          product={selectedProduct}
          onClose={() => setShowSpecificationsModal(false)}
        />
      )}

      {stockProductId && (
        <ProductStockModal
          productId={stockProductId}
          onClose={() => setStockProductId(null)}
        />
      )}
    </>
  );
}
