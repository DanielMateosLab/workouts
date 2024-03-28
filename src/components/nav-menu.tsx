"use client";

import Link from "next/link";
import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

export function NavMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <MenuLink href="/">Home</MenuLink>
        <MenuLink href="/login">Login</MenuLink>
        <MenuLink href="/signup">Signup</MenuLink>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

interface SimpleNavigationMenuLinkProps {
  href: string;
  children: React.ReactNode;
}

const MenuLink: React.FC<SimpleNavigationMenuLinkProps> = ({
  href,
  children,
}) => (
  <Link href={href} legacyBehavior passHref>
    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
      {children}
    </NavigationMenuLink>
  </Link>
);