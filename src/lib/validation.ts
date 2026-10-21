import { z } from 'zod'

const nullablePositiveNumber = z
  .string()
  .optional()
  .transform((value) => (value && value.trim() !== '' ? Number(value) : null))
  .pipe(z.number().positive('Debe ser un número mayor que 0').nullable())

export const productFormSchema = z
  .object({
    name: z.string().trim().min(3, 'Escribe un nombre de al menos 3 caracteres'),
    category: z.string().trim().min(1, 'Selecciona o escribe una categoría'),
    type: z.enum(['retail', 'wholesale']),
    price: z.coerce.number().positive('El precio debe ser mayor que 0'),
    compareAtPrice: nullablePositiveNumber,
    description: z
      .string()
      .trim()
      .min(12, 'La descripción debe tener al menos 12 caracteres'),
    image: z.string().min(1, 'Selecciona o sube una imagen'),
    sizes: z.array(z.string()).min(1, 'Selecciona al menos una talla'),
    stock: z.coerce.number().int().min(0, 'El stock no puede ser negativo'),
    packQuantity: z
      .string()
      .optional()
      .transform((value) => (value && value.trim() !== '' ? Number(value) : null))
      .pipe(z.number().int().min(1, 'El paquete debe tener al menos 1 unidad').nullable()),
    featured: z.boolean(),
    status: z.enum(['draft', 'published']),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'wholesale' && !data.packQuantity) {
      ctx.addIssue({
        code: 'custom',
        path: ['packQuantity'],
        message: 'Indica cuántas unidades trae el paquete',
      })
    }

    if (data.compareAtPrice && data.compareAtPrice <= data.price) {
      ctx.addIssue({
        code: 'custom',
        path: ['compareAtPrice'],
        message: 'El precio anterior debe ser mayor que el precio actual',
      })
    }
  })

export type ProductFormValues = z.output<typeof productFormSchema>
