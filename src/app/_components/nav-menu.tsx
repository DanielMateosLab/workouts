"use client";

import Link from "next/link";
import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/shadcn/navigation-menu";

export function NavMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <MenuLink href="/">Home</MenuLink>
        <MenuLink href="/auth/login">Login</MenuLink>
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
