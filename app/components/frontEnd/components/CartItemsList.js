import React, { useState, useEffect } from "react";
import axios from "axios";
import CartItem from "./CartItem";

export default function CartItemsList({ 
  cartItems, 
  onIncreament, 
  onDecreament, 
  onRemove, 
  removingItem,
  onClose 
}) {
  const [sizes, setSizes] = useState(null);

  useEffect(() => {
    const fetchSizeData = async () => {
      try {
        let response = await axios.get(process.env.NEXT_PUBLIC_BACKEND_URL + 'api/sizes');
        setSizes(response?.data ?? null);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchSizeData();
  }, []);

  const getSeletedSizeName = (sizeId) => {
    let selectedSize = sizes?.find(size => size?.id == sizeId);
    return selectedSize?.size ?? "N/A";
  };

  return (
    <div className="cart-items-container">
      <div className="cart-items-header">
        <span>Product</span>
        <span>Total</span>
      </div>
      <div className="cart-items">
        {cartItems.map((item) => (
          <CartItem
            key={item.lineId ?? item.id}
            item={item}
            onIncreament={onIncreament}
            onDecreament={onDecreament}
            onRemove={onRemove}
            removingItem={removingItem}
            getSizeName={getSeletedSizeName}
            onClose={onClose}
          />
        ))}
      </div>
    </div>
  );
}
