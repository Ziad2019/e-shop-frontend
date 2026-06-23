import Link from 'next/link'
import { NavigationMenuLink } from './ui/navigation-menu'
import { cn } from '@/lib/utils'

export function ListItem({
  children,
  href,
  icon,
  ...props
}: React.ComponentPropsWithoutRef<'li'> & {
  href: string
  icon?: string
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-lg',
            'text-sm text-foreground',
            'hover:bg-bg-secondary transition-colors',
            'w-full'
          )}
        >
          {icon && (
            <span className="text-xl shrink-0">{icon}</span>
          )}
          <span className="text-text-muted hover:text-brand">
            {children}
          </span>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}