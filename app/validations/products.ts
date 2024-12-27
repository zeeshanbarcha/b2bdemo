import * as yup from "yup"

export const createProductSchema = yup.object({
  name: yup.string().min(3, "Name must be at least 3 characters").required(),
  description: yup.string().min(10, "Description must be at least 10 characters").required(),
  price: yup.number().positive("Price must be positive").required(),
  categoryId: yup.string().min(1, "Category is required").required(),
  inStock: yup.number().integer().min(0, "Stock must be 0 or greater").required(),
  images: yup.array(yup.string().url())
    .min(1, "At least one image is required")
    .max(5, "Maximum 5 images allowed")
    .required(),
  featured: yup.boolean().default(false),
  flashSale: yup.boolean().default(false),
  discount: yup.number().min(0).max(100).nullable().default(null),
  specifications: yup.object().optional(),
})

export type CreateProductInput = yup.InferType<typeof createProductSchema>