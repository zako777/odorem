import vine from '@vinejs/vine'

/**
 * EAN-8, UPC-A, EAN-13 and GTIN-14 codes. Stored as text to keep leading zeros.
 */
export const barcodeValidator = vine.create({
  code: vine
    .string()
    .trim()
    .regex(/^\d{8,14}$/),
})
