import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaWhatsappSquare,
  FaPhone,
  FaMapMarkerAlt,
  FaEnvelope,
  FaChevronRight
} from "react-icons/fa";

import { siteConfig } from "@/config/siteConfig";
import "./footer.css";

export default function Footer() {

  // const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: "All Products", href: "/frontEnd/shop" },
      { name: "New Arrivals", href: "/" },
      { name: "Best Sellers", href: "/" }
    ],
    support: [
      { name: "Privacy Policy", href: "/frontEnd/privacy_policy" },
      { name: "Returns & Exchanges", href: "/frontEnd/return_policy" },
      { name: "Size Guide", href: "/size-guide" }
    ],
    company: [
      { name: "About Us", href: "/frontEnd/about_us" },
      { name: "Our Story", href: "/" },
      { name: "Careers", href: "/" }
    ]
  };

  return (
    <footer className="footer_bg position-relative overflow-hidden pt-5">
      <div className="container py-4">
        <div className="row g-4">

          {/* Brand Column */}
          <div className="col-lg-4 col-md-6">
            <div className="footer-box rounded-4 p-4 h-100">

              <Link href="/" className="d-block mb-3">
                <Image
                  src="/img/logo.png"
                  alt={siteConfig.company_name}
                  width={180}
                  height={50}
                  style={{ objectFit: "contain" }}
                  priority
                  className="img-fluid"
                />
              </Link>

              <p className="text-white mb-4 small">
                {siteConfig.company_description}
              </p>

              {/* Social Links */}
              <div className="d-flex gap-2 mb-4 flex-wrap">

                {siteConfig.social.facebook && (
                  <a
                    href={siteConfig.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn btn-sm rounded-circle p-2"
                  >
                    <FaFacebook className="text-white" />
                  </a>
                )}

                {siteConfig.social.instagram && (
                  <a
                    href={siteConfig.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn btn-sm rounded-circle p-2"
                  >
                    <FaInstagram className="text-white" />
                  </a>
                )}

                {siteConfig.social.youtube && (
                  <a
                    href={siteConfig.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn btn-sm rounded-circle p-2"
                  >
                    <FaYoutube className="text-white" />
                  </a>
                )}

                {siteConfig.whatsapp && (
                  <a
                    href={`https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-btn btn-sm rounded-circle p-2"
                  >
                    <FaWhatsappSquare className="text-white" />
                  </a>
                )}
              </div>

              {/* Contact Info */}
              <div className="contact-box rounded-3 p-3">
                <h6 className="text-white mb-3 fw-bold">Contact Info</h6>

                {siteConfig.phone && (
                  <div className="d-flex align-items-center mb-2">
                    <FaPhone className="text-white me-2 fs-6" />
                    <a
                      href={`tel:${siteConfig.phone}`}
                      className="text-white small text-decoration-none"
                    >
                      {siteConfig.phone}
                    </a>
                  </div>
                )}

                {siteConfig.email && (
                  <div className="d-flex align-items-center mb-2">
                    <FaEnvelope className="text-white me-2 fs-6" />
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-white small text-decoration-none"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                )}

                {siteConfig.address && (
                  <div className="d-flex align-items-start">
                    <FaMapMarkerAlt className="text-white me-2 mt-1 fs-6" />
                    <span className="text-white small">
                      {siteConfig.address}
                    </span>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Links Columns */}
          <div className="col-lg-8">
            <div className="row g-4">
              {Object.entries(footerLinks).map(([key, links]) => (
                <div key={key} className="col-6 col-md-3">

                  <div className="footer-box rounded-4 p-4 h-100">

                    <h6
                      className="text-white mb-3 fw-bold text-uppercase small"
                      style={{ letterSpacing: "1px" }}
                    >
                      {key}
                    </h6>

                    <ul className="list-unstyled mb-0">
                      {links.map((link, index) => (
                        <li key={index} className="mb-2">

                          <Link
                            href={link.href}
                            className="text-white d-flex align-items-center text-decoration-none link-hover"
                          >
                            <FaChevronRight
                              className="me-2 chevron-icon"
                              style={{ fontSize: "10px" }}
                            />
                            <span className="small text-white">
                              {link.name}
                            </span>
                          </Link>

                        </li>
                      ))}
                    </ul>

                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Divider */}
        <hr className="my-4 border-white border-opacity-25" />

        {/* Bottom Bar */}
        <div className="row align-items-center py-3">

          <div className="col-12 mb-5 mb-md-3 mb-md-0 text-center text-md-center">
            <p className="text-white mb-0 small text-center">
              © {siteConfig.company_name}. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
