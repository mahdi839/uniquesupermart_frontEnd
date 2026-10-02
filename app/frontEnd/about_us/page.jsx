"use client";

import { siteConfig } from "@/config/siteConfig";

const AboutUs = () => {
  const whatsappLink = `https://wa.me/${siteConfig.whatsapp.replace(/\D/g, "")}`;

  return (
<<<<<<< HEAD
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
=======
    <>
      {/* Hero Section */}
      <section className="py-5" style={{ backgroundColor: 'rgba(var(--primary-rgb), 0.05)' }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h1 className="display-4 fw-bold mb-4" style={{ color: 'var(--primary-color)' }}>
                Welcome to <span style={{ color: 'var(--primary-color)' }}>eyarafashion.com</span>
              </h1>
              <p className="lead mb-4">
                Your Ultimate Fashion Destination! We bring you a world of possibilities with millions of 
                fashion products across categories like clothing, accessories, beauty, and more – 
                all at incredible prices!
              </p>
              <div className="d-flex flex-wrap gap-3">
                <a 
                  href="#why-shop" 
                  className="btn btn-lg px-4" 
                  style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                >
                  <i className="bi bi-star me-2"></i>Why Choose Us
                </a>
                <a 
                  href="#categories" 
                  className="btn btn-lg px-4 btn-outline-secondary"
                >
                  <i className="bi bi-grid me-2"></i>Explore Categories
                </a>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="position-relative">
                <div className="card shadow-lg border-0 overflow-hidden">
                  <div className="card-body p-0">
                    <div className="row g-0">
                      <div className="col-md-6 p-4 d-flex flex-column justify-content-center">
                        <h4 className="fw-bold" style={{ color: 'var(--primary-color)' }}>Global Fashion</h4>
                        <p className="small mb-0">Direct from international markets to your doorstep</p>
                      </div>
                      <div className="col-md-6">
                        <div 
                          className="h-100" 
                          style={{ 
                            minHeight: '200px',
                            background: 'linear-gradient(135deg, rgba(var(--primary-rgb),0.8) 0%, rgba(var(--primary-rgb),0.2) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <i className="bi bi-globe" style={{ fontSize: '4rem', color: 'white' }}></i>
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

      {/* Our Story Section */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <h2 className="fw-bold mb-3" style={{ color: 'var(--primary-color)' }}>
                <i className="bi bi-heart me-2"></i>Our Fashion Journey
              </h2>
              <p className="lead text-muted">
                We make international fashion shopping seamless and hassle-free
              </p>
            </div>
          </div>
          
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-5">
                  <h3 className="fw-bold mb-4" style={{ color: 'var(--primary-color)' }}>
                    Direct from Global Markets
                  </h3>
                  <p className="mb-4">
                    At eyarafashion.com, we ensure you get access to high-quality fashion products directly 
                    from international brands and merchants. We bridge the gap between global fashion trends 
                    and local accessibility.
                  </p>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-color)', color: 'white' }}>
                          <i className="bi bi-box"></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0">Low Cost Model</h6>
                          <small className="text-muted">No local inventory</small>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="d-flex align-items-center">
                        <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-color)', color: 'white' }}>
                          <i className="bi bi-lightning"></i>
                        </div>
                        <div>
                          <h6 className="fw-bold mb-0">Daily New Deals</h6>
                          <small className="text-muted">Fresh fashion arrivals</small>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4">
                    Since we don't store inventory locally, we can keep costs low and offer exciting new 
                    fashion deals every day!
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6">
                  <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: 'rgba(var(--primary-rgb), 0.05)' }}>
                    <div className="card-body text-center p-4">
                      <i className="bi bi-truck" style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}></i>
                      <h5 className="fw-bold">Global Sourcing</h5>
                      <p className="small mb-0">Direct from international markets</p>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: 'rgba(var(--primary-rgb), 0.05)' }}>
                    <div className="card-body text-center p-4">
                      <i className="bi bi-cash-coin" style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}></i>
                      <h5 className="fw-bold">Best Prices</h5>
                      <p className="small mb-0">Competitive international rates</p>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: 'rgba(var(--primary-rgb), 0.05)' }}>
                    <div className="card-body text-center p-4">
                      <i className="bi bi-shield-check" style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}></i>
                      <h5 className="fw-bold">Quality Assurance</h5>
                      <p className="small mb-0">Verified brands & merchants</p>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card border-0 shadow-sm h-100" style={{ backgroundColor: 'rgba(var(--primary-rgb), 0.05)' }}>
                    <div className="card-body text-center p-4">
                      <i className="bi bi-award" style={{ fontSize: '2.5rem', color: 'var(--primary-color)', marginBottom: '1rem' }}></i>
                      <h5 className="fw-bold">Happy Customers</h5>
                      <p className="small mb-0">Thousands of satisfied shoppers</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Shop With Us Section */}
      <section id="why-shop" className="py-5" style={{ backgroundColor: '#f8f9fa' }}>
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <h2 className="fw-bold mb-3" style={{ color: 'var(--primary-color)' }}>
                <i className="bi bi-check-circle me-2"></i>Why Shop with eyarafashion.com?
              </h2>
              <p className="lead text-muted">
                Experience the future of fashion shopping with these exclusive benefits
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: 'rgba(var(--primary-rgb), 0.1)' }}>
                      <i className="bi bi-grid-3x3-gap" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                    </div>
                    <h5 className="fw-bold mb-0">Massive Selection</h5>
                  </div>
                  <p className="mb-0">
                    From trendy outfits to fashionable accessories, find everything in one place. 
                    We curate the latest fashion trends from around the world.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: 'rgba(var(--primary-rgb), 0.1)' }}>
                      <i className="bi bi-tag" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                    </div>
                    <h5 className="fw-bold mb-0">Unbeatable Prices</h5>
                  </div>
                  <p className="mb-0">
                    Shop smart and save more with direct sourcing. We eliminate middlemen to bring 
                    you fashion at the most competitive prices.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: 'rgba(var(--primary-rgb), 0.1)' }}>
                      <i className="bi bi-shield-check" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                    </div>
                    <h5 className="fw-bold mb-0">Worry-Free Shopping</h5>
                  </div>
                  <p className="mb-0">
                    We handle everything from ordering to delivery, making sure you get your fashion 
                    products safely and on time.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="col-lg-3 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', backgroundColor: 'rgba(var(--primary-rgb), 0.1)' }}>
                      <i className="bi bi-award" style={{ fontSize: '1.5rem', color: 'var(--primary-color)' }}></i>
                    </div>
                    <h5 className="fw-bold mb-0">Trusted Brands</h5>
                  </div>
                  <p className="mb-0">
                    We work with thousands of verified sellers to bring you only the best quality 
                    fashion items from trusted international brands.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-5">
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8 text-center">
              <h2 className="fw-bold mb-3" style={{ color: 'var(--primary-color)' }}>
                <i className="bi bi-tags me-2"></i>Our Fashion Categories
              </h2>
              <p className="lead text-muted">
                Explore thousands of products across various fashion categories
              </p>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 overflow-hidden">
                <div className="card-body p-0">
                  <div className="p-4">
                    <h5 className="fw-bold d-flex align-items-center">
                      <i className="bi bi-person-standing me-3" style={{ color: 'var(--primary-color)' }}></i>
                      Clothing & Apparel
                    </h5>
                    <p className="mb-0">
                      Trendy outfits, dresses, shirts, pants, and all your fashion essentials
                    </p>
                  </div>
                  <div 
                    className="category-image" 
                    style={{
                      height: '150px',
                      background: 'linear-gradient(45deg, rgba(var(--primary-rgb),0.1) 0%, rgba(var(--primary-rgb),0.3) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <i className="bi bi-person-standing-dress" style={{ fontSize: '3rem', color: 'var(--primary-color)' }}></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 overflow-hidden">
                <div className="card-body p-0">
                  <div className="p-4">
                    <h5 className="fw-bold d-flex align-items-center">
                      <i className="bi bi-gem me-3" style={{ color: 'var(--primary-color)' }}></i>
                      Accessories
                    </h5>
                    <p className="mb-0">
                      Jewelry, bags, watches, belts, and all finishing touches for your look
                    </p>
                  </div>
                  <div 
                    className="category-image" 
                    style={{
                      height: '150px',
                      background: 'linear-gradient(45deg, rgba(var(--primary-rgb),0.1) 0%, rgba(var(--primary-rgb),0.3) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <i className="bi bi-gem" style={{ fontSize: '3rem', color: 'var(--primary-color)' }}></i>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100 overflow-hidden">
                <div className="card-body p-0">
                  <div className="p-4">
                    <h5 className="fw-bold d-flex align-items-center">
                      <i className="bi bi-bag-heart me-3" style={{ color: 'var(--primary-color)' }}></i>
                      Beauty & Cosmetics
                    </h5>
                    <p className="mb-0">
                      Makeup, skincare, fragrances, and beauty tools from global brands
                    </p>
                  </div>
                  <div 
                    className="category-image" 
                    style={{
                      height: '150px',
                      background: 'linear-gradient(45deg, rgba(var(--primary-rgb),0.1) 0%, rgba(var(--primary-rgb),0.3) 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <i className="bi bi-bag-heart" style={{ fontSize: '3rem', color: 'var(--primary-color)' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-5" style={{ backgroundColor: 'var(--primary-color)' }}>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-4 text-white">
                Join Our Fashion Community!
              </h2>
              <p className="lead text-white mb-5">
                Join thousands of happy shoppers and experience the future of fashion shopping 
                with eyarafashion.com!
              </p>
              
              <div className="row justify-content-center mb-5">
                <div className="col-md-8">
                  <div className="card shadow-lg border-0">
                    <div className="card-body p-5">
                      <h4 className="fw-bold mb-3" style={{ color: 'var(--primary-color)' }}>
                        <i className="bi bi-heart me-2"></i>Connect With Us
                      </h4>
                      <p className="mb-4">
                        Thanks for connecting with us on Facebook & Instagram! We're excited to have you here. 
                        Stay tuned for the latest fashion deals, updates, and exclusive offers!
                      </p>
                      
                      <div className="d-flex flex-wrap justify-content-center gap-3">
                        <a 
                          href="https://www.facebook.com/eyarafashion.com" 
                          className="btn btn-lg px-4" 
                          style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}
                        >
                          <i className="bi bi-facebook me-2"></i>Facebook
                        </a>
                        <a 
                          href="https://www.instagram.com/eyarafashionbd/?hl=en" 
                          className="btn btn-lg px-4" 
                          style={{ backgroundColor: '#E4405F', color: 'white' }}
                        >
                          <i className="bi bi-instagram  me-2"></i>Instagram
                        </a>
                        <a 
                          href="https://wa.me/8801614477721" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="btn btn-lg px-4" 
                          style={{ backgroundColor: '#25D366', color: 'white' }}
                        >
                          <i className="bi bi-whatsapp me-2"></i>WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-white">
                <h4 className="fw-bold mb-4">
                  <i className="bi bi-stars me-2"></i>Thank You for Shopping With Us!
                </h4>
                <div className="display-4 mb-3">💖✨</div>
                <p className="mb-0">
                  Your trust and satisfaction are what drive us to bring you the best fashion 
                  from around the world.
>>>>>>> 46d263a750e1ff14511c2a431ca939beb0d31a87
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
