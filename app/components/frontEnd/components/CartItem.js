import React from "react";
import Link from "next/link";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import Image from "next/image";

export default function CartItem({
  item,
  onIncreament,
  onDecreament,
  onRemove,
  removingItem,
  getSizeName,
  onClose
}) {
  const lineId = item.lineId ?? item.id;

  return (
    <div
      className={`cart-item ${removingItem === lineId ? 'removing' : ''}`}
    >
      <div className="item-image">
        <Image
          src={item?.colorImage ? item?.colorImage : item?.image}
          alt={item.title}
          width={80} // Set a fixed width
          height={80} // Set a fixed height
          className="img-fluid"
          objectFit="contain"
        />
      </div>
      <div className="item-details">
        <h6 className="item-title text-truncate w-100">
          <Link
            onClick={onClose}
            href={`/frontEnd/product-page/${item.id}`}
            className="d-inline-block text-truncate w-100"
          >
            {item.title}
          </Link>
        </h6>

        <div className="item-total">
          <span className="total-price"> <strong>৳</strong> {item.totalPrice}</span>
        </div>
        {(item.color_name || item.size) && (
          <p className="item-variant">
            {item.color_name && <span>{item.color_name}</span>}
            {item.color_name && item.size && " / "}
            {item.size && <span>{item.size_label || getSizeName(item.size)}</span>}
          </p>
        )}

        <div className="item-actions">
          <div className="quantity-controls">
            <button
              onClick={() => onDecreament(lineId)}
              disabled={item.qty <= 1}
              className="qty-btn qty-minus"
              aria-label="Decrease quantity"
            >
              <FaMinus size={10} />
            </button>
            <span className="qty-display">{item.qty}</span>
            <button
              onClick={() => onIncreament(lineId)}
              disabled={Boolean(item.max_qty) && item.qty >= item.max_qty}
              className="qty-btn qty-plus"
              aria-label="Increase quantity"
              title={
                item.max_qty && item.qty >= item.max_qty
                  ? `Only ${item.max_qty} in stock`
                  : undefined
              }
            >
              <FaPlus size={10} />
            </button>
          </div>
          <button
            onClick={() => onRemove(lineId)}
            className="remove-btn"
            aria-label="Remove item"
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
