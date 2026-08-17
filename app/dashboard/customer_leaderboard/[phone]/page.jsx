"use client"
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import PageLoader from "@/app/components/loader/pageLoader"
import useFormatDate from "@/app/hooks/useFormatDate"
import Zoom from "react-medium-image-zoom"
import "react-medium-image-zoom/dist/styles.css"
import { 
  FaPhone, FaEnvelope, FaMapMarkerAlt, FaShoppingBag, 
  FaMoneyBillWave, FaCalendar, FaStar, FaTrophy, FaArrowLeft 
} from "react-icons/fa"
import CustomerBadgeChip from "../../customers/components/CustomerBadgeChip"

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const phone = params.phone;
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const { formatDate } = useFormatDate();

  useEffect(() => {
    if (phone) {
      fetchCustomerDetails();
    }
  }, [phone]);

  const fetchCustomerDetails = async () => {
    try {
      let token = null;
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token");
      }

      const response = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + `api/customers/${phone}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setCustomer(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching customer details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!customer) {
    return (
      <div className="container-fluid py-4">
        <div className="alert alert-warning">Customer not found</div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Back Button */}
      <button 
        className="btn btn-outline-primary mb-3"
        onClick={() => router.back()}
      >
        <FaArrowLeft className="me-2" />
        Back to Leaderboard
      </button>

      {/* Customer Overview */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start flex-wrap">
                <div>
                  <h2 className="mb-2">{customer.name}</h2>
                  <div className="mb-2">
                    <span
                      className={`badge ${
                        customer.badge === "new" ? "bg-info" : "bg-warning"
                      } text-dark`}
                      style={{ fontSize: '1rem', padding: '8px 16px' }}
                    >
                      {customer.badge === "new" ? (
                        <>
                          <FaStar className="me-2" size={14} />
                          New Customer
                        </>
                      ) : (
                        <>
                          <FaTrophy className="me-2" size={14} />
                          Repeat Customer
                        </>
                      )}
                    </span>
                    {customer.assigned_badge && (
                      <span className="ms-2">
                        <CustomerBadgeChip badge={customer.assigned_badge} />
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-end">
                  <h3 className="text-success mb-1">৳ {customer.total_spent.toLocaleString()}</h3>
                  <small className="text-muted">Total Spent</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information & Statistics */}
      <div className="row mb-4">
        {/* Contact Information */}
        <div className="col-lg-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Contact Information</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <FaPhone className="me-2 text-primary" />
                <strong>Phone:</strong> {customer.phone}
              </div>
              {customer.email && (
                <div className="mb-3">
                  <FaEnvelope className="me-2 text-info" />
                  <strong>Email:</strong> {customer.email}
                </div>
              )}
              <div className="mb-3">
                <FaMapMarkerAlt className="me-2 text-danger" />
                <strong>District:</strong> {customer.district || "N/A"}
              </div>
              <div>
                <FaMapMarkerAlt className="me-2 text-danger" />
                <strong>Address:</strong> {customer.address || "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="col-lg-6 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Order Statistics</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-6 mb-3">
                  <div className="text-center p-3 bg-light rounded">
                    <FaShoppingBag className="text-primary mb-2" size={30} />
                    <h4 className="mb-0">{customer.total_orders}</h4>
                    <small className="text-muted">Total Orders</small>
                  </div>
                </div>
                <div className="col-6 mb-3">
                  <div className="text-center p-3 bg-light rounded">
                    <FaMoneyBillWave className="text-success mb-2" size={30} />
                    <h4 className="mb-0">৳ {customer.total_spent.toLocaleString()}</h4>
                    <small className="text-muted">Total Spent</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center p-3 bg-light rounded">
                    <FaCalendar className="text-info mb-2" size={30} />
                    <p className="mb-0 small">{formatDate(customer.first_order_date || "")}</p>
                    <small className="text-muted">First Order</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-center p-3 bg-light rounded">
                    <FaCalendar className="text-warning mb-2" size={30} />
                    <p className="mb-0 small">{formatDate(customer.last_order_date || "")}</p>
                    <small className="text-muted">Last Order</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order History */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-info text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Order History ({customer.orders?.length || 0} orders)</h5>
            </div>
            <div className="card-body">
              {customer.orders?.length > 0 ? (
                <div className="accordion" id="orderAccordion">
                  {customer.orders.map((order, index) => (
                    <div key={order.id} className="accordion-item mb-2">
                      <h2 className="accordion-header">
                        <button
                          className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`}
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target={`#order-${order.id}`}
                        >
                          <div className="d-flex justify-content-between w-100 me-3">
                            <div>
                              <strong>Order #{order.order_number}</strong>
                              <span className="ms-3 text-muted">
                                {formatDate(order.created_at)}
                              </span>
                            </div>
                            <div>
                              <span className={`badge ${
                                order.status === 'delivered' ? 'bg-success' :
                                order.status === 'pending' ? 'bg-warning' :
                                order.status === 'cancel' ? 'bg-danger' :
                                'bg-primary'
                              } me-2`}>
                                {order.status}
                              </span>
                              <strong className="text-success">৳ {order.total}</strong>
                            </div>
                          </div>
                        </button>
                      </h2>
                      <div
                        id={`order-${order.id}`}
                        className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
                        data-bs-parent="#orderAccordion"
                      >
                        <div className="accordion-body">
                          <div className="row">
                            <div className="col-md-6 mb-3">
                              <h6 className="border-bottom pb-2">Order Details</h6>
                              <p className="mb-1"><strong>Payment Method:</strong> {order.payment_method}</p>
                              <p className="mb-1"><strong>Shipping Cost:</strong> ৳ {order.shipping_cost}</p>
                              <p className="mb-1"><strong>Subtotal:</strong> ৳ {order.subtotal}</p>
                              <p className="mb-1"><strong>Total:</strong> ৳ {order.total}</p>
                              {order.delivery_notes && (
                                <p className="mb-1"><strong>Notes:</strong> {order.delivery_notes}</p>
                              )}
                              <p className="mb-0">
                                <strong>Courier Entry:</strong>{' '}
                                <span className={`badge ${order.courier_entry ? 'bg-success' : 'bg-secondary'}`}>
                                  {order.courier_entry ? 'Completed' : 'Pending'}
                                </span>
                              </p>
                            </div>
                            <div className="col-md-6">
                              <h6 className="border-bottom pb-2">Ordered Items</h6>
                              {order.items?.map((item, itemIndex) => (
                                <div key={item.id} className="mb-2 p-2 border rounded bg-light">
                                  <div className="d-flex align-items-start gap-2">
                                    {item.colorImage && (
                                      <Zoom>
                                        <img
                                          width={60}
                                          height={60}
                                          src={item.colorImage}
                                          alt={item.title}
                                          className="rounded border"
                                          style={{ objectFit: 'cover' }}
                                        />
                                      </Zoom>
                                    )}
                                    <div className="flex-grow-1">
                                      <strong className="d-block">{itemIndex + 1}. {item.title}</strong>
                                      <small className="text-muted d-block">
                                        Qty: {item.qty} × ৳{item.unitPrice} = ৳{item.totalPrice}
                                      </small>
                                      {item.selected_size && (
                                        <small className="d-block text-info">
                                          Size: {item.selected_size}
                                        </small>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted">No orders found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}