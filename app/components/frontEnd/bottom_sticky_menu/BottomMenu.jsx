'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AiOutlineHome } from 'react-icons/ai';
import { BsShop } from 'react-icons/bs';
import { FaShoppingCart, FaWhatsapp } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import { ImCancelCircle } from 'react-icons/im';
import { useSelector } from "react-redux";
import NavCategories from '../nabvar/components/NavCategories';

import dynamic from "next/dynamic";
const CartDrawer = dynamic(
  () => import("../components/CartDrawer"),
  {
    ssr: false,
    loading: () => null,
  }
);

export default function BottomMenu() {
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [isShowCollapsMenu, setIsShowCollapsMenu] = useState("category");
  const [isClient, setIsClient] = useState(false);
  const cartCount = useSelector((state) => state.cart.count);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleCloseCartDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  const handleOpenCart = () => {
    setIsCartDrawerOpen(true);
  };

  const handleCloseCategoryDrawer = () => {
    setIsCategoryDrawerOpen(false);
  };

  const handleOpenCategory = () => {
    setIsCategoryDrawerOpen(true);
  };

  const handleCollaps_menu = (menu) => {
    setIsShowCollapsMenu(menu);
  };

  return (
    <>
      <div
        className="d-md-none bg-white border-top shadow-lg"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '70px',
          zIndex: 1000,
        }}
      >
        <div className="container-fluid h-100 px-0">
          <div className="row h-100 align-items-center justify-content-around text-center mx-0 gx-1">

            {/* Home */}
            <div className="col px-1">
              <Link href="/" className="text-decoration-none">
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <AiOutlineHome size={22} className="text-dark" />
                  <small className="text-dark mt-1" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>
                    Home
                  </small>
                </div>
              </Link>
            </div>

            {/* Shop */}
            <div className="col px-1">
              <Link href="/frontEnd/shop" className="text-decoration-none">
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <BsShop size={20} className="text-dark" />
                  <small className="text-dark mt-1" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>
                    Shop
                  </small>
                </div>
              </Link>
            </div>

            {/* Categories */}
            <div className="col px-1">
              <button 
                onClick={handleOpenCategory}
                className="border-0 bg-transparent w-100 p-0"
                type="button"
              >
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <MdCategory size={20} className="text-dark" />
                  <small className="text-dark mt-1" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>
                    Category
                  </small>
                </div>
              </button>
            </div>

            {/* WhatsApp */}
            <div className="col px-1">
              <a 
                href="https://wa.me/8801614477721"
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none d-block"
              >
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <FaWhatsapp size={22} className="text-success" />
                  <small className="text-success mt-1" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>
                    WhatsApp
                  </small>
                </div>
              </a>
            </div>

            {/* Cart */}
            <div className="col px-1">
              <button
                onClick={handleOpenCart}
                className="border-0 bg-transparent w-100 p-0 position-relative"
                type="button"
              >
                <div className="d-flex flex-column align-items-center justify-content-center">
                  <div className="position-relative">
                    <FaShoppingCart size={22} className="text-dark" />
                    {isClient && cartCount > 0 && (
                      <span 
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill" 
                        style={{ background: 'var(--primary-color)', fontSize: '9px' }}
                      >
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <small className="text-dark mt-1" style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>
                    Cart
                  </small>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Drawer */}
      {isCategoryDrawerOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="position-fixed top-0 start-0 w-100 h-100 d-md-none"
            style={{ 
              background: 'rgba(0, 0, 0, 0.5)', 
              zIndex: 10000
            }}
            onClick={handleCloseCategoryDrawer}
          />
          
          {/* Drawer */}
          <div 
            className="position-fixed top-0 start-0 h-100 bg-white d-md-none"
            style={{ 
              width: '80vw',
              maxWidth: '350px',
              boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
              overflowY: 'auto',
              zIndex: 10001,
              animation: 'slideInLeft 0.3s ease'
            }}
          >
            {/* Close Button */}
            <div 
              className="position-absolute"
              style={{ top: '10px', right: '1.5rem', zIndex: 10, cursor: 'pointer' }}
              onClick={handleCloseCategoryDrawer}
            >
              <ImCancelCircle size={22} style={{ color: 'red' }} />
            </div>

            {/* Category/Menu Tabs */}
            <div style={{ position: 'absolute', top: '3rem', width: '100%' }}>
              <div 
                style={{
                  width: '100%',
                  height: '50px',
                  background: 'rgb(248, 248, 248)',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '2.5rem'
                }}
              >
                <div 
                  style={{ 
                    width: '50%', 
                    fontWeight: 600, 
                    position: 'relative', 
                    cursor: 'pointer' 
                  }}
                  onClick={() => handleCollaps_menu("category")}
                >
                  <span style={{ position: 'relative' }}>
                    Category
                    {isShowCollapsMenu === "category" && (
                      <span 
                        style={{
                          position: 'absolute',
                          content: '',
                          width: '50%',
                          height: '2px',
                          background: 'var(--primary-color)',
                          bottom: 0,
                          left: 0,
                          transform: 'translateY(12px)'
                        }}
                        className="theme-active-indicator"
                      />
                    )}
                  </span>
                </div>
                <div 
                  style={{ 
                    width: '50%', 
                    fontWeight: 600, 
                    position: 'relative', 
                    cursor: 'pointer' 
                  }}
                  onClick={() => handleCollaps_menu("menu")}
                >
                  <span style={{ position: 'relative' }}>
                    Menu
                    {isShowCollapsMenu === "menu" && (
                      <span 
                        style={{
                          position: 'absolute',
                          content: '',
                          width: '50%',
                          height: '2px',
                          background: 'var(--primary-color)',
                          bottom: 0,
                          left: 0,
                          transform: 'translateY(12px)'
                        }}
                        className="theme-active-indicator"
                      />
                    )}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div style={{ marginTop: '1rem', cursor: 'pointer' }}>
                {isShowCollapsMenu === "category" && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
                    <NavCategories 
                      onClick={handleCloseCategoryDrawer}
                      isMobile={true}
                    />
                  </ul>
                )}
                {isShowCollapsMenu === "menu" && (
                  <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0' }}>
                    <li>
                      <Link
                        href="/"
                        onClick={handleCloseCategoryDrawer}
                        style={{
                          display: 'block',
                          color: '#333',
                          fontWeight: 500,
                          fontSize: '17px',
                          borderBottom: '1px solid #d6d3d3',
                          padding: '10px 1.25rem',
                          textDecoration: 'none'
                        }}
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/frontEnd/about_us"
                        onClick={handleCloseCategoryDrawer}
                        style={{
                          display: 'block',
                          color: '#333',
                          fontWeight: 500,
                          fontSize: '17px',
                          borderBottom: '1px solid #d6d3d3',
                          padding: '10px 1.25rem',
                          textDecoration: 'none'
                        }}
                      >
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/frontEnd/shop"
                        onClick={handleCloseCategoryDrawer}
                        style={{
                          display: 'block',
                          color: '#333',
                          fontWeight: 500,
                          fontSize: '17px',
                          borderBottom: '1px solid #d6d3d3',
                          padding: '10px 1.25rem',
                          textDecoration: 'none'
                        }}
                      >
                        Shop
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={handleCloseCartDrawer}
      />

      <style jsx>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}
