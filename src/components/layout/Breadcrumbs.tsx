import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const all = [{ label: 'Home', href: '/' }, ...items]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: all.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${process.env.NEXT_PUBLIC_SITE_URL}${item.href}` } : {}),
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="breadcrumb">
        <ol className="flex items-center gap-1 text-sm text-neutral-500 flex-wrap">
          {all.map((item, i) => (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-neutral-300 shrink-0" />}
              {item.href && i < all.length - 1 ? (
                <Link href={item.href} className="hover:text-saffron-500 transition-colors flex items-center gap-1">
                  {i === 0 && <Home className="h-3.5 w-3.5" />}
                  {i === 0 ? <span className="sr-only">Home</span> : item.label}
                </Link>
              ) : (
                <span className="font-medium text-neutral-700 flex items-center gap-1">
                  {i === 0 && <Home className="h-3.5 w-3.5" />}
                  {i === 0 ? <span className="sr-only">Home</span> : item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
