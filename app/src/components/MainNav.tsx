import Link from "next/link"

import { cn } from "@/lib/utils/ui"
import { FormattedMessage } from 'react-intl'
import { Routes } from 'generated'
import React, { type PropsWithChildren } from 'react'
import { type Url } from 'url';

const MainNavLink: React.FC<PropsWithChildren & { href: Url | string }> = ({
  href,
  children,
  ...props
}) => {
  return (
    <Link
      href={href}
      className="text-sm font-bold transition-colors hover:text-primary"
      {...props}
    >
      {children}
    </Link>
  )
}

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <MainNavLink href={Routes.IndexPage()}>
        <FormattedMessage id="mainnav.link.all" defaultMessage="全部蛋糕" />
      </MainNavLink>
    </nav>
  )
}