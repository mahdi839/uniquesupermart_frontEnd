"use client"
import React from 'react';
import Head from 'next/head';
import { FaWhatsapp } from 'react-icons/fa';

const PrivacyPolicy = () => {
  return (
    <>
      <div className="container py-5">
        {/* Header Section */}
        <header className="text-center mb-5">
          <h1 className="fw-bold display-5 mb-3" style={{ color: 'var(--primary-color)' }}>
            <i className="bi bi-shield-lock me-3"></i>
            Privacy Policy
          </h1>
          <p className="lead text-muted">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <div className="alert alert-info mt-4">
            <div className="d-flex align-items-center">
              <i className="bi bi-info-circle-fill me-3" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
              <span>
                At eyarafashion.com, we value your privacy and are committed to protecting your personal information.
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
                  <a href="#introduction" className="list-group-item list-group-item-action d-flex align-items-center">
                    <i className="bi bi-house-door me-3" style={{ color: 'var(--primary-color)' }}></i>
                    Introduction
                  </a>
                  <a href="#information-we-collect" className="list-group-item list-group-item-action d-flex align-items-center">
                    <i className="bi bi-collection me-3" style={{ color: 'var(--primary-color)' }}></i>
                    Information We Collect
                  </a>
                  <a href="#how-we-use" className="list-group-item list-group-item-action d-flex align-items-center">
                    <i className="bi bi-gear me-3" style={{ color: 'var(--primary-color)' }}></i>
                    How We Use Information
                  </a>
                  <a href="#information-protection" className="list-group-item list-group-item-action d-flex align-items-center">
                    <i className="bi bi-shield-check me-3" style={{ color: 'var(--primary-color)' }}></i>
                    Information Protection
                  </a>
                  <a href="#sharing-information" className="list-group-item list-group-item-action d-flex align-items-center">
                    <i className="bi bi-share me-3" style={{ color: 'var(--primary-color)' }}></i>
                    Sharing Information
                  </a>
                  <a href="#cookies" className="list-group-item list-group-item-action d-flex align-items-center">
                    <i className="bi bi-cookie me-3" style={{ color: 'var(--primary-color)' }}></i>
                    Cookies & Tracking
                  </a>
                  <a href="#your-rights" className="list-group-item list-group-item-action d-flex align-items-center">
                    <i className="bi bi-person-check me-3" style={{ color: 'var(--primary-color)' }}></i>
                    Your Rights & Choices
                  </a>
                  <a href="#policy-updates" className="list-group-item list-group-item-action d-flex align-items-center">
                    <i className="bi bi-arrow-clockwise me-3" style={{ color: 'var(--primary-color)' }}></i>
                    Policy Updates
                  </a>
                  <a href="#contact-us" className="list-group-item list-group-item-action d-flex align-items-center">
                    <i className="bi bi-headset me-3" style={{ color: 'var(--primary-color)' }}></i>
                    Contact Us
                  </a>
                </div>
              </div>

              {/* Quick Facts Card */}
              <div className="card shadow-sm border-0 mt-4">
                <div className="card-body">
                  <h6 className="fw-bold" style={{ color: 'var(--primary-color)' }}><i className="bi bi-lightbulb me-2"></i>Key Points</h6>
                  <ul className="list-unstyled small">
                    <li className="mb-2"><i className="bi bi-dot me-1" style={{ color: 'var(--primary-color)' }}></i> We protect your data</li>
                    <li className="mb-2"><i className="bi bi-dot me-1" style={{ color: 'var(--primary-color)' }}></i> We don't sell your data</li>
                    <li className="mb-2"><i className="bi bi-dot me-1" style={{ color: 'var(--primary-color)' }}></i> Secure payment processing</li>
                    <li><i className="bi bi-dot me-1" style={{ color: 'var(--primary-color)' }}></i> You control your information</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-9 col-md-8">
            {/* Introduction Section */}
            <section id="introduction" className="mb-5">
              <div className="d-flex align-items-center mb-4">
                <div className="icon-wrapper rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: 'rgba(var(--primary-rgb), 0.1)' }}>
                  <i className="bi bi-house-door-fill" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                </div>
                <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>Introduction</h2>
              </div>
              
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <p className="card-text">
                    At eyarafashion.com, we value your privacy and are committed to protecting your personal information. 
                    This Privacy Policy outlines how we collect, use, and safeguard your data when you visit our website or make a purchase.
                  </p>
                  <div className="d-flex align-items-center mt-4 p-3 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                    <i className="bi bi-check-circle-fill me-3" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                    <span className="fw-semibold">By using eyarafashion.com, you agree to the terms outlined in this Privacy Policy.</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Information We Collect Section */}
            <section id="information-we-collect" className="mb-5">
              <div className="d-flex align-items-center mb-4">
                <div className="icon-wrapper rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: 'rgba(var(--primary-rgb), 0.1)' }}>
                  <i className="bi bi-collection-fill" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                </div>
                <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>1. Information We Collect</h2>
              </div>
              
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <p className="card-text">
                    When you visit or shop on eyarafashion.com, we may collect the following information:
                  </p>
                  
                  <div className="row mt-4">
                    <div className="col-md-6 mb-4">
                      <div className="p-4 h-100 border rounded">
                        <div className="d-flex align-items-center mb-3">
                          <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-color)', color: 'white' }}>
                            <i className="bi bi-person"></i>
                          </div>
                          <h5 className="fw-bold mb-0">Personal Information</h5>
                        </div>
                        <ul className="list-unstyled">
                          <li className="mb-2"><i className="bi bi-check me-2" style={{ color: 'var(--primary-color)' }}></i> Name</li>
                          <li className="mb-2"><i className="bi bi-check me-2" style={{ color: 'var(--primary-color)' }}></i> Phone number</li>
                          <li className="mb-2"><i className="bi bi-check me-2" style={{ color: 'var(--primary-color)' }}></i> Email address</li>
                          <li className="mb-2"><i className="bi bi-check me-2" style={{ color: 'var(--primary-color)' }}></i> Shipping address</li>
                          <li><i className="bi bi-check me-2" style={{ color: 'var(--primary-color)' }}></i> Payment details</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="col-md-6 mb-4">
                      <div className="p-4 h-100 border rounded">
                        <div className="d-flex align-items-center mb-3">
                          <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-color)', color: 'white' }}>
                            <i className="bi bi-cart-check"></i>
                          </div>
                          <h5 className="fw-bold mb-0">Order Information</h5>
                        </div>
                        <ul className="list-unstyled">
                          <li className="mb-2"><i className="bi bi-check me-2" style={{ color: 'var(--primary-color)' }}></i> Products purchased</li>
                          <li className="mb-2"><i className="bi bi-check me-2" style={{ color: 'var(--primary-color)' }}></i> Order history</li>
                          <li><i className="bi bi-check me-2" style={{ color: 'var(--primary-color)' }}></i> Transaction details</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="col-md-12 mb-4">
                      <div className="p-4 h-100 border rounded">
                        <div className="d-flex align-items-center mb-3">
                          <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-color)', color: 'white' }}>
                            <i className="bi bi-laptop"></i>
                          </div>
                          <h5 className="fw-bold mb-0">Device Information</h5>
                        </div>
                        <div className="row">
                          <div className="col-md-4">
                            <ul className="list-unstyled">
                              <li className="mb-2"><i className="bi bi-check me-2" style={{ color: 'var(--primary-color)' }}></i> IP address</li>
                              <li><i className="bi bi-check me-2" style={{ color: 'var(--primary-color)' }}></i> Browser type</li>
                            </ul>
                          </div>
                          <div className="col-md-8">
                            <div className="alert alert-secondary mb-0">
                              <i className="bi bi-info-circle me-2"></i>
                              <small>We may collect browsing behavior on our website to improve your experience.</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* How We Use Information Section */}
            <section id="how-we-use" className="mb-5">
              <div className="d-flex align-items-center mb-4">
                <div className="icon-wrapper rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: 'rgba(var(--primary-rgb), 0.1)' }}>
                  <i className="bi bi-gear-fill" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                </div>
                <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>2. How We Use Your Information</h2>
              </div>
              
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <p className="card-text">
                    We use the collected information to:
                  </p>
                  
                  <div className="row mt-4">
                    <div className="col-md-6 mb-3">
                      <div className="p-3 h-100 border-start border-3" style={{ borderLeftColor: 'var(--primary-color)' }}>
                        <h5 className="fw-bold d-flex align-items-center">
                          <i className="bi bi-cart-check me-2" style={{ color: 'var(--primary-color)' }}></i>
                          Process & Fulfill Orders
                        </h5>
                        <p className="mb-0">To process and fulfill your orders efficiently.</p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="p-3 h-100 border-start border-3" style={{ borderLeftColor: 'var(--primary-color)' }}>
                        <h5 className="fw-bold d-flex align-items-center">
                          <i className="bi bi-chat-dots me-2" style={{ color: 'var(--primary-color)' }}></i>
                          Communication
                        </h5>
                        <p className="mb-0">To communicate with you regarding order updates, promotions, or inquiries.</p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="p-3 h-100 border-start border-3" style={{ borderLeftColor: 'var(--primary-color)' }}>
                        <h5 className="fw-bold d-flex align-items-center">
                          <i className="bi bi-graph-up me-2" style={{ color: 'var(--primary-color)' }}></i>
                          Improve Services
                        </h5>
                        <p className="mb-0">To improve our website, products, and services.</p>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="p-3 h-100 border-start border-3" style={{ borderLeftColor: 'var(--primary-color)' }}>
                        <h5 className="fw-bold d-flex align-items-center">
                          <i className="bi bi-shield-lock me-2" style={{ color: 'var(--primary-color)' }}></i>
                          Prevent Fraud
                        </h5>
                        <p className="mb-0">To prevent fraud and ensure secure transactions.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Information Protection Section */}
            <section id="information-protection" className="mb-5">
              <div className="d-flex align-items-center mb-4">
                <div className="icon-wrapper rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: 'rgba(var(--primary-rgb), 0.1)' }}>
                  <i className="bi bi-shield-check" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                </div>
                <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>3. How We Protect Your Information</h2>
              </div>
              
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <p className="card-text">
                        We take appropriate security measures to protect your data from unauthorized access, 
                        disclosure, or misuse. Payment details are processed through secure payment gateways, 
                        and we do not store sensitive financial information.
                      </p>
                      
                      <div className="mt-4">
                        <h5 className="fw-bold" style={{ color: 'var(--primary-color)' }}><i className="bi bi-shield-lock me-2"></i>Security Measures</h5>
                        <ul className="list-unstyled">
                          <li className="mb-2"><i className="bi bi-check-circle me-2" style={{ color: 'var(--primary-color)' }}></i> Encrypted data transmission</li>
                          <li className="mb-2"><i className="bi bi-check-circle me-2" style={{ color: 'var(--primary-color)' }}></i> Secure payment gateways</li>
                          <li className="mb-2"><i className="bi bi-check-circle me-2" style={{ color: 'var(--primary-color)' }}></i> Regular security audits</li>
                          <li><i className="bi bi-check-circle me-2" style={{ color: 'var(--primary-color)' }}></i> Limited data access</li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-4 text-center">
                      <div className="p-4 rounded" style={{ backgroundColor: 'rgba(var(--primary-rgb), 0.05)' }}>
                        <i className="bi bi-shield-lock" style={{ fontSize: '3rem', color: 'var(--primary-color)' }}></i>
                        <p className="fw-bold mt-2 mb-0">Your Data is Safe</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Sharing Information Section */}
            <section id="sharing-information" className="mb-5">
              <div className="d-flex align-items-center mb-4">
                <div className="icon-wrapper rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: 'rgba(var(--primary-rgb), 0.1)' }}>
                  <i className="bi bi-share-fill" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                </div>
                <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>4. Sharing of Information</h2>
              </div>
              
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="alert alert-danger mb-4">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-exclamation-octagon-fill me-3" style={{ fontSize: '1.5rem' }}></i>
                      <h5 className="mb-0">We do not sell or rent your personal data to third parties.</h5>
                    </div>
                  </div>
                  
                  <p className="card-text">
                    However, we may share your information with:
                  </p>
                  
                  <div className="row mt-4">
                    <div className="col-md-4 mb-3">
                      <div className="p-3 text-center border rounded h-100">
                        <i className="bi bi-truck" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
                        <h6 className="fw-bold mt-2">Delivery Partners</h6>
                        <p className="small mb-0">To ensure your order reaches you.</p>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="p-3 text-center border rounded h-100">
                        <i className="bi bi-credit-card" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
                        <h6 className="fw-bold mt-2">Payment Processors</h6>
                        <p className="small mb-0">For secure transactions.</p>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="p-3 text-center border rounded h-100">
                        <i className="bi bi-building" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
                        <h6 className="fw-bold mt-2">Legal Authorities</h6>
                        <p className="small mb-0">If required by law or to prevent fraud.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Cookies Section */}
            <section id="cookies" className="mb-5">
              <div className="d-flex align-items-center mb-4">
                <div className="icon-wrapper rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: 'rgba(var(--primary-rgb), 0.1)' }}>
                  <i className="bi bi-cookie" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                </div>
                <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>5. Cookies & Tracking Technologies</h2>
              </div>
              
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <p className="card-text">
                        We use cookies to enhance your browsing experience, remember your preferences, 
                        and analyze website traffic.
                      </p>
                      
                      <div className="alert alert-warning mt-3">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-exclamation-triangle-fill me-3" style={{ color: 'var(--primary-color)' }}></i>
                          <div>
                            <h6 className="fw-bold mb-1">Cookie Settings</h6>
                            <p className="mb-0">
                              You can choose to disable cookies in your browser settings, but this may affect certain site functionalities.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 text-center">
                      <div className="p-4 rounded" style={{ backgroundColor: 'rgba(var(--primary-rgb), 0.05)' }}>
                        <i className="bi bi-cookie" style={{ fontSize: '3rem', color: 'var(--primary-color)' }}></i>
                        <p className="fw-bold mt-2 mb-0">Manage Cookies</p>
                        <small className="text-muted">In your browser settings</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Your Rights Section */}
            <section id="your-rights" className="mb-5">
              <div className="d-flex align-items-center mb-4">
                <div className="icon-wrapper rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: 'rgba(var(--primary-rgb), 0.1)' }}>
                  <i className="bi bi-person-check" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                </div>
                <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>6. Your Rights & Choices</h2>
              </div>
              
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <div className="p-4 h-100 border rounded">
                        <h5 className="fw-bold d-flex align-items-center" style={{ color: 'var(--primary-color)' }}>
                          <i className="bi bi-eye me-2"></i>Access & Deletion
                        </h5>
                        <p>You can request access to your personal data or ask us to delete it.</p>
                        <button className="btn btn-sm" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
                          Request Data Access
                        </button>
                      </div>
                    </div>
                    <div className="col-md-6 mb-4">
                      <div className="p-4 h-100 border rounded">
                        <h5 className="fw-bold d-flex align-items-center" style={{ color: 'var(--primary-color)' }}>
                          <i className="bi bi-envelope-x me-2"></i>Marketing Preferences
                        </h5>
                        <p>You can opt out of marketing emails at any time by clicking the "Unsubscribe" link.</p>
                        <button className="btn btn-sm btn-outline-secondary">
                          Manage Email Preferences
                        </button>
                      </div>
                    </div>
                    <div className="col-md-12">
                      <div className="p-4 border rounded">
                        <h5 className="fw-bold d-flex align-items-center" style={{ color: 'var(--primary-color)' }}>
                          <i className="bi bi-person-circle me-2"></i>Account Updates
                        </h5>
                        <p>You can update your account details through your eyarafashion.com profile.</p>
                        <div className="alert alert-info mb-0">
                          <i className="bi bi-info-circle me-2"></i>
                          <small>Keep your information up-to-date for better service and communication.</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Policy Updates Section */}
            <section id="policy-updates" className="mb-5">
              <div className="d-flex align-items-center mb-4">
                <div className="icon-wrapper rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: 'rgba(var(--primary-rgb), 0.1)' }}>
                  <i className="bi bi-arrow-clockwise" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                </div>
                <h2 className="fw-bold" style={{ color: 'var(--primary-color)' }}>7. Policy Updates</h2>
              </div>
              
              <div className="card shadow-sm border-0">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <p className="card-text">
                        We may update this Privacy Policy from time to time. Changes will be posted on this page, 
                        and we encourage you to review it periodically.
                      </p>
                      
                      <div className="mt-3">
                        <h6 className="fw-bold" style={{ color: 'var(--primary-color)' }}>Update Notification</h6>
                        <p className="small">We recommend checking this page regularly for any updates to our privacy practices.</p>
                      </div>
                    </div>
                    <div className="col-md-4 text-center">
                      <div className="p-4 rounded" style={{ backgroundColor: 'rgba(var(--primary-rgb), 0.05)' }}>
                        <i className="bi bi-bell" style={{ fontSize: '3rem', color: 'var(--primary-color)' }}></i>
                        <p className="fw-bold mt-2 mb-0">Stay Updated</p>
                        <small className="text-muted">Review policy periodically</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Contact Us Section */}
            <section id="contact-us" className="mb-5">
              <div className="card shadow-sm border-0" style={{ backgroundColor: 'rgba(var(--primary-rgb), 0.05)' }}>
                <div className="card-body p-5 text-center">
                  <h2 className="fw-bold mb-4" style={{ color: 'var(--primary-color)' }}>8. Contact Us</h2>
                  <p className="lead mb-4">
                    If you have any questions about our Privacy Policy, feel free to contact us.
                  </p>
                  
                  <div className="row justify-content-center mt-4">
                    <div className="col-md-8">
                      <div className="p-4 rounded" style={{ backgroundColor: 'white' }}>
                        <div className="d-flex align-items-center justify-content-center mb-3">
                          <i className="bi bi-headset me-3" style={{ fontSize: '2rem', color: 'var(--primary-color)' }}></i>
                          <h4 className="fw-bold mb-0">Get In Touch</h4>
                        </div>
                        <p className="mb-4">Our support team is ready to assist you with any privacy-related questions.</p>
                        
                        <div className="d-grid gap-2 d-md-flex justify-content-center">
                          <a 
                            href="https://wa.me/8801614477721" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-sm px-4 me-md-3" 
                            style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                          >
                            <FaWhatsapp /> Message on WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5">
                    <h5 className="fw-bold mb-4" style={{ color: 'var(--primary-color)' }}>Thank you for trusting eyarafashion.com! <span className="heart">💖</span></h5>
                    <p className="text-muted">
                      By using eyarafashion.com, you agree to the terms outlined in this Privacy Policy.
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
        
        /* Smooth scrolling for anchor links */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
};

export default PrivacyPolicy;