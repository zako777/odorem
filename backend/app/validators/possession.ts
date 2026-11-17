import vine from '@vinejs/vine'

import { POSSESSION_CONDITIONS } from '#collection/domain/possession'

/**
 * Validator for updating a possession's personal data.
 */
export const updatePossessionValidator = vine.create({
  quantity: vine.number().min(1).optional(),
  condition: vine.enum(POSSESSION_CONDITIONS).optional(),
  rating: vine.number().min(1).max(5).nullable().optional(),
  comment: vine.string().maxLength(1000).nullable().optional(),
})
