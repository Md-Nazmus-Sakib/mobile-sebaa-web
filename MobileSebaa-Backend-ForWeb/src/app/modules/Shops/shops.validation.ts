import { z } from 'zod';

// Enum for Shop Status
export const ShopStatus = z.enum(['Approve', 'Pending', 'Rejected']);

// Zod Schema for shopLocation
const shopLocationSchema = z.object({
  lat: z
    .string({ required_error: 'Latitude is required.' })
    .min(-90, 'Latitude must be between -90 and 90.')
    .max(90, 'Latitude must be between -90 and 90.'),
  long: z
    .string({ required_error: 'Longitude is required.' })
    .min(-180, 'Longitude must be between -180 and 180.')
    .max(180, 'Longitude must be between -180 and 180.'),
});

// Zod Validation Schema for Shop Data (using `body`)
const createShopValidationSchema = z.object({
  body: z.object({
    ownerName: z
      .string({ required_error: 'Owner name is required.' })
      .nonempty(),
    shopName: z.string({ required_error: 'Shop name is required.' }).nonempty(),
    address: z.string({ required_error: 'Address is required.' }).nonempty(),
    email: z.string({ required_error: 'Email is required.' }).nonempty(),
    userEmail: z.string({ required_error: 'Email is required.' }).nonempty(),
    notes: z.string().optional(),
    mobile: z.string({ required_error: 'Mobile number is required.' }),

    alterMobile: z.string().optional(),
    shopLocation: shopLocationSchema, // Location object validation
    selectedDivision: z
      .string({ required_error: 'Division is required.' })
      .nonempty(),
    selectedDistrict: z
      .string({ required_error: 'District is required.' })
      .nonempty(),
    selectedTown: z.string({ required_error: 'Town is required.' }).nonempty(),
    serviceCategory: z
      .array(z.string())
      .nonempty('Service categories cannot be empty'),
    isDeleted: z.boolean().default(false),
    status: ShopStatus.default('Pending'),
    addDate: z.date().default(() => new Date()),
  }),
});

// Extract Type from the Schema
export const ShopValidation = {
  createShopValidationSchema,
};
