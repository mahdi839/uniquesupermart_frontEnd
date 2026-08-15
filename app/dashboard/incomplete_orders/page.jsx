"use client";
import useFormatDate from "@/app/hooks/useFormatDate";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Pagination from "../orders/components/Pagination";
import PageLoader from "@/app/components/loader/pageLoader";
import District from "@/app/frontEnd/checkout/components/District";

const emptyItem = {
  id: "",
  title: "",
  size: "",
  unitPrice: 0,
  qty: 1,
  totalPrice: 0,
  colorImage: "",
  color_name: "",
};

const initialConvertForm = {
  name: "",
  phone: "",
  address: "",
  district: "",
  shipping_cost: 0,
  payment_method: "cash",
  delivery_notes: "",
  advance_payment: 0,
  cart: [{ ...emptyItem }],
};

const getItemSize = (item) =>
  item.size_name ||
  item.sizeName ||
  item.selected_size_name ||
  item.size?.size ||
  item.variant_value ||
  item.size ||
  "";

const getItemColorName = (item) =>
  item.color_name ||
  item.colorName ||
  item.selectedColorName ||
  item.selected_color_name ||
  item.color?.name ||
  "";

const getShippingCostForDistrict = (shippingConfig, district) => {
  if (!shippingConfig || !district) return 0;

  if (shippingConfig.one_shipping_cost) {
    return Number(shippingConfig.one_shipping_cost) || 0;
  }

  const isDhaka = String(district).toLowerCase() === "dhaka";
  return Number(isDhaka ? shippingConfig.inside_dhaka : shippingConfig.outside_dhaka) || 0;
};

export default function IncompleteOrder() {
  const [loading, setLoading] = useState(false);
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [convertLoading, setConvertLoading] = useState(false);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingConfig, setShippingConfig] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [convertForm, setConvertForm] = useState(initialConvertForm);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    status: "",
  });

  useEffect(() => {
    fetchData();
  }, [page]);

  useEffect(() => {
    fetchShippingConfig();
  }, []);

  useEffect(() => {
    if (!convertForm.district) return;

    setConvertForm((prev) => ({
      ...prev,
      shipping_cost: getShippingCostForDistrict(shippingConfig, prev.district),
    }));
  }, [shippingConfig, convertForm.district]);

  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  };

  const parseCartItems = (cartItems) => {
    if (Array.isArray(cartItems)) return cartItems;

    try {
      return JSON.parse(cartItems || "[]");
    } catch (error) {
      console.error("Invalid cart_items JSON:", error);
      return [];
    }
  };

  const normalizeCartItems = (cartItems) => {
    const parsedItems = parseCartItems(cartItems);

    if (!parsedItems.length) return [{ ...emptyItem }];

    return parsedItems.map((item) => {
      const qty = Number(item.qty) || 1;
      const unitPrice = Number(item.unitPrice ?? item.price) || 0;

      return {
        id: item.id || "",
        title: item.title || "",
        size: getItemSize(item),
        unitPrice,
        qty,
        totalPrice: Number(item.totalPrice) || unitPrice * qty,
        colorImage: item.colorImage || "",
        color_name: getItemColorName(item),
        image: item.colorImage || item.image || "",
      };
    });
  };

  const fetchShippingConfig = async () => {
    setShippingLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/shipping-costs-latest`
      );
      setShippingConfig(response.data || null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load shipping cost");
    } finally {
      setShippingLoading(false);
    }
  };

  const fetchData = async () => {
    const token = getToken();

    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}api/abandoned-checkouts?page=${page}`;

    const params = [];
    if (filters.start_date) params.push(`start_date=${filters.start_date}`);
    if (filters.end_date) params.push(`end_date=${filters.end_date}`);
    if (filters.status) params.push(`status=${filters.status}`);
    if (params.length > 0) url += `&${params.join("&")}`;

    setLoading(true);
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.data) {
        setData(
          (response.data.data.data || []).filter(
            (item) => !item.is_recovered && !item.converted_order_id
          )
        );
        setPagination({
          current_page: response.data.data.current_page || 1,
          last_page: response.data.data.last_page || 1,
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = () => {
    setPage(1);
    fetchData();
  };

  const handleResetFilters = () => {
    setFilters({
      start_date: "",
      end_date: "",
      status: "",
    });
    setPage(1);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    const token = getToken();

    setStatusLoadingId(orderId);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/dashboard/abandoned-checkouts/${orderId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData((prev) =>
        prev.map((item) =>
          item.id === orderId ? { ...item, status: newStatus } : item
        )
      );

      toast.success(response.data.message || "Status updated successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setStatusLoadingId(null);
    }
  };

  const openConvertModal = (order) => {
    setSelectedOrder(order);
    setConvertForm({
      ...initialConvertForm,
      name: order.name || "",
      phone: order.phone || "",
      address: order.address || "",
      cart: normalizeCartItems(order.cart_items),
    });
  };

  const closeConvertModal = () => {
    setSelectedOrder(null);
    setConvertForm(initialConvertForm);
  };

  const updateConvertField = (field, value) => {
    setConvertForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "district") {
        next.shipping_cost = getShippingCostForDistrict(shippingConfig, value);
      }

      return next;
    });
  };

  const updateCartItem = (index, field, value) => {
    setConvertForm((prev) => {
      const cart = [...prev.cart];
      const updatedItem = { ...cart[index], [field]: value };

      if (field === "qty" || field === "unitPrice") {
        const qty = Number(field === "qty" ? value : updatedItem.qty) || 0;
        const unitPrice =
          Number(field === "unitPrice" ? value : updatedItem.unitPrice) || 0;
        updatedItem.totalPrice = qty * unitPrice;
      }

      cart[index] = updatedItem;
      return { ...prev, cart };
    });
  };

  // const addCartItem = () => {
  //   setConvertForm((prev) => ({
  //     ...prev,
  //     cart: [...prev.cart, { ...emptyItem }],
  //   }));
  // };

  const removeCartItem = (index) => {
    setConvertForm((prev) => ({
      ...prev,
      cart:
        prev.cart.length > 1
          ? prev.cart.filter((_, itemIndex) => itemIndex !== index)
          : prev.cart,
    }));
  };

  const subtotal = useMemo(
    () =>
      convertForm.cart.reduce(
        (sum, item) => sum + (Number(item.totalPrice) || 0),
        0
      ),
    [convertForm.cart]
  );
  const total = subtotal + (Number(convertForm.shipping_cost) || 0);

  const handleConvertSubmit = async (e) => {
    e.preventDefault();

    if (!selectedOrder) return;

    const validCart = convertForm.cart.filter(
      (item) => item.id && item.title && Number(item.qty) > 0
    );

    if (!validCart.length) {
      toast.error("Please add at least one product item.");
      return;
    }

    const payload = {
      ...convertForm,
      shipping_cost: Number(convertForm.shipping_cost) || 0,
      advance_payment: Number(convertForm.advance_payment) || 0,
      cart: validCart.map((item) => ({
        ...item,
        id: Number(item.id),
        unitPrice: Number(item.unitPrice) || 0,
        qty: Number(item.qty) || 1,
        totalPrice: Number(item.totalPrice) || 0,
      })),
    };

    setConvertLoading(true);
    try {
      const token = getToken();
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/dashboard/abandoned-checkouts/${selectedOrder.id}/convert`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData((prev) =>
        prev.map((item) =>
          item.id === selectedOrder.id
            ? { ...item, ...response.data.checkout }
            : item
        )
      );

      toast.success(response.data.message || "Converted to order successfully");
      closeConvertModal();
    } catch (err) {
      toast.error(
        err.response?.data?.error || err.response?.data?.message || err.message
      );
    } finally {
      setConvertLoading(false);
    }
  };

  const { formatDate } = useFormatDate();

  return (
    <div className="container-fluid py-4">
      <div className="card mb-3 p-3">
        <div className="d-flex gap-3 align-items-end flex-wrap">
          <div>
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={filters.start_date}
              onChange={(e) =>
                setFilters({ ...filters, start_date: e.target.value })
              }
            />
          </div>

          <div>
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={filters.end_date}
              onChange={(e) =>
                setFilters({ ...filters, end_date: e.target.value })
              }
            />
          </div>

          <div>
            <label className="form-label">Status</label>
            <select
              className="form-select"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All</option>
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

          <button
            className="btn btn-primary"
            onClick={handleApplyFilters}
            disabled={loading}
          >
            {loading ? "Loading..." : "Filter"}
          </button>

          <button
            className="btn btn-secondary"
            onClick={handleResetFilters}
            disabled={loading}
          >
            Reset
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          {loading ? (
            <PageLoader />
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Cart Items</th>
                      <th>Status</th>
                      <th>Conversion</th>
                      <th>Date</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.length > 0 ? (
                      data.map((order, index) => {
                        const cartItems = parseCartItems(order.cart_items);
                        const isConverted = Boolean(order.converted_order_id);

                        return (
                          <tr key={order.id}>
                            <td>
                              {(pagination.current_page - 1) * 50 + index + 1}
                            </td>
                            <td>{order.name || "-"}</td>
                            <td>{order.phone || "-"}</td>
                            <td>{order.address || "-"}</td>
                            <td>
                              {cartItems.length > 0 ? (
                                <ul className="m-0 p-0 list-unstyled">
                                  {cartItems.map((item, i) => (
                                    <li key={i} className="mb-2">
                                      <div className="d-flex align-items-center gap-2">
                                        {(item.colorImage || item.image) && (
                                          <img
                                            src={item.colorImage || item.image}
                                            alt={item.title}
                                            width="40"
                                            height="40"
                                            style={{
                                              borderRadius: "5px",
                                              objectFit: "cover",
                                            }}
                                          />
                                        )}
                                        <div>
                                          <strong>{item.title || "-"}</strong>
                                          <div className="small text-muted">
                                            Qty: {item.qty} | Price: TK{" "}
                                            {item.unitPrice}
                                          </div>
                                          <div className="small text-muted">
                                            Size: {getItemSize(item) || "-"} | Color:{" "}
                                            {getItemColorName(item) || "-"}
                                          </div>
                                        </div>
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="text-muted">No items</span>
                              )}
                            </td>
                            <td style={{ minWidth: "180px" }}>
                              <select
                                className="form-select"
                                value={order.status || "pending"}
                                disabled={statusLoadingId === order.id}
                                onChange={(e) =>
                                  handleStatusChange(order.id, e.target.value)
                                }
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
                              {statusLoadingId === order.id && (
                                <small className="text-muted">
                                  Updating...
                                </small>
                              )}
                            </td>
                            <td>
                              {isConverted ? (
                                <span className="badge bg-success">
                                  Converted
                                </span>
                              ) : (
                                <span className="badge bg-warning text-dark">
                                  Incomplete
                                </span>
                              )}
                            </td>
                            <td>{formatDate(order.created_at)}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                disabled={isConverted}
                                onClick={() => openConvertModal(order)}
                              >
                                Convert to Order
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="9" className="text-center py-4">
                          No incomplete orders found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {pagination.last_page > 1 && (
                <Pagination
                  page={page}
                  setPage={setPage}
                  pagination={pagination}
                />
              )}
            </>
          )}
        </div>
      </div>

      {selectedOrder && (
        <div
          className="modal d-block convert-order-modal"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.62)" }}
        >
          <div className="modal-dialog modal-xl modal-dialog-scrollable convert-order-dialog">
            <div className="modal-content convert-order-content">
              <form onSubmit={handleConvertSubmit}>
                <div className="modal-header convert-order-header">
                  <div>
                    <div className="convert-kicker">Incomplete checkout</div>
                    <h5 className="modal-title">Convert to Order</h5>
                    <p className="convert-subtitle mb-0">
                      Review customer details, selected variants, and delivery cost.
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeConvertModal}
                    disabled={convertLoading}
                    aria-label="Close"
                  ></button>
                </div>

                <div className="modal-body">
                  <div className="convert-section">
                    <div className="convert-section-title">Customer & delivery</div>
                    <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Customer Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={convertForm.name}
                        onChange={(e) =>
                          updateConvertField("name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Phone *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={convertForm.phone}
                        onChange={(e) =>
                          updateConvertField("phone", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Payment Method *</label>
                      <select
                        className="form-select"
                        value={convertForm.payment_method}
                        onChange={(e) =>
                          updateConvertField("payment_method", e.target.value)
                        }
                        required
                      >
                        <option value="cash">Cash on Delivery</option>
                        <option value="bkash">Bkash</option>
                        <option value="card">Card Payment</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">District *</label>
                      <District
                        value={convertForm.district}
                        onChange={(selected) =>
                          updateConvertField("district", selected?.value || "")
                        }
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Shipping Cost *</label>
                      <div className="shipping-cost-box">
                        <span>TK</span>
                        <strong>{Number(convertForm.shipping_cost || 0).toFixed(2)}</strong>
                      </div>
                      <input type="hidden" value={convertForm.shipping_cost} />
                      <small className="text-muted">
                        {shippingLoading
                          ? "Loading shipping cost..."
                          : convertForm.district
                          ? "Auto calculated from district"
                          : "Select district to calculate"}
                      </small>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Advance Payment</label>
                      <input
                        type="number"
                        className="form-control"
                        value={convertForm.advance_payment}
                        onChange={(e) =>
                          updateConvertField("advance_payment", e.target.value)
                        }
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Address *</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={convertForm.address}
                        onChange={(e) =>
                          updateConvertField("address", e.target.value)
                        }
                        required
                      ></textarea>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Delivery Notes</label>
                      <textarea
                        className="form-control"
                        rows="2"
                        value={convertForm.delivery_notes}
                        onChange={(e) =>
                          updateConvertField("delivery_notes", e.target.value)
                        }
                      ></textarea>
                    </div>
                    </div>
                  </div>

                  <div className="convert-section mt-3">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <div className="convert-section-title mb-1">Order items</div>
                      <p className="convert-subtitle mb-0">
                        Size and color are prefilled from the customer&apos;s checkout selection.
                      </p>
                    </div>
                    {/* <button
                      type="button"
                      className="btn btn-sm btn-outline-primary"
                      onClick={addCartItem}
                    >
                      Add Item
                    </button> */}
                  </div>

                  <div className="table-responsive">
                    <table className="table convert-items-table align-middle">
                      <thead>
                        <tr>
                          <th style={{ minWidth: "84px" }}>Image</th>
                          <th style={{ minWidth: "90px" }}>Product ID *</th>
                          <th style={{ minWidth: "220px" }}>Title *</th>
                          <th style={{ minWidth: "90px" }}>Size</th>
                          <th style={{ minWidth: "110px" }}>Unit Price *</th>
                          <th style={{ minWidth: "90px" }}>Qty *</th>
                          <th style={{ minWidth: "120px" }}>Total</th>
                          <th style={{ minWidth: "130px" }}>Color Name</th>
                          <th style={{ width: "70px" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {convertForm.cart.map((item, index) => (
                          <tr key={index}>
                            <td>
                              {(item.colorImage || item.image) ? (
                                <img
                                  src={item.colorImage || item.image}
                                  alt={item.title || "Product"}
                                  className="convert-item-img"
                                />
                              ) : (
                                <div className="convert-item-img placeholder">No image</div>
                              )}
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={item.id}
                                onChange={(e) =>
                                  updateCartItem(index, "id", e.target.value)
                                }
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={item.title}
                                onChange={(e) =>
                                  updateCartItem(index, "title", e.target.value)
                                }
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={item.size || ""}
                                onChange={(e) =>
                                  updateCartItem(index, "size", e.target.value)
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={item.unitPrice}
                                onChange={(e) =>
                                  updateCartItem(
                                    index,
                                    "unitPrice",
                                    e.target.value
                                  )
                                }
                                min="0"
                                step="0.01"
                                required
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                className="form-control"
                                value={item.qty}
                                onChange={(e) =>
                                  updateCartItem(index, "qty", e.target.value)
                                }
                                min="1"
                                required
                              />
                            </td>
                            <td>TK {Number(item.totalPrice || 0).toFixed(2)}</td>
                            <td>
                              <input
                                type="text"
                                className="form-control"
                                value={item.color_name || ""}
                                onChange={(e) =>
                                  updateCartItem(
                                    index,
                                    "color_name",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeCartItem(index)}
                                disabled={convertForm.cart.length === 1}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="d-flex justify-content-end gap-4 fw-semibold">
                    <span>Subtotal: TK {subtotal.toFixed(2)}</span>
                    <span>Total: TK {total.toFixed(2)}</span>
                  </div>
                  </div>
                </div>

                <div className="modal-footer convert-order-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeConvertModal}
                    disabled={convertLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={convertLoading}
                  >
                    {convertLoading ? "Converting..." : "Save Order"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .convert-order-dialog {
          max-width: 1180px;
        }
        .convert-order-content {
          border: 0;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 24px 70px rgba(15, 23, 42, 0.24);
        }
        .convert-order-content form {
          display: flex;
          flex-direction: column;
          max-height: calc(100vh - 3.5rem);
          min-height: 0;
        }
        .convert-order-content .modal-body {
          overflow-y: auto;
          min-height: 0;
        }
        .convert-order-header {
          align-items: flex-start;
          background: linear-gradient(135deg, #111827, #374151);
          color: #fff;
          padding: 22px 26px;
          flex-shrink: 0;
        }
        .convert-order-header .btn-close {
          filter: invert(1) grayscale(1);
          opacity: 0.8;
        }
        .convert-kicker {
          color: #cbd5e1;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .convert-subtitle {
          color: #6b7280;
          font-size: 13px;
        }
        .convert-order-header .convert-subtitle {
          color: #e5e7eb;
        }
        .convert-section {
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          background: #fff;
          padding: 18px;
        }
        .convert-section-title {
          color: #111827;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }
        .shipping-cost-box {
          min-height: 39px;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: #f9fafb;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
        }
        .shipping-cost-box span {
          color: #6b7280;
          font-size: 12px;
          font-weight: 800;
        }
        .shipping-cost-box strong {
          color: #111827;
        }
        .convert-items-table {
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
        }
        .convert-items-table thead th {
          background: #f8fafc;
          color: #475569;
          font-size: 12px;
          font-weight: 800;
          border-bottom: 1px solid #e5e7eb;
        }
        .convert-items-table td {
          border-color: #eef2f7;
        }
        .convert-item-img {
          width: 56px;
          height: 56px;
          border-radius: 8px;
          object-fit: cover;
          border: 1px solid #e5e7eb;
          background: #f8fafc;
        }
        .convert-item-img.placeholder {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #94a3b8;
          font-size: 10px;
          text-align: center;
        }
        .convert-order-footer {
          background: #f8fafc;
          border-top: 1px solid #e5e7eb;
          flex-shrink: 0;
          position: sticky;
          bottom: 0;
          z-index: 3;
          box-shadow: 0 -10px 24px rgba(15, 23, 42, 0.08);
        }
        @media (max-width: 575.98px) {
          .convert-order-dialog {
            margin: 0.5rem;
          }
          .convert-order-content form {
            max-height: calc(100vh - 1rem);
          }
          .convert-order-header {
            padding: 16px;
          }
          .convert-order-footer {
            justify-content: stretch;
          }
          .convert-order-footer .btn {
            flex: 1 1 0;
          }
        }
      `}</style>
    </div>
  );
}
