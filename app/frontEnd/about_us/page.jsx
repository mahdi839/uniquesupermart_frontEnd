"use client";

import { siteConfig } from "@/config/siteConfig";

const AboutUs = () => {
  const whatsappLink = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`;

  return (
    <main>
      <section
        className="py-5 theme-bg-primary-soft"
      >
        <div className="container py-lg-4">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="text-center mb-5">
                <h1
                  className="display-4 fw-bold mb-3 theme-text-primary"
                >
                  Welcome to {siteConfig.company_name}
                </h1>
                <p className="lead text-muted mb-0">
                  Your trusted online fashion store in Bangladesh
                </p>
              </div>

              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-md-5">
                  <h2 className="fw-bold mb-4 theme-text-primary">
                    About Us
                  </h2>

                  <p className="fs-5 lh-lg">
                    <strong>{siteConfig.company_name}</strong> is a trusted online
                    fashion store in Bangladesh, offering stylish women&apos;s
                    shoes, bags, and fashion accessories sourced directly from
                    China.
                  </p>

                  <p className="fs-5 lh-lg">
                    We bring the latest fashion trends through a combination of
                    pre-order and ready stock products, ensuring quality,
                    affordability, and a wide range of choices for our customers.
                  </p>

                  <p className="fs-5 lh-lg">
                    Our mission is to provide premium products, reliable service,
                    and a smooth shopping experience across Bangladesh.
                  </p>

                  <p className="fs-5 lh-lg mb-0">
                    Thank you for choosing{" "}
                    <strong>{siteConfig.company_name}</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-4">
                <h2 className="fw-bold theme-text-primary">
                  Contact Us
                </h2>
                <p className="text-muted mb-0">
                  We are here to help with your questions and orders.
                </p>
              </div>

              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-md-5">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="d-flex align-items-start">
                        <i
                          className="bi bi-telephone-fill me-3 fs-4 theme-text-primary"
                        />
                        <div>
                          <h3 className="h6 fw-bold mb-1">Phone</h3>
                          <a
                            className="text-decoration-none text-dark"
                            href={`tel:${siteConfig.phone}`}
                          >
                            {siteConfig.phone}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="d-flex align-items-start">
                        <i
                          className="bi bi-whatsapp me-3 fs-4"
                          style={{ color: "#25D366" }}
                        />
                        <div>
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
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="d-flex align-items-start">
                        <i
                          className="bi bi-headset me-3 fs-4 theme-text-primary"
                        />
                        <div>
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
                                {index < siteConfig.customer_care.length - 1 &&
                                  ", "}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="d-flex align-items-start">
                        <i
                          className="bi bi-envelope-fill me-3 fs-4 theme-text-primary"
                        />
                        <div>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
