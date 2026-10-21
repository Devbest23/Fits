import { Badge } from '../ui/Badge'
import type { ProductStatus, ProductType } from '../../types'

export function StatusBadge({ status }: { status: ProductStatus }) {
  return (
    <Badge variant={status === 'published' ? 'success' : 'warning'}>
      {status === 'published' ? 'Publicado' : 'Borrador'}
    </Badge>
  )
}

export function TypeBadge({ type }: { type: ProductType }) {
  return (
    <Badge variant={type === 'wholesale' ? 'primary' : 'outline'}>
      {type === 'wholesale' ? 'Al mayor' : 'Al detal'}
    </Badge>
  )
}
