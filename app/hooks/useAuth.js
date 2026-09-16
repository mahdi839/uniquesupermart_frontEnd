// app/hooks/useAuth.js
"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import axios from "axios";

export const useAuth = () => {
  const router = useRouter();
  const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  const apiUrl = (endpoint) => `${API_BASE}${API_BASE.endsWith("/") ? "" : "/"}${endpoint}`;
  const [userPermissions, setUserPermissions] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load permissions from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const perms = JSON.parse(localStorage.getItem("permissions") || "[]");
        const roles = JSON.parse(localStorage.getItem("roles") || "[]");
        setUserPermissions(perms);
        setUserRoles(roles);
      } catch (e) {
        console.error("Failed to parse permissions/roles", e);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  // ✅ Helper to delete cookie
  const deleteCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  // ✅ Helper to set cookie
  const setCookie = (name, value, days = 7) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
  };

  // ✅ Refresh user data from API
  const refreshUserData = async ({ silent = false } = {}) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return false;

      const response = await axios.get(apiUrl("api/me"), {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status) {
        const { user } = response.data;
        
        // Update localStorage
        localStorage.setItem("user_id", user.id);
        localStorage.setItem("user_name", user.name);
        localStorage.setItem("roles", JSON.stringify(user.roles));
        localStorage.setItem("permissions", JSON.stringify(user.permissions));

        // Update cookies
        setCookie("token", token);
        setCookie("roles", JSON.stringify(user.roles));
        setCookie("permissions", JSON.stringify(user.permissions));
        setCookie("user_id", user.id);

        // Update state
        setUserPermissions(user.permissions);
        setUserRoles(user.roles);

        if (!silent) toast.success("Permissions refreshed");
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to refresh user data:", err);
      if (!silent) toast.error("Failed to refresh permissions");
      return false;
    }
  };

  // ✅ Logout function
  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      
      if (token) {
        await fetch(apiUrl("api/logOut"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      localStorage.removeItem("user_name");
      localStorage.removeItem("roles");
      localStorage.removeItem("permissions");

      // Clear cookies
      deleteCookie("token");
      deleteCookie("roles");
      deleteCookie("permissions");
      deleteCookie("user_id");

      // Clear state
      setUserPermissions([]);
      setUserRoles([]);

      toast.success("Logged out successfully");
      router.push("/frontEnd/log_in");
    }
  };

  // ✅ Check if user is authenticated
  const isAuthenticated = () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  };

  // ✅ Check if user has admin access
  const isAdmin = () => {
    if (typeof window === "undefined") return false;
    try {
      const roles = JSON.parse(localStorage.getItem("roles") || "[]");
      return roles.some(role => ["admin", "super-admin"].includes(role));
    } catch {
      return false;
    }
  };

  // ✅ Check if user has specific role
  const hasRole = (roleName) => {
    if (typeof window === "undefined") return false;
    try {
      const roles = JSON.parse(localStorage.getItem("roles") || "[]");
      return roles.includes(roleName);
    } catch {
      return false;
    }
  };

  // ✅ Check if user has specific permission
  const hasPermission = (permissionName) => {
    if (typeof window === "undefined") return false;
    try {
      if (hasRole("super-admin")) return true;
      const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
      return permissions.includes(permissionName);
    } catch {
      return false;
    }
  };

  // ✅ Check if user has any of the permissions
  const hasAnyPermission = (permissionNames) => {
    if (typeof window === "undefined") return false;
    if (!Array.isArray(permissionNames)) return false;
    try {
      if (hasRole("super-admin")) return true;
      const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
      return permissionNames.some(perm => permissions.includes(perm));
    } catch {
      return false;
    }
  };

  // ✅ Check if user has all permissions
  const hasAllPermissions = (permissionNames) => {
    if (typeof window === "undefined") return false;
    if (!Array.isArray(permissionNames)) return false;
    try {
      if (hasRole("super-admin")) return true;
      const permissions = JSON.parse(localStorage.getItem("permissions") || "[]");
      return permissionNames.every(perm => permissions.includes(perm));
    } catch {
      return false;
    }
  };

  // ✅ Get user info
  const getUser = () => {
    if (typeof window === "undefined") return null;
    try {
      return {
        id: localStorage.getItem("user_id"),
        name: localStorage.getItem("user_name"),
        roles: JSON.parse(localStorage.getItem("roles") || "[]"),
        permissions: JSON.parse(localStorage.getItem("permissions") || "[]")
      };
    } catch {
      return null;
    }
  };

  // ✅ Get token for API calls
  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  return {
    logout,
    isAuthenticated,
    isAdmin,
    hasRole,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getUser,
    getToken,
    refreshUserData,
    userPermissions,
    userRoles,
    loading
  };
};
