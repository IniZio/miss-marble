"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/ui"
import { buttonVariants } from '@/components/ui/button'

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    icon: React.ReactNode,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    href: any;
    title: string
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "flex flex-col px-8 py-12 space-y-2 h-full",
        className
      )}
      {...props}
    >
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            pathname.startsWith(item.href.pathname)
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start space-x-4 text-xs font-medium text-muted-foreground"
          )}
        >
          <div className="flex items-center justify-center">
            {item.icon}
          </div>
          <span>
            {item.title}
          </span>
        </Link>
      ))}
    </nav>
  )
}