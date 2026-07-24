import Link from "next/link";

import { siteConfig } from "@/config/siteConfig";

const PrivacyPolicy = () => {
  const whatsappLink = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`;

  return (
    <main className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container">
        <header className="text-center mb-5">
          <h1 className="fw-bold display-5 mb-3" style={{ color: "#7d0ba7" }}>
            <i className="bi bi-shield-lock me-3" />
            Privacy Policy
          </h1>
          <p className="lead text-muted">
            How {siteConfig.company_name} collects, uses, and protects your
            information.
          </p>
        </header>

        <div className="row justify-content-center">
          <div className="col-lg-10">
            <section className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4 p-md-5">
                <h2 className="h3 fw-bold mb-3" style={{ color: "#7d0ba7" }}>
                  Introduction
                </h2>
                <p className="fs-5 lh-lg mb-0">
                  {siteConfig.company_name} is a Bangladesh-based online fashion
                  store offering women&apos;s shoes, bags, and fashion
                  accessories sourced directly from China through pre-order and
                  ready stock. We respect your privacy and use your information
                  only to operate our store, process orders, provide customer
                  support, and improve your shopping experience.
                </p>
              </div>
            </section>

            <section className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4 p-md-5">
                <h2 className="h3 fw-bold mb-4" style={{ color: "#7d0ba7" }}>
                  1. Information We May Collect
                </h2>
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="h-100 p-4 border rounded-3">
                      <h3 className="h5 fw-bold">Contact Information</h3>
                      <p className="mb-0">
                        Your name, phone number, email address, delivery address,
                        and any information you provide when contacting customer
                        care.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="h-100 p-4 border rounded-3">
                      <h3 className="h5 fw-bold">Order Information</h3>
                      <p className="mb-0">
                        Products ordered, shoe size, pre-order or ready-stock
                        status, delivery details, order history, and transaction
                        references.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="h-100 p-4 border rounded-3">
                      <h3 className="h5 fw-bold">Payment Information</h3>
                      <p className="mb-0">
                        Payment method, amount, and transaction confirmation
                        needed to verify and complete your purchase.
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="h-100 p-4 border rounded-3">
                      <h3 className="h5 fw-bold">Technical Information</h3>
                      <p className="mb-0">
                        Device, browser, IP address, and website usage information
                        that may be collected through cookies or similar
                        technologies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4 p-md-5">
                <h2 className="h3 fw-bold mb-3" style={{ color: "#7d0ba7" }}>
                  2. How We Use Your Information
                </h2>
                <ul className="lh-lg mb-0">
                  <li>Process, confirm, deliver, and track your orders.</li>
                  <li>
                    Coordinate pre-orders, ready-stock purchases, returns, and
                    shoe-size exchanges.
                  </li>
                  <li>
                    Contact you about order status, delivery, customer support,
                    and service updates.
                  </li>
                  <li>
                    Prevent fraud, maintain website security, and meet applicable
                    legal requirements.
                  </li>
                  <li>
                    Improve our products, services, and customer shopping
                    experience.
                  </li>
                </ul>
              </div>
            </section>

            <section className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4 p-md-5">
                <h2 className="h3 fw-bold mb-3" style={{ color: "#7d0ba7" }}>
                  3. Sharing Your Information
                </h2>
                <p>
                  We may share only the information necessary to complete your
                  order with trusted service providers, including couriers,
                  payment providers, technology providers, and suppliers involved
                  in pre-order fulfilment.
                </p>
                <p className="mb-0">
                  {siteConfig.company_name} does not sell or rent your personal
                  information. We may disclose information when required by law,
                  to protect our customers, or to prevent fraud and misuse.
                </p>
              </div>
            </section>

            <section className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4 p-md-5">
                <h2 className="h3 fw-bold mb-3" style={{ color: "#7d0ba7" }}>
                  4. Data Security and Retention
                </h2>
                <p className="mb-0">
                  We use reasonable administrative and technical safeguards to
                  protect your information. We keep personal information only for
                  as long as needed to fulfil orders, provide support, maintain
                  business records, resolve disputes, and comply with legal
                  obligations. No online system is completely secure, but we work
                  to prevent unauthorized access, loss, or misuse.
                </p>
              </div>
            </section>

            <section className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4 p-md-5">
                <h2 className="h3 fw-bold mb-3" style={{ color: "#7d0ba7" }}>
                  5. Cookies
                </h2>
                <p className="mb-0">
                  Our website may use cookies to keep the site working, remember
                  preferences, understand site usage, and improve performance.
                  You can control cookies through your browser settings, although
                  disabling some cookies may affect website features.
                </p>
              </div>
            </section>

            <section className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4 p-md-5">
                <h2 className="h3 fw-bold mb-3" style={{ color: "#7d0ba7" }}>
                  6. Your Choices
                </h2>
                <p className="mb-0">
                  You may contact us to ask about, correct, or update your
                  personal information. You may also request deletion where the
                  information is no longer required, subject to order records,
                  fraud prevention, and legal retention obligations.
                </p>
              </div>
            </section>

            <section className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4 p-md-5">
                <h2 className="h3 fw-bold mb-3" style={{ color: "#7d0ba7" }}>
                  7. Refunds and Exchanges
                </h2>
                <p>
                  Return and exchange requests may require order details, photos,
                  videos, or other information needed to review a product issue
                  or shoe-size exchange. We use this information only to assess
                  and resolve the request.
                </p>
                <Link
                  href="/frontEnd/return_policy"
                  className="fw-semibold text-decoration-none"
                  style={{ color: "#7d0ba7" }}
                >
                  Read our Refund &amp; Exchange Policy
                  <i className="bi bi-arrow-right ms-2" />
                </Link>
              </div>
            </section>

            <section className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4 p-md-5">
                <h2 className="h3 fw-bold mb-3" style={{ color: "#7d0ba7" }}>
                  8. Policy Updates
                </h2>
                <p className="mb-0">
                  We may update this Privacy Policy when our services or legal
                  requirements change. The latest version will be posted on this
                  page.
                </p>
              </div>
            </section>

            <section className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <h2 className="h3 fw-bold mb-3" style={{ color: "#7d0ba7" }}>
                  9. Contact Us
                </h2>
                <p className="text-muted">
                  Contact {siteConfig.company_name} with privacy questions or
                  requests.
                </p>

                <div className="row g-4">
                  <div className="col-md-6 col-lg-3">
                    <h3 className="h6 fw-bold mb-1">Phone</h3>
                    <a
                      className="text-decoration-none text-dark"
                      href={`tel:${siteConfig.phone}`}
                    >
                      {siteConfig.phone}
                    </a>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <h3 className="h6 fw-bold mb-1">WhatsApp</h3>
                    <a
                      className="text-decoration-none text-dark"
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {siteConfig.whatsapp}
                    </a>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <h3 className="h6 fw-bold mb-1">Customer Care</h3>
                    <div>
                      {siteConfig.customer_care.map((number, index) => (
                        <span key={number}>
                          <a
                            className="text-decoration-none text-dark"
                            href={`tel:${number}`}
                          >
                            {number}
                          </a>
                          {index < siteConfig.customer_care.length - 1 && ", "}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <h3 className="h6 fw-bold mb-1">E-Mail</h3>
                    <a
                      className="text-decoration-none text-dark text-break"
                      href={`mailto:${siteConfig.email}`}
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
