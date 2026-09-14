"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

export default function ProtectedRoute({ 
  children, 
  requiredRole = null, 
  requiredPermission = null 
}) {
  const router = useRouter();
  const { isAuthenticated, hasRole, hasPermission } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.push("/admin/login_unique_super_mart");
      return;
    }

    // Check role if required
    if (requiredRole && !hasRole(requiredRole)) {
      router.push("/");
      return;
    }

    // Check permission if required
    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push("/");
      return;
    }

    setIsAuthorized(true);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}

// Export individual permission checkers
export function RequirePermission({ permission, children, fallback = null }) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return fallback;
  }

  return <>{children}</>;
}

export function RequireRole({ role, children, fallback = null }) {
  const { hasRole } = useAuth();

  if (!hasRole(role)) {
    return fallback;
  }

  return <>{children}</>;
}
