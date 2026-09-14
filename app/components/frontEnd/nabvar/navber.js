// app/components/navbar/Navbar.jsx
// ✅ SERVER COMPONENT — no "use client" here
// Renders static shell; all interactive pieces are isolated client sub-components

import Link from "next/link";
import { FaEnvelope, FaFacebook, FaTwitter, FaLinkedin, FaPinterest } from "react-icons/fa";

import { siteConfig } from "@/config/siteConfig";
import SiteLogo from "@/app/components/frontEnd/SiteLogo";
import DesktopSearchBar from "./components/DesktopSearchBar";
import CartButton from "./components/CartButton";
import DesktopNav from "./components/DesktopNav";
import MobileSearchBar from "./components/MobileSearchBar";
import UserDropdown from "./components/UserDropdown";
import MobileMenuDrawer from "./components/MobileMenuDrawer";


export default function Navbar() {
  return (
    <div className="position-relative">
      <header className="header">

        {/* ── Top bar (fully static, server-rendered) ── */}
        <div className="header__top">
          <div className="container">
            <div className="row align-items-center">

              <div className="col-lg-6 col-md-6 d-none d-xl-block">
                <div className="header__top__left">
                  <ul className="mb-0">
                    <li>
                      <FaEnvelope className="me-2" />
                      {siteConfig.email}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-lg-6 col-md-6 d-none d-xl-block">
                <div className="header__top__right d-flex justify-content-end align-items-center">
                  <div className="header__top__right__social me-4">
                    <Link href={siteConfig.social.facebook} className="me-3"><FaFacebook /></Link>
                    <Link href="#" className="me-3"><FaTwitter /></Link>
                    <Link href="#" className="me-3"><FaLinkedin /></Link>
                    <Link href="#"><FaPinterest /></Link>
                  </div>
                  {/* Client island: login/logout dropdown */}
                  <UserDropdown />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ── Main header row ── */}
        <div className="container">
          <div className="row align-items-center py-2">

            {/* Mobile top bar */}
            <div className="d-flex d-xl-none justify-content-between align-items-center w-100 px-3 mt-3">
              {/* Client island: mobile hamburger + drawer */}
              <MobileMenuDrawer/>

              <div className="mobile_logo">
                <SiteLogo
                  sizes="150px"
                  className="site-logo site-logo--mobile"
                  priority
                />
              </div>

              {/* Mobile user dropdown — client island */}
              <UserDropdown />
            </div>

            {/* Mobile search bar — client island */}
            <div className="d-flex d-xl-none w-100 my-3 px-3">
              <MobileSearchBar />
            </div>

            {/* Desktop logo */}
            <div className="col-lg-3 d-none d-xl-block">
              <div className="header__logo py-2">
                <SiteLogo
                  sizes="200px"
                  className="site-logo site-logo--desktop"
                  priority
                />
              </div>
            </div>

            {/* Desktop nav — server rendered */}
            <div className="col-lg-6 d-none d-xl-block">
              <DesktopNav />
            </div>

            {/* Desktop cart — client island */}
            <div className="col-lg-3 d-none d-xl-block">
              <CartButton />
            </div>

          </div>

          {/* Desktop search bar with category sidebar — client island */}
          <DesktopSearchBar />
        </div>
      </header>
    </div>
  );
}
