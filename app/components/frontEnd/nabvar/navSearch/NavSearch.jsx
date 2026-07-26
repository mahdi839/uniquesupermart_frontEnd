'use client'
import React, { useEffect, useState } from 'react'
import { FaBars, FaPhone, FaTimes } from 'react-icons/fa';
import style from "../hero.module.css"
import NavCategories from '../components/NavCategories';
import Link from 'next/link';
import './nav_search.css'
import { siteConfig } from '@/config/siteConfig';
export default function NavSearch({ footerData }) {
  const [isClient, setIsClient] = useState(false)
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  let baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    if (query.length >= 3) {
      fetch(`${baseUrl}api/product-search?q=${query}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.data);
          setIsOpen(true);
        })
        .catch((err) => console.log(err));
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query]);

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="row position-relative">
      {/* medium to large screen design start */}
      <div className="col-lg-3 d-none d-xl-block">
        <div className={`${isClient ? style.category_main : null} hero__categories`}>
          <div className={`${isClient ? style.category_dropdown : null} hero__categories__all`} >
            <FaBars className="fa fa-bars hero_category_icon" />
            <span>All Categories</span>
          </div>
          <ul className={isClient ? style.category_list : null}>
            <NavCategories />
          </ul>
        </div>
      </div>
      <div className="col-lg-9 d-none d-xl-block">
        <div className="hero__search">
          <div className="hero__search__form">
            <form action="#">
              <div className="hero__search__categories">
                All Categories
                <span className="arrow_carrot-down"></span>
              </div>
              <input
                type="text"
                placeholder="What do you need?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="site-btn">
                SEARCH
              </button>
            </form>
          </div>
          <div className="hero__search__phone">
            <div className="hero__search__phone__icon">
              <FaPhone className="fa fa-phone" />
            </div>
            <div className="hero__search__phone__text">
              <h5>{siteConfig?.phone??""}</h5>
              <span>support 24/7 time</span>
            </div>
          </div>
        </div>
      </div>
      {/* medium to large screen design end */}

      {/* Results Dropdown - Improved Design */}
      {isOpen && results.length > 0 && (
        <div className="position-absolute top-50 start-0 end-0 mt-2 z-50">
          <div className="card shadow-lg border-0">
            <div className="card-body p-0" style={{ maxHeight: '400px', overflowY: 'auto' }}>

              {isOpen && results.length > 0 && (
                <ul
                  className="list-group position-absolute w-100 shadow"
                  style={{
                    top: "100%",
                    zIndex: 1000,
                    maxHeight: "300px",
                    overflowY: "auto",
                  }}
                >
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/frontEnd/product-page/${product.id}`}
                      className="text-decoration-none"
                      onClick={() => setIsOpen(false)}
                    >
                      <li className="list-group-item d-flex align-items-center hover-bg-light">
                        <div
                          className="me-3"
                          style={{ width: "50px", height: "50px", position: "relative" }}
                        >
                          <Image
                            src={baseUrl + product.images?.[0]?.image}
                            alt={product.title}
                            fill
                            className="object-fit-cover rounded"
                            onError={(e) => {
                              e.currentTarget.src = "/images/placeholder.jpg";
                            }}
                          />
                        </div>

                        <div>
                          <strong>{product.title}</strong>
                          {product.sizes.length > 0 && (
                            <div className="d-flex gap-2">
                              <span className="mt-2">Size:</span>
                              {product?.sizes?.map((size) => (
                                <div className="size_div_search mt-1" key={size?.size}>
                                  <strong>{size?.size ?? ""}</strong>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </li>
                    </Link>
                  ))}
                </ul>
              )}

            </div>
          </div>
        </div>
      )}

      {/* No Results Found */}
      {isOpen && query.length >= 3 && results.length === 0 && (
        <div className="position-absolute top-100 start-0 end-0 mt-2 z-50">
          <div className="card shadow-lg border-0">
            <div className="card-body text-center py-4">
              <i className="fas fa-search fa-2x text-muted mb-3"></i>
              <h6 className="text-muted mb-2">No products found</h6>
              <p className="text-muted small mb-0">
                Try different keywords or browse categories
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}