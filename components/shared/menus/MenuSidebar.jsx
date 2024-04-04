import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const MenuSidebar = () => {
  const router = useRouter();
  const menuItems = [
    {
      text: "Dashboard",
      url: "/",
      icon: "icon-home",
    },
    {
      text: "Services",
      url: "/services",
      icon: "icon-database",
    },
    {
      text: "Products",
      url: "/products",
      icon: "icon-database",
    },
    {
      text: "Bookings",
      url: "/bookings",
      icon: "icon-bag2",
    },
    {
      text: "Customers",
      url: "/customers",
      icon: "icon-users2",
    },
    {
      text: "Stylists",
      url: "/stylists",
      icon: "icon-users2",
    },
    {
      text: "Request",
      url: "/categories/request-category",
      icon: "icon-cog",
    },
    {
      text: "Reports",
      url: "/reports",
      icon: "icon-cog",
    },
    {
      text: "Settings",
      url: "/settings",
      icon: "icon-cog",
    },
  ];

  return (
    <ul className="menu">
      {menuItems.map((item, index) => (
        <li
          key={index}
          className={router.pathname === item.url ? "active" : ""}
        >
          <Link href={item.url}>
            <p>
              <i className={item.icon}></i>
              {item.text}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default MenuSidebar;
