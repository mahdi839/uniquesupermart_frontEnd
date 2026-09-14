// middleware.js (root level of Next.js project)
import { NextResponse } from "next/server";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // ✅ STEP 1: Define which paths require protection
  const protectedPaths = ["/dashboard"];
  
  // Check if current path is protected
  const isProtected = protectedPaths.some((path) => 
    pathname.startsWith(path)
  );

  // If not protected, allow access immediately
  if (!isProtected) {
    return NextResponse.next();
  }

  // ✅ STEP 2: Get authentication data from cookies
  const token = req.cookies.get("token")?.value;
  const rolesString = req.cookies.get("roles")?.value;
  const permissionsString = req.cookies.get("permissions")?.value;

  console.log("🔍 Middleware Debug:", {
    pathname,
    hasToken: !!token,
    rolesString,
    permissionsString
  });

  // ✅ STEP 3: Check if user is authenticated
  if (!token) {
    console.log("❌ No token found, redirecting to login");
    const loginUrl = new URL("/admin/login_unique_super_mart", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ STEP 4: Parse roles and permissions from cookies
  let roles = [];
  let permissions = [];
  
  try {
    // Decode URI component first (important for production)
    const decodedRoles = rolesString ? decodeURIComponent(rolesString) : "[]";
    const decodedPermissions = permissionsString ? decodeURIComponent(permissionsString) : "[]";
    
    roles = JSON.parse(decodedRoles);
    permissions = JSON.parse(decodedPermissions);
  } catch (e) {
    console.error("❌ Failed to parse cookies:", e);
    // If parsing fails, redirect to login (cookies might be corrupted)
    const loginUrl = new URL("/admin/login_unique_super_mart", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ STEP 5: Check if user has admin role OR dashboard permission
  const isAdmin = roles.some(role => ["super-admin", "admin"].includes(role));
  const hasDashboardPermission = permissions.includes("view dashboard");
  const hasAnyPermission = permissions.length > 0;

  console.log("🔐 Access Check:", {
    isAdmin,
    hasDashboardPermission,
    hasAnyPermission
  });

  // Allow access if user is admin OR has dashboard permission OR has any permission
  if (!isAdmin && !hasDashboardPermission && !hasAnyPermission) {
    console.log("❌ No sufficient permissions, redirecting home");
    const homeUrl = new URL("/", req.url);
    return NextResponse.redirect(homeUrl);
  }

  console.log("✅ Access granted");

  // ✅ STEP 6: Create response and ensure cookies persist
  const response = NextResponse.next();
  
  // Re-set cookies to ensure they're properly formatted (especially for production)
  response.cookies.set("token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  return response;
}

// ✅ Configure which paths to run middleware on
export const config = {
  matcher: [
    // Match all dashboard routes
    "/dashboard/:path*",
    // Exclude static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ]
};
