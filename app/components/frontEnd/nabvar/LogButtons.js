"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaArrowAltCircleRight, FaSignInAlt, FaShoppingBag } from "react-icons/fa";
import { MdAssignmentInd } from "react-icons/md";
import { useAuth } from "@/app/hooks/useAuth";

export default function LogButtons() {
  const { logout, isAuthenticated } = useAuth();
  const [token, setToken] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(localStorage.getItem("token"));
    }
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    if (!token) return;
    await logout();
    setToken(null);
  };

  return (
    <>
      {isAuthenticated() ? (
        <>
          <li>
            <Link className="dropdown-item" href="/frontEnd/my-orders">
              <FaShoppingBag className="theme-icon-primary" />{" "}
              <span className="ml-2"> My Orders</span>
            </Link>
          </li>
          <li>
            <button className="dropdown-item" onClick={handleLogout}>
              <FaSignInAlt className="theme-icon-primary" />{" "}
              <span className="ml-2"> Log Out</span>
            </button>
          </li>
        </>
      ) : (
        <>
          <li>
            <Link className="dropdown-item" href="/frontEnd/log_in">
              <MdAssignmentInd className="theme-icon-primary" />{" "}
              <span className="ml-2"> Log In</span>
            </Link>
          </li>
          <li>
            <Link className="dropdown-item" href="/frontEnd/register">
              <FaArrowAltCircleRight className="theme-icon-primary" />{" "}
              <span className="ml-2"> Register </span>
            </Link>
          </li>
        </>
      )}
    </>
  );
}
