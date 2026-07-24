import { siteConfig } from "@/config/siteConfig";

const ReturnRefundPolicy = () => {
  const whatsappLink = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`;

  return (
    <main className="py-5" style={{ backgroundColor: "#f8f9fa" }}>
      <div className="container">
        <header className="text-center mb-5">
          <h1 className="fw-bold display-5 mb-3 theme-text-primary">
            <i className="bi bi-arrow-left-right me-3" />
            Refund &amp; Exchange Policy
          </h1>
          <p className="lead text-muted mb-0">{siteConfig.company_name}</p>
        </header>

        <div className="row justify-content-center">
          <div className="col-lg-9">
            <section className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4 p-md-5" lang="bn">
                <h2 className="h3 fw-bold mb-4 theme-text-primary">
                  আমাদের রিটার্ন এবং এক্সচেঞ্জ পলিসি
                </h2>

                <div
                  className="p-4 rounded-3 mb-4 theme-bg-primary-soft theme-border-start-primary"
                >
                  <div className="d-flex align-items-start">
                    <i
                      className="bi bi-box-arrow-in-left fs-4 me-3 theme-text-primary"
                    />
                    <p className="fs-5 lh-lg mb-0">
                      প্রোডাক্টের সমস্যা যেমন: প্রোডাক্ট ভাঙ্গা, ছেঁড়া,
                      প্রোডাক্ট কাজ না করা, ছবির সাথে প্রোডাক্টের মিল না থাকা
                      ইত্যাদি ক্ষেত্রে শুধু আপনি রিটার্ন করতে পারবেন।
                    </p>
                  </div>
                </div>

                <div
                  className="p-4 rounded-3"
                  style={{
                    backgroundColor: "rgba(37, 211, 102, 0.08)",
                    borderLeft: "4px solid #25D366",
                  }}
                >
                  <div className="d-flex align-items-start">
                    <i
                      className="bi bi-arrow-repeat fs-4 me-3"
                      style={{ color: "#25D366" }}
                    />
                    <p className="fs-5 lh-lg mb-0">
                      কিন্তু জুতার সাইজের ছোট বড় হলে আপনি এক্সচেঞ্জ করে নিতে
                      পারবেন। সেক্ষেত্রে আপনি প্রোডাক্টটি রিসিভ করে রাখবেন এবং
                      আমরা আমাদের স্টক থেকে অথবা প্রি-অর্ডার করে এটি এক্সচেঞ্জ
                      করে দিবো।
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <h2 className="h3 fw-bold mb-4 theme-text-primary">
                  Contact Us
                </h2>
                <p className="text-muted mb-4">
                  For return or exchange assistance, contact{" "}
                  {siteConfig.company_name}.
                </p>

                <div className="row g-4">
                  <div className="col-md-6">
                    <h3 className="h6 fw-bold mb-1">
                      <i className="bi bi-telephone-fill me-2" />
                      Phone
                    </h3>
                    <a
                      className="text-decoration-none text-dark"
                      href={`tel:${siteConfig.phone}`}
                    >
                      {siteConfig.phone}
                    </a>
                  </div>

                  <div className="col-md-6">
                    <h3 className="h6 fw-bold mb-1">
                      <i className="bi bi-whatsapp me-2" />
                      WhatsApp
                    </h3>
                    <a
                      className="text-decoration-none text-dark"
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {siteConfig.whatsapp}
                    </a>
                  </div>

                  <div className="col-md-6">
                    <h3 className="h6 fw-bold mb-1">
                      <i className="bi bi-headset me-2" />
                      Customer Care
                    </h3>
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

                  <div className="col-md-6">
                    <h3 className="h6 fw-bold mb-1">
                      <i className="bi bi-envelope-fill me-2" />
                      E-Mail
                    </h3>
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

export default ReturnRefundPolicy;
