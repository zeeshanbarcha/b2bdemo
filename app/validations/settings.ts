import * as yup from 'yup'

export const settingsSchema = yup.object({
  firstName: yup.string().required('First name is required'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().nullable(),
  address: yup.string().nullable(),
  city: yup.string().nullable(),
  state: yup.string().nullable(),
  zipCode: yup.string().nullable(),
  country: yup.string().nullable(),
  image: yup.string().nullable()
})

export type SettingsFormData = yup.InferType<typeof settingsSchema>