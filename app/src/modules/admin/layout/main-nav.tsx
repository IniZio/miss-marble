import { cn } from '@/lib/ui'
import { Routes } from 'generated'
import Link from "next/link"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href={Routes.AdminIndexPage()}
        className="text-lg font-semibold transition-colors hover:text-primary"
      >
        Admin
      </Link>
    </nav>
  )
}