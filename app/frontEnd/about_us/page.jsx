// // app/about-us/page.jsx
// import React from "react";
// import { getData } from "@/lib/api";
// import Image from "next/image";

// export default async function AboutUsPage() {
//   const aboutUs = await getData("api/about-us");

//   if (!aboutUs) {
//     return (
//       <div className="container my-5 py-5">
//         <div className="text-center">
//           <div className="spinner-border text-primary mb-3" role="status">
//             <span className="visually-hidden">Loading...</span>
//           </div>
//           <p>Loading About Us content...</p>
//         </div>
//       </div>
//     );
//   }
//   return (
//     <div className="about-us-page">
//       {/* Hero Section */}
//       <section className="about-hero bg-light py-5">
//         <div className="container py-4">
//           <div className="row align-items-center">
//             <div className="col-lg-6">
//               <h1 className="display-4 fw-bold mb-4 text-gray">{aboutUs.title}</h1>
//               <p className="lead text-muted">{aboutUs.excerpt}</p>
//             </div>
//             {aboutUs.image && (
//               <div className="col-lg-6 mt-4 mt-lg-0">
//                 <div className="about-image-container position-relative">
//                   <Image
//                     src={`${process.env.NEXT_PUBLIC_BACKEND_URL}storage/${aboutUs.image}`}
//                     alt={aboutUs.title}
//                     width={800}
//                     height={400}
//                     className="img-fluid rounded shadow-lg"
//                     style={{ maxHeight: "400px", width: "100%", objectFit: "cover" }}
//                   />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </section>

//       {/* Main Content */}
//       <section className="py-5">
//         <div className="container">
//           <div className="row justify-content-center">
//             <div className="col-lg-10">
//               <div
//                 className="about-content fs-5 lh-lg"
//                 dangerouslySetInnerHTML={{ __html: aboutUs?.content ?? "" }}
//               ></div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Team Section (if available) */}
//       {/* {aboutUs.team && aboutUs.team.length > 0 && (
//         <section className="bg-light py-5">
//           <div className="container">
//             <h2 className="text-center mb-5">Our Team</h2>
//             <div className="row">
//               {aboutUs.team.map((member, index) => (
//                 <div key={index} className="col-md-4 mb-4">
//                   <div className="card h-100 border-0 shadow-sm">
//                     <img
//                       src={`${process.env.NEXT_PUBLIC_BACKEND_URL}storage/${member.image}`}
//                       className="card-img-top"
//                       alt={member.name}
//                       style={{ height: "250px", objectFit: "cover" }}
//                     />
//                     <div className="card-body text-center">
//                       <h5 className="card-title">{member.name}</h5>
//                       <p className="card-text text-muted">{member.position}</p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )} */}

//       {/* Values Section (if available) */}
//       {/* {aboutUs.values && aboutUs.values.length > 0 && (
//         <section className="py-5">
//           <div className="container">
//             <h2 className="text-center mb-5">Our Values</h2>
//             <div className="row">
//               {aboutUs.values.map((value, index) => (
//                 <div key={index} className="col-md-4 mb-4">
//                   <div className="text-center px-4">
//                     <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
//                          style={{ width: "70px", height: "70px" }}>
//                       <i className={`fs-4 ${value.icon || "bi bi-star-fill"}`}></i>
//                     </div>
//                     <h4 className="h5">{value.title}</h4>
//                     <p className="text-muted">{value.description}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </section>
//       )} */}

//       {/* Call to Action */}
//       {/* <section className="bg-primary py-5">
//         <div className="container text-center text-white py-4">
//           <h2 className="mb-4">Ready to work with us?</h2>
//           <p className="mb-4 fs-5">Get in touch with our team to learn more about our services</p>
//           <a href="/contact" className="btn btn-light btn-lg px-4">
//             Contact Us
//           </a>
//         </div>
//       </section> */}
//     </div>
//   );
// }


"use client"
import React from 'react';
import Head from 'next/head';

const AboutUs = () => {
  return (
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
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 mb-4 mb-md-0">
              <div className="display-4 fw-bold" style={{ color: 'var(--primary-color)' }}>10000+</div>
              <p className="text-muted mb-0">Happy Customers</p>
            </div>
            <div className="col-md-3 mb-4 mb-md-0">
              <div className="display-4 fw-bold" style={{ color: 'var(--primary-color)' }}>5000+</div>
              <p className="text-muted mb-0">Products Available</p>
            </div>
            <div className="col-md-3 mb-4 mb-md-0">
              <div className="display-4 fw-bold" style={{ color: 'var(--primary-color)' }}>50+</div>
              <p className="text-muted mb-0">International Brands</p>
            </div>
            <div className="col-md-3">
              <div className="display-4 fw-bold" style={{ color: 'var(--primary-color)' }}>24/7</div>
              <p className="text-muted mb-0">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        
        .category-image {
          transition: all 0.3s ease;
        }
        
        .card:hover .category-image {
          transform: scale(1.05);
        }
        
        .btn {
          transition: all 0.3s ease;
        }
        
        .btn:hover {
          transform: translateY(-2px);
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
};

export default AboutUs;