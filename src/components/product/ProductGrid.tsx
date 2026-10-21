import { cn } from '../../lib/cn'
import type { Product } from '../../types'
import { ProductCard } from './ProductCard'

export function ProductGrid({
  products,
  className,
  priorityFirst = false,
}: {
  products: Product[]
  className?: string
  priorityFirst?: boolean
}) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-5 md:grid-cols-3 lg:gap-x-6',
        className,
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={priorityFirst && index < 2}
        />
      ))}
    </div>
  )
}
