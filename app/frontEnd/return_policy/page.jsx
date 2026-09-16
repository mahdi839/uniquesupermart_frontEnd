"use client"
import React from 'react';


const ReturnRefundPolicy = () => {
    return (
        <>
            <div className="container py-5">
                {/* Header Section */}
                <header className="text-center mb-5">
                    <h1 className="fw-bold display-5 mb-3" style={{ color: 'var(--primary-color)' }}>
                        <i className="bi bi-arrow-left-right me-3"></i>
                        Return & Refund Policy
                    </h1>
                    <p className="lead text-muted">
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <div className="alert alert-info mt-4">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-info-circle-fill me-3" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                            <span>
                                At eyarafashion.com, we operate on a pre-order system and source products directly from international suppliers.
                                Please read our policy carefully before placing an order.
                            </span>
                        </div>
                    </div>
                </header>

                <div className="row">
                    <div className="col-lg-3 col-md-4 mb-4">
                        {/* Policy Navigation */}
                        <div className="sticky-top" style={{ top: '20px' }}>
                            <div className="card shadow-sm border-0">
                                <div className="card-header py-3" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
                                    <h5 className="mb-0"><i className="bi bi-list me-2"></i>Policy Sections</h5>
                                </div>
                                <div className="list-group list-group-flush">
                                    <a href="#order-cancellation" className="list-group-item list-group-item-action d-flex align-items-center">
                                        <i className="bi bi-x-circle me-3" style={{ color: 'var(--primary-color)' }}></i>
                                        Order Cancellation & Refunds
                                    </a>
                                    <a href="#delivery-timeline" className="list-group-item list-group-item-action d-flex align-items-center">
                                        <i className="bi bi-truck me-3" style={{ color: 'var(--primary-color)' }}></i>
                                        Delivery Timeline & Delays
                                    </a>
                                    <a href="#order-modifications" className="list-group-item list-group-item-action d-flex align-items-center">
                                        <i className="bi bi-pencil-square me-3" style={{ color: 'var(--primary-color)' }}></i>
                                        Order Modifications
                                    </a>
                                    <a href="#no-return" className="list-group-item list-group-item-action d-flex align-items-center">
                                        <i className="bi bi-ban me-3" style={{ color: 'var(--primary-color)' }}></i>
                                        No Return Policy
                                    </a>
                                    <a href="#exceptional-cases" className="list-group-item list-group-item-action d-flex align-items-center">
                                        <i className="bi bi-exclamation-triangle me-3" style={{ color: 'var(--primary-color)' }}></i>
                                        Exceptional Cases
                                    </a>
                                    <a href="#contact" className="list-group-item list-group-item-action d-flex align-items-center">
                                        <i className="bi bi-headset me-3" style={{ color: 'var(--primary-color)' }}></i>
                                        Contact Support
                                    </a>
                                </div>
                            </div>

                            {/* Key Points Card */}
                            <div className="card shadow-sm border-0 mt-4">
                                <div className="card-body">
                                    <h6 className="fw-bold" style={{ color: 'var(--primary-color)' }}><i className="bi bi-key me-2"></i>Key Points</h6>
                                    <ul className="list-unstyled small">
                                        <li className="mb-2"><i className="bi bi-dot me-1" style={{ color: 'var(--primary-color)' }}></i> Pre-order system</li>
                                        <li className="mb-2"><i className="bi bi-dot me-1" style={{ color: 'var(--primary-color)' }}></i> International sourcing</li>
                                        <li className="mb-2"><i className="bi bi-dot me-1" style={{ color: 'var(--primary-color)' }}></i> Strict no return policy</li>
                                        <li><i className="bi bi-dot me-1" style={{ color: 'var(--primary-color)' }}></i> 24-hour window for issues</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-9 col-md-8">
                        {/* Introduction Section */}
                        <div className="card shadow-sm border-0 mb-4">
                            <div className="card-body">
                                <p className="card-text">
                                    At eyarafashion.com, we value our customers and strive to provide a smooth and hassle-free shopping experience.
                                    However, since we operate on a pre-order system and source products directly from international suppliers,
                                    we have a strict No Return & No Refund Policy under normal circumstances.
                                </p>
                                <div className="d-flex align-items-center mt-3 p-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                                    <i className="bi bi-exclamation-triangle-fill me-3" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                                    <span className="fw-semibold">By placing an order with eyarafashion.com, you agree to the policies outlined on this page.</span>
                                </div>
                            </div>
                        </div>

                        {/* Policy Sections */}
                        <section id="order-cancellation" className="mb-5">
                            <div className="d-flex align-items-center mb-4">
                                <div className="icon-wrapper rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: 'rgba(var(--primary-rgb), 0.1)' }}>
                                    <i className="bi bi-x-circle-fill" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                                </div>
                                <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>1. Order Cancellation & Refunds</h2>
                            </div>

                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <div className="policy-point p-3 h-100 border-start border-3" style={{ borderLeftColor: 'var(--primary-color)' }}>
                                                <h5 className="fw-bold">No Cancellations After Confirmation</h5>
                                                <p className="mb-0">Once your order is confirmed, it cannot be canceled for any reason.</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="policy-point p-3 h-100 border-start border-3" style={{ borderLeftColor: 'var(--primary-color)' }}>
                                                <h5 className="fw-bold">Non-refundable Advance Payment</h5>
                                                <p className="mb-0">If you choose to cancel after confirmation, the advance payment will not be refunded.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="alert alert-warning mt-3">
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-check-circle-fill me-3" style={{ color: 'var(--primary-color)' }}></i>
                                            <span className="fw-semibold">We request customers to double-check all order details before confirming their purchase.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="delivery-timeline" className="mb-5">
                            <div className="d-flex align-items-center mb-4">
                                <div className="icon-wrapper rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: 'rgba(var(--primary-rgb), 0.1)' }}>
                                    <i className="bi bi-truck" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                                </div>
                                <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>2. Delivery Timeline & Delays</h2>
                            </div>

                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <p className="card-text">
                                        Since our products are imported from outside the country, delivery may sometimes take longer than the estimated timeframe due to:
                                    </p>

                                    <div className="row mt-4">
                                        <div className="col-md-6 mb-3">
                                            <div className="p-3 h-100 border rounded">
                                                <div className="d-flex align-items-center mb-2">
                                                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '30px', height: '30px', backgroundColor: 'var(--primary-color)', color: 'white' }}>
                                                        <i className="bi bi-building"></i>
                                                    </div>
                                                    <h5 className="fw-bold mb-0">Customs Clearance</h5>
                                                </div>
                                                <p className="mb-0">Delays due to customs clearance processes.</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="p-3 h-100 border rounded">
                                                <div className="d-flex align-items-center mb-2">
                                                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '30px', height: '30px', backgroundColor: 'var(--primary-color)', color: 'white' }}>
                                                        <i className="bi bi-calendar-event"></i>
                                                    </div>
                                                    <h5 className="fw-bold mb-0">Holidays</h5>
                                                </div>
                                                <p className="mb-0">National and public holidays affecting delivery.</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <div className="p-3 h-100 border rounded">
                                                <div className="d-flex align-items-center mb-2">
                                                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '30px', height: '30px', backgroundColor: 'var(--primary-color)', color: 'white' }}>
                                                        <i className="bi bi-shield-exclamation"></i>
                                                    </div>
                                                    <h5 className="fw-bold mb-0">Unforeseen Circumstances</h5>
                                                </div>
                                                <p className="mb-0">Events like COVID-19 restrictions, natural disasters, etc.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="alert alert-primary mt-4">
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-clock-history me-3" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                                            <div>
                                                <h6 className="fw-bold mb-1">Delivery Buffer Period</h6>
                                                <p className="mb-0">We recommend allowing an additional one-week buffer period beyond the estimated delivery time when placing an order.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="order-modifications" className="mb-5">
                            <div className="d-flex align-items-center mb-4">
                                <div className="icon-wrapper rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: 'rgba(var(--primary-rgb), 0.1)' }}>
                                    <i className="bi bi-pencil-square" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                                </div>
                                <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>3. Order Modifications</h2>
                            </div>

                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col-md-8">
                                            <p className="card-text">
                                                Customers can modify product details (e.g., color, size) only until the order deadline for that shipment.
                                            </p>
                                            <p className="card-text fw-semibold">
                                                After the final order submission date, no changes can be made.
                                            </p>
                                        </div>
                                        <div className="col-md-4 text-center">
                                            <div className="p-4 rounded" style={{ backgroundColor: 'rgba(var(--primary-rgb), 0.05)' }}>
                                                <i className="bi bi-calendar-check" style={{ fontSize: '3rem', color: 'var(--primary-color)' }}></i>
                                                <p className="fw-bold mt-2 mb-0">Check Order Deadline</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="no-return" className="mb-5">
                            <div className="d-flex align-items-center mb-4">
                                <div className="icon-wrapper rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: 'rgba(var(--primary-rgb), 0.1)' }}>
                                    <i className="bi bi-ban" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                                </div>
                                <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>4. No Return Policy</h2>
                            </div>

                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <div className="alert alert-danger">
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-exclamation-octagon-fill me-3" style={{ fontSize: '1.5rem' }}></i>
                                            <h5 className="mb-0">Important: Strict No Return Policy</h5>
                                        </div>
                                    </div>

                                    <p className="card-text">
                                        As we do not have a return policy, customers must thoroughly verify product details before confirming their order.
                                    </p>

                                    <div className="row mt-4">
                                        <div className="col-md-6">
                                            <div className="p-3 border rounded h-100">
                                                <h6 className="fw-bold" style={{ color: 'var(--primary-color)' }}><i className="bi bi-check-circle me-2"></i>Before Ordering</h6>
                                                <ul>
                                                    <li>Check product dimensions</li>
                                                    <li>Verify color preferences</li>
                                                    <li>Confirm size requirements</li>
                                                    <li>Review product descriptions</li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="p-3 border rounded h-100">
                                                <h6 className="fw-bold" style={{ color: 'var(--primary-color)' }}><i className="bi bi-chat-dots me-2"></i>Special Requirements</h6>
                                                <p className="mb-0">
                                                    If you have specific requirements (e.g., color, size), please mention them while placing the order.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="exceptional-cases" className="mb-5">
                            <div className="d-flex align-items-center mb-4">
                                <div className="icon-wrapper rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: 'rgba(var(--primary-rgb), 0.1)' }}>
                                    <i className="bi bi-exclamation-triangle" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                                </div>
                                <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>5. Exceptional Cases</h2>
                            </div>

                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <p className="card-text">
                                        If the product you receive is completely different from what you ordered or has a major defect,
                                        please contact us within 24 hours of receiving the product with clear photos/videos as proof.
                                    </p>

                                    <div className="row mt-4">
                                        <div className="col-md-6 mb-4">
                                            <div className="p-4 text-center border rounded h-100" style={{ backgroundColor: 'rgba(var(--primary-rgb), 0.03)' }}>
                                                <i className="bi bi-camera-video" style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }}></i>
                                                <h5 className="fw-bold mt-3">Provide Evidence</h5>
                                                <p className="mb-0">Take clear photos/videos showing the issue with the product.</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6 mb-4">
                                            <div className="p-4 text-center border rounded h-100" style={{ backgroundColor: 'rgba(var(--primary-rgb), 0.03)' }}>
                                                <i className="bi bi-clock" style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }}></i>
                                                <h5 className="fw-bold mt-3">24-Hour Window</h5>
                                                <p className="mb-0">Contact us within 24 hours of receiving the product.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="alert alert-success mt-3">
                                        <div className="d-flex align-items-center">
                                            <i className="bi bi-shield-check me-3" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                                            <div>
                                                <h6 className="fw-bold mb-1">Assessment & Resolution</h6>
                                                <p className="mb-0">
                                                    We will assess the issue and, if applicable, provide a possible resolution (such as replacement or partial refund).
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="contact" className="mb-5">
                            <div className="card shadow-sm border-0" style={{ backgroundColor: 'rgba(var(--primary-rgb), 0.05)' }}>
                                <div className="card-body p-5 text-center">
                                    <h2 className="fw-bold mb-4" style={{ color: 'var(--primary-color)' }}>Need Help?</h2>
                                    <p className="lead mb-4">
                                        If you have any questions about our Return & Refund Policy, feel free to contact our support team.
                                    </p>

                                    <div className="row justify-content-center mt-4">
                                        <div className="col-md-8">
                                            <div className="p-4 rounded" style={{ backgroundColor: 'white' }}>
                                                <div className="d-flex align-items-center justify-content-center mb-3">
                                                    <i className="bi bi-headset me-3" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
                                                    <h4 className="fw-bold mb-0">Contact Support</h4>
                                                </div>
                                                <p className="mb-4">Our customer support team is here to help you with any questions or concerns.</p>

                                                <div className="d-grid gap-2 d-md-flex justify-content-center">
                                                    <a
                                                        href="https://wa.me/8801614477721"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm px-4 me-md-3"
                                                        style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                                                    >
                                                        <i className="bi bi-whatsapp me-2"></i>Message Us On WhatsApp
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-5">
                                        <h5 className="fw-bold mb-4" style={{ color: 'var(--primary-color)' }}>Thank you for shopping with Zuberee.com! <span className="heart">💖</span></h5>
                                        <p className="text-muted">
                                            By placing an order with Zuberee.com, you agree to the above policies.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .heart {
          font-size: 1.5rem;
          vertical-align: middle;
        }
        
        .policy-point:hover {
          background-color: rgba(var(--primary-rgb), 0.03);
          transition: background-color 0.3s ease;
        }
        
        .list-group-item.active {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
        }
        
        .list-group-item:hover {
          background-color: rgba(var(--primary-rgb), 0.05);
        }
        
        .icon-wrapper {
          transition: transform 0.3s ease;
        }
        
        .icon-wrapper:hover {
          transform: scale(1.05);
        }
        
        .btn:hover {
          transform: translateY(-2px);
          transition: transform 0.2s ease;
        }
      `}</style>
        </>
    );
};

export default ReturnRefundPolicy;