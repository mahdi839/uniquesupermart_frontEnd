// app/dashboard/orders/edit/[id]/page.jsx
"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import Select from "react-select";
import PageLoader from "@/app/components/loader/pageLoader";
import District from "@/app/frontEnd/checkout/components/District";
import "./orderEdit.css";

export default function EditOrderPage() {
    const router = useRouter();
    const params = useParams();
    const orderId = params.id;

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [token, setToken] = useState(null);

    // Form data
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        district: "",
        shipping_cost: 0,
        delivery_notes: "",
        payment_method: "cash_on_delivery",
        advance_payment: 0,
        status: "pending",
        coupon_code: "",
        discount_amount: 0,
    });

    const [items, setItems] = useState([]);
    const [deletedItems, setDeletedItems] = useState([]);

    // Available options
    const [products, setProducts] = useState([]);
    const [sizes, setSizes] = useState([]);

    const normalizeColorForApi = (color) => ({
        id: color?.id ?? null,
        code: color?.code ?? "",
        image: color?.image ?? "",
        name: color?.name ?? "",
    });

    // Get token
    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedToken = localStorage.getItem("token");
            setToken(savedToken);
        }
    }, []);

    // Fetch order data
    useEffect(() => {
        if (!token || !orderId) return;

        const fetchOrder = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/orders/${orderId}/edit`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const { order, products: prods, sizes: szs } = response.data.data;

                // Set form data
                setFormData({
                    name: order.name,
                    phone: order.phone,
                    email: order.email || "",
                    address: order.address,
                    district: order.district,
                    shipping_cost: order.shipping_cost,
                    delivery_notes: order.delivery_notes || "",
                    payment_method: order.payment_method,
                    advance_payment: order.advance_payment || 0,
                    status: order.status,
                    coupon_code: order.coupon_code || "",
                    discount_amount: order.discount_amount || 0,
                });

                // Set items
                const orderItems = order.order_items.map((item) => {
                    // Find the product to get colors
                    const product = prods.find(p => p.id === item.product_id);

                    // Match existing color by image path
                    let matchedColor = null;
                    if (item.colorImage && product?.colors) {
                        matchedColor = product.colors.find(
                            c => c.image === item.colorImage
                        );
                    }

                    return {
                        id: item.id,
                        product_id: item.product_id,
                        title: item.title,
                        size_id: item.selected_size,
                        color: matchedColor || (item.colorImage ? {
                            id: null,
                            code: null,
                            image: item.colorImage,
                            name: item.color_name || "",
                        } : null),
                        unitPrice: parseFloat(item.unitPrice),
                        qty: item.qty,
                        totalPrice: parseFloat(item.totalPrice),
                    };
                });
                setItems(orderItems);

                // Set products and sizes
                setProducts(prods);
                setSizes(szs);
            } catch (err) {
                console.error(err);
                toast.error(err.response?.data?.message || "Failed to load order");
                router.push("/dashboard/orders");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [token, orderId, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDistrictChange = (selectedOption) => {
        setFormData((prev) => ({
            ...prev,
            district: selectedOption ? selectedOption.value : "",
        }));
    };

    // Add new item
    const handleAddItem = () => {
        setItems([
            ...items,
            {
                id: null, // new item
                product_id: null,
                title: "",
                size_id: null,
                color: null,
                unitPrice: 0,
                qty: 1,
                totalPrice: 0,
            },
        ]);
    };

    // Remove item
    const handleRemoveItem = (index) => {
        const item = items[index];

        // If item has ID (existing), add to deleted list
        if (item.id) {
            setDeletedItems([...deletedItems, item.id]);
        }

        // Remove from items array
        setItems(items.filter((_, i) => i !== index));
    };

    // Update item field
    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = value;

        // Auto-calculate totalPrice
        if (field === "qty" || field === "unitPrice") {
            const qty = field === "qty" ? value : newItems[index].qty;
            const price = field === "unitPrice" ? value : newItems[index].unitPrice;
            newItems[index].totalPrice = qty * price;
        }

        setItems(newItems);
    };

    // When product is selected
    const handleProductSelect = (index, product) => {
        if (!product) return;

        const newItems = [...items];
        newItems[index].product_id = product.id;
        newItems[index].title = product.title;
        newItems[index].unitPrice = product.price || 0;
        newItems[index].totalPrice = newItems[index].qty * (product.price || 0);

        // Reset size and color
        newItems[index].size_id = null;
        newItems[index].color = null;

        setItems(newItems);
    };

    // Handle color selection
    const handleColorSelect = (index, color) => {
        const newItems = [...items];
        newItems[index].color = color;
        setItems(newItems);
    };

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const discountAmount = parseFloat(formData.discount_amount || 0);
    const total = Math.max(0, subtotal - discountAmount) + parseFloat(formData.shipping_cost || 0);
    
    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            toast.error("Authentication token not found");
            return;
        }

        if (items.length === 0) {
            toast.error("Please add at least one product");
            return;
        }

        setSubmitting(true);
        try {
            const invalidItem = items.find(
                (item) =>
                    !item.product_id ||
                    !item.title ||
                    !Number(item.qty) ||
                    Number(item.qty) < 1 ||
                    Number.isNaN(Number(item.unitPrice)) ||
                    Number.isNaN(Number(item.totalPrice))
            );

            if (invalidItem) {
                toast.error("Please complete all product rows before updating");
                setSubmitting(false);
                return;
            }

            const payload = {
                ...formData,
                shipping_cost: Number(formData.shipping_cost) || 0,
                advance_payment: Number(formData.advance_payment) || 0,
                items: items.map((item) => ({
                    id: item.id,
                    product_id: Number(item.product_id),
                    title: item.title,
                    size_id: item.size_id ? Number(item.size_id) : null,
                    color: normalizeColorForApi(item.color),
                    unitPrice: Number(item.unitPrice) || 0,
                    qty: Number(item.qty) || 1,
                    totalPrice: Number(item.totalPrice) || 0,
                })),
                deleted_items: deletedItems,
            };

            await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}api/orders/${orderId}`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            toast.success("Order updated successfully!");
            router.push("/dashboard/orders");
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to update order");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <PageLoader />;

    return (
        <div className="container-fluid py-4">
            <div className="card">
                <div className="card-header bg-light">
                    <h5 className="mb-0">Edit Order #{orderId}</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        {/* Customer Information */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <h6 className="border-bottom pb-2 mb-3">Customer Information</h6>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Name *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Phone *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label className="form-label">District *</label>
                                <District
                                    value={formData.district}
                                    onChange={handleDistrictChange}
                                />
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label">Address *</label>
                                <textarea
                                    className="form-control"
                                    name="address"
                                    rows="2"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-12 mb-3">
                                <label className="form-label">Delivery Notes</label>
                                <textarea
                                    className="form-control"
                                    name="delivery_notes"
                                    rows="2"
                                    value={formData.delivery_notes}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="row mb-4">
                            <div className="col-12 d-flex justify-content-between align-items-center mb-3">
                                <h6 className="border-bottom pb-2 mb-0">Order Items</h6>
                                <button
                                    type="button"
                                    className="btn btn-sm btn-primary"
                                    onClick={handleAddItem}
                                >
                                    + Add Product
                                </button>
                            </div>

                            {items.map((item, index) => (
                                <div key={item.id ?? `new-${index}`} className="col-12 mb-3">
                                    <div className="card border">
                                        <div className="card-body">
                                            <div className="row">
                                                {/* Product Selection */}
                                                <div className="col-md-4 mb-2">
                                                    <label className="form-label small">Product *</label>
                                                    <Select
                                                        options={products.map((p) => ({
                                                            value: p.id,
                                                            label: p.title,
                                                            product: p,
                                                        }))}
                                                        value={
                                                            item.product_id
                                                                ? {
                                                                    value: item.product_id,
                                                                    label: item.title,
                                                                }
                                                                : null
                                                        }
                                                        onChange={(opt) =>
                                                            handleProductSelect(index, opt?.product)
                                                        }
                                                        placeholder="Select product..."
                                                        isClearable
                                                    />
                                                </div>

                                                {/* Size Selection */}
                                                <div className="col-md-2 mb-2">
                                                    <label className="form-label small">Size</label>

                                                    {(() => {
                                                        const selectedProduct = products.find(p => p.id === item.product_id);
                                                        const productSizes = selectedProduct?.sizes || [];

                                                        if (!item.product_id) {
                                                            return <small className="text-muted">Select product first</small>;
                                                        }

                                                        if (productSizes.length === 0) {
                                                            return <small className="text-muted">No sizes available</small>;
                                                        }

                                                        return (
                                                            <select
                                                                className="form-select"
                                                                value={item.size_id || ""}
                                                                onChange={(e) =>
                                                                    handleItemChange(
                                                                        index,
                                                                        "size_id",
                                                                        e.target.value ? parseInt(e.target.value) : null
                                                                    )
                                                                }
                                                            >
                                                                <option value="">Select Size</option>
                                                                {productSizes.map((size) => (
                                                                    <option key={size.id} value={size.id}>
                                                                        {size.size}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        );
                                                    })()}
                                                </div>


                                                {/* Color Selection */}
                                                <div className="col-md-3 mb-2">
                                                    <label className="form-label small">Color</label>
                                                    <div className="d-flex gap-2 flex-wrap">
                                                        {item.product_id &&
                                                            products.find((p) => p.id === item.product_id)
                                                                ?.colors?.length > 0 ? (
                                                            products
                                                                .find((p) => p.id === item.product_id)
                                                                ?.colors?.map((color) => (
                                                                    <div
                                                                        key={color.id}
                                                                        onClick={() =>
                                                                            handleColorSelect(index, color)
                                                                        }
                                                                        style={{
                                                                            cursor: "pointer",
                                                                            border:
                                                                                item.color?.id === color.id
                                                                                    ? "3px solid #0d6efd"
                                                                                    : "2px solid #dee2e6",
                                                                            borderRadius: "8px",
                                                                            padding: "4px",
                                                                            transition: "all 0.2s",
                                                                        }}
                                                                        className="hover-shadow"
                                                                    >
                                                                        <img
                                                                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${color.image}`}
                                                                            alt={color.code || "Color"}
                                                                            style={{
                                                                                width: "50px",
                                                                                height: "50px",
                                                                                objectFit: "cover",
                                                                                borderRadius: "4px",
                                                                                display: "block",
                                                                            }}
                                                                            title={color.code || "Color option"}
                                                                        />
                                                                    </div>
                                                                ))
                                                        ) : (
                                                            <small className="text-muted">
                                                                No colors available
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Quantity */}
                                                <div className="col-md-1 mb-2">
                                                    <label className="form-label small">Qty *</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        min="1"
                                                        value={item.qty}
                                                        onChange={(e) =>
                                                            handleItemChange(
                                                                index,
                                                                "qty",
                                                                parseInt(e.target.value)
                                                            )
                                                        }
                                                        required
                                                    />
                                                </div>

                                                {/* Unit Price */}
                                                <div className="col-md-2 mb-2">
                                                    <label className="form-label small">Price *</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={item.unitPrice}
                                                        onChange={(e) =>
                                                            handleItemChange(
                                                                index,
                                                                "unitPrice",
                                                                parseFloat(e.target.value)
                                                            )
                                                        }
                                                        required
                                                    />
                                                </div>

                                                {/* Total */}
                                                <div className="col-md-1 mb-2 d-flex align-items-end">
                                                    <div className="w-100">
                                                        <label className="form-label small">Total</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={item.totalPrice.toFixed(2)}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>

                                                {/* Remove Button */}
                                                <div className="col-12 d-flex justify-content-end">
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleRemoveItem(index)}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="row mb-4">
                            <div className="col-12">
                                <h6 className="border-bottom pb-2 mb-3">Order Summary</h6>
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Payment Method *</label>
                                <select
                                    className="form-select"
                                    name="payment_method"
                                    value={formData.payment_method}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="cash_on_delivery">Cash on Delivery</option>
                                    <option value="bkash">bKash</option>
                                    <option value="nagad">Nagad</option>
                                    <option value="rocket">Rocket</option>
                                </select>
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Shipping Cost *</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="shipping_cost"
                                    value={formData.shipping_cost}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Advance Payment</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="advance_payment"
                                    value={formData.advance_payment}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label className="form-label">Status *</label>
                                <select
                                    className="form-select"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="pending">Pending</option>
                                    <option value="completed">Delivery Completed</option>
                                    <option value="placed">Placed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="processing">Processing</option>
                                    <option value="returned">Returned</option>
                                    <option value="paid_returned">Paid Returned</option>
                                    <option value="first_call">1st Call Done</option>
                                    <option value="second_call">2nd Call Done</option>
                                    <option value="third_call">3rd Call Done</option>
                                    <option value="stock_sold">Stock Sold</option>
                                    <option value="shipped_to_you">Shipped to Courier</option>
                                    <option value="received_in_bd">Received In BD</option>
                                    <option value="order_sent_to_china">Order Sent To China</option>
                                    <option value="file_completed">File Completed</option>
                                    <option value="order_confirmed">Order Confirmed</option>
                                </select>
                            </div>

                            <div className="col-md-8">
                                <div className="card bg-light">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Subtotal:</span>
                                            <strong>৳{subtotal.toFixed(2)}</strong>
                                        </div>
                                        {discountAmount > 0 && (
                                            <div className="d-flex justify-content-between mb-2 text-success">
                                                <span>
                                                    Coupon{formData.coupon_code ? ` (${formData.coupon_code})` : ""}:
                                                </span>
                                                <strong>-৳{discountAmount.toFixed(2)}</strong>
                                            </div>
                                        )}
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Shipping:</span>
                                            <strong>৳{parseFloat(formData.shipping_cost).toFixed(2)}</strong>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>Advance Payment:</span>
                                            <strong>৳{parseFloat(formData.advance_payment).toFixed(2)}</strong>
                                        </div>
                                        <hr />
                                        <div className="d-flex justify-content-between">
                                            <span className="h6">Total:</span>
                                            <strong className="h6">৳{total.toFixed(2)}</strong>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <span className="h6">Due:</span>
                                            <strong className="h6 text-danger">
                                                ৳{(total - parseFloat(formData.advance_payment)).toFixed(2)}
                                            </strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="row">
                            <div className="col-12 d-flex gap-2 justify-content-end">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => router.push("/dashboard/orders")}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={submitting}
                                >
                                    {submitting ? "Updating..." : "Update Order"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
