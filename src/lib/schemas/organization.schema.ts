import { z } from 'zod';

/**
 * Schéma de validation partagé pour les organisations
 * Utilisé côté client ET serveur pour garantir la cohérence
 */
export const organizationSchema = z.object({
	name: z
		.string()
		.min(3, 'Le nom doit contenir au moins 3 caractères')
		.max(100, 'Le nom ne doit pas dépasser 100 caractères')
		.trim(),
	description: z
		.string()
		.max(500, 'La description ne doit pas dépasser 500 caractères')
		.trim()
		.optional()
		.nullable(),
	image_url: z.string().url('URL d\'image invalide').optional().nullable()
});

export const createOrganizationSchema = organizationSchema;

export const updateOrganizationSchema = organizationSchema.partial();

export type OrganizationInput = z.infer<typeof organizationSchema>;
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
