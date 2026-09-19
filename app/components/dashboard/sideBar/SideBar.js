"use client";

import React, { useState, useEffect } from "react";
import "../../layouts/dashboard.css";
import { BsLayoutTextSidebar, BsChevronDown, BsChevronRight } from "react-icons/bs";
import { FaChartBar, FaInfoCircle, FaProductHunt, FaShippingFast, FaShoppingBag, FaUsers, FaShieldAlt, FaAddressBook, FaCreditCard, FaPalette, FaTicketAlt } from "react-icons/fa";
import { RiKanbanView2 } from "react-icons/ri";
import { IoIosSettings } from "react-icons/io";
import { MdInventory } from "react-icons/md";
import { BiSolidCategory } from "react-icons/bi";
import { PiFlagBanner } from "react-icons/pi";
import SideBarItem from "../components/sidebarItem/SideBarItem";
import { MdOutlineSocialDistance } from "react-icons/md";
import { AiOutlineDashboard } from "react-icons/ai";
import { usePathname } from "next/navigation";
import { TbCirclesRelation } from "react-icons/tb";
import { HiTrophy } from "react-icons/hi2";
import { useAuth } from "@/app/hooks/useAuth";
import { siteConfig } from "@/config/siteConfig";

export default function SideBar({ isSidebarOpen, toggleSidebar, isMobile }) {
  const [openMenu, setOpenMenu] = useState(null);
  const pathname = usePathname();
  const { hasPermission, hasRole, hasAnyPermission } = useAuth();

  // ✅ Menu structure with permissions
  const allMenuItems = [
    {
      type: 'single',
      href: "/dashboard",
      Icon: AiOutlineDashboard,
      label: 'Dashboard Summary',
      permission: 'view dashboard summary' // ✅ Required permission
    },
    {
      type: 'menu',
      label: 'Products Management',
      Icon: FaProductHunt,
      // ✅ Show menu if user has ANY of these permissions
      requireAny: ['view categories', 'view products'],
      submenus: [
        {
          href: "/dashboard/category",
          label: 'Category',
          Icon: BiSolidCategory,
          permission: 'view categories' // ✅ Required permission
        },
        {
          href: "/dashboard/products",
          label: 'Products',
          Icon: FaProductHunt,
          permission: 'view products' // ✅ Required permission
        },
        // { 
        //   href: "/dashboard/inventory", 
        //   label: 'Inventory Management', 
        //   Icon: MdInventory,
        //   permission: 'view products' // ✅ Reuse products permission
        // },
      ]
    },
    {
      type: 'single',
      href: "/dashboard/sizes",
      Icon: AiOutlineDashboard,
      label: 'Sizes',
      permission: 'view sizes' // ✅ Required permission
    },
    {
      type: 'menu',
      label: 'Orders',
      Icon: FaShoppingBag,
      requireAny: ['view orders'], // ✅ Show menu if has orders permission
      submenus: [
        {
          href: "/dashboard/orders",
          label: 'All Orders',
          Icon: FaShoppingBag,
          permission: 'view orders' // ✅ Required permission
        },
        {
          href: "/dashboard/sales-report",
          label: 'Sales Report',
          Icon: FaChartBar,
          permission: 'view orders'
        },
        {
          href: "/dashboard/incomplete_orders",
          label: 'Incomplete Orders',
          Icon: FaShoppingBag,
          permission: 'view orders' // ✅ Same permission
        },
      ]
    },
    {
      type: 'single',
      href: "/dashboard/customers",
      Icon: FaAddressBook,
      label: 'Customers',
      permission: 'view leaderboard'
    },
    {
      type: 'single',
      href: "/dashboard/customer_leaderboard",
      Icon: HiTrophy,
      label: 'Customer Leaderboard',
      permission: 'view leaderboard' // ✅ Uses dashboard permission
    },
    {
      type: 'single',
      href: "/dashboard/shipping",
      Icon: FaShippingFast,
      label: 'Shipping Cost',
      permission: 'view settings' // ✅ Required permission
    },
    {
      type: 'single',
      href: "/dashboard/coupons",
      Icon: FaTicketAlt,
      label: 'Coupons',
      permission: 'view coupons'
    },
    {
      type: 'single',
      href: "/dashboard/banners",
      Icon: PiFlagBanner,
      label: 'Banners',
      permission: 'view banners' // ✅ Required permission
    },
    {
      type: 'menu',
      label: 'Courier Management',
      Icon: FaShippingFast,
      requireAny: ['view settings'],
      submenus: [
        {
          href: "/dashboard/fraud-checker",
          label: 'Courier Checker',
          Icon: FaShieldAlt,
          permission: 'view settings'
        },
        {
          href: "/dashboard/fraud-checker/plan",
          label: 'Courier Plan & Usage',
          Icon: FaCreditCard,
          permission: 'view settings'
        },
      ]
    },
    {
      type: 'menu',
      label: 'Settings',
      Icon: IoIosSettings,
      requireAny: ['view settings'], // ✅ Show if has settings permission
      submenus: [
        {
          href: "/dashboard/about_us",
          label: 'About Us',
          Icon: FaInfoCircle,
          permission: 'view settings'
        },
        {
          href: "/dashboard/footerSettings",
          label: 'Web Settings',
          Icon: IoIosSettings,
          permission: 'view settings'
        },
        {
          href: "/dashboard/theme-settings",
          label: 'Website Color',
          Icon: FaPalette,
          permission: 'view settings'
        },
        {
          href: "/dashboard/socialLinks",
          label: 'Social Links',
          Icon: MdOutlineSocialDistance,
          permission: 'view settings'
        },
        {
          href: "/dashboard/facebook_conversion_api",
          label: 'Facebook Api Settings',
          Icon: TbCirclesRelation,
          permission: 'view settings'
        },
      ]
    },
    // ✅ SUPER ADMIN ONLY ITEMS
    {
      type: 'menu',
      label: 'User Management',
      Icon: FaUsers,
      role: 'super-admin', // ✅ Role-based (not permission)
      submenus: [
        {
          href: "/dashboard/users",
          label: 'Users',
          Icon: FaUsers,
          role: 'super-admin'
        },
        {
          href: "/dashboard/roles",
          label: 'Roles & Permissions',
          Icon: FaShieldAlt,
          role: 'super-admin'
        },
      ]
    },
    {
      type: 'single',
      href: "/",
      Icon: RiKanbanView2,
      label: 'View Website',
      alwaysShow: true // ✅ Always show (no permission needed)
    }
  ];

  // ✅ STEP 1: Filter menu items based on user permissions
  const canAccessMenuItem = (item) => {
    // If alwaysShow, no check needed
    if (item.alwaysShow) return true;

    // Check role-based access
    if (item.role) {
      return hasRole(item.role);
    }

    // Check permission-based access
    if (item.permission) {
      return hasPermission(item.permission);
    }

    // For menu groups, check if user has any required permission
    if (item.requireAny && Array.isArray(item.requireAny)) {
      return hasAnyPermission(item.requireAny);
    }

    // Default: hide if no permission defined
    return false;
  };

  // ✅ STEP 2: Filter main menu items
  const menuItems = allMenuItems.filter(item => {
    if (item.type === 'single') {
      return canAccessMenuItem(item);
    } else if (item.type === 'menu') {
      // For menu groups, check if user can access the group OR any submenu
      if (canAccessMenuItem(item)) return true;

      // Also check if any submenu is accessible
      const accessibleSubmenus = item.submenus.filter(canAccessMenuItem);
      return accessibleSubmenus.length > 0;
    }
    return false;
  });

  // ✅ STEP 3: Filter submenus based on permissions
  const getFilteredSubmenus = (menu) => {
    if (!menu.submenus) return [];
    return menu.submenus.filter(canAccessMenuItem);
  };

  // Auto-open menu if current path is in submenu
  useEffect(() => {
    for (const item of menuItems) {
      if (item.type === "menu") {
        const filteredSubmenus = getFilteredSubmenus(item);

        const isActive = filteredSubmenus.some(subItem =>
          pathname === subItem.href || pathname.startsWith(subItem.href + "/")
        );

        if (isActive) {
          setOpenMenu(item.label);
          return;
        }
      }
    }
  }, [pathname]);


  const toggleMenu = (menuLabel) => {
    setOpenMenu(prev => (prev === menuLabel ? null : menuLabel));
  };


  // Close sidebar on mobile when clicking a link
  const handleLinkClick = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };

  // Check if a menu item is active
  const isItemActive = (href) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  // Check if a menu group is active
  const isMenuActive = (menu) => {
    if (menu.type === 'single') {
      return isItemActive(menu.href);
    } else if (menu.type === 'menu') {
      const filteredSubmenus = getFilteredSubmenus(menu);
      return filteredSubmenus.some(subItem => isItemActive(subItem.href));
    }
    return false;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`sideBarDiv d-flex flex-column ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'} ${isMobile ? 'mobile-sidebar' : ''}`}>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center sideBar_icon_siteName">
          <h5 className="text-white" style={{ display: isSidebarOpen ? 'block' : 'none' }}>
            {siteConfig.company_name}
          </h5>
          <button
            className="sidebar-toggle-btn"
            onClick={toggleSidebar}
          >
            <BsLayoutTextSidebar className="sideBarIcon" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="sideBar_list mt-4">
          {menuItems.length === 0 ? (
            <div className="text-white text-center mt-5 px-3">
              <p className="small">No menu items available</p>
              <p className="small text-muted">Contact administrator</p>
            </div>
          ) : (
            menuItems.map((item, index) => {
              if (item.type === 'single') {
                return (
                  <div key={index} onClick={handleLinkClick}>
                    <SideBarItem
                      href={item.href}
                      Icon={item.Icon}
                      label={item.label}
                      isSidebarOpen={isSidebarOpen}
                      isActive={isItemActive(item.href)}
                    />
                  </div>
                );
              } else if (item.type === 'menu') {
                const isActive = isMenuActive(item);
                const filteredSubmenus = getFilteredSubmenus(item);

                // Don't render menu if no accessible submenus
                if (filteredSubmenus.length === 0) return null;

                return (
                  <div key={index} className="sidebar-menu-group">
                    <div
                      className={`sidebar-menu-header d-flex align-items-center justify-content-between text-white mb-3 cursor-pointer ${isActive ? 'active' : ''}`}
                      onClick={() => toggleMenu(item.label)}
                    >
                      <div className="d-flex align-items-center gap-2">
                        {item.Icon && <item.Icon className="text-white" />}
                        {isSidebarOpen && <span>{item.label}</span>}
                      </div>
                      {isSidebarOpen && (
                        openMenu === item.label ?
                          <BsChevronDown /> :
                          <BsChevronRight />
                      )}
                    </div>

                    {isSidebarOpen && openMenu === item.label && (
                      <div className="sidebar-submenu">
                        {filteredSubmenus.map((subItem, subIndex) => (
                          <div key={subIndex} onClick={handleLinkClick}>
                            <SideBarItem
                              href={subItem.href}
                              Icon={subItem.Icon}
                              label={subItem.label}
                              isSubmenu={true}
                              isSidebarOpen={isSidebarOpen}
                              isActive={isItemActive(subItem.href)}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })
          )}
        </div>
      </div>
    </>
  );
}
