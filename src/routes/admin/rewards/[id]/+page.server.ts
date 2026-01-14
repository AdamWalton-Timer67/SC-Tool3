/**
 * Admin Reward Edit/Create Page - Server Load
 *
 * Loads a specific reward or prepares for creating a new one
 */

import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, locals }) => {
	const supabase = locals.supabase;
	const { id } = params;

	// If id is "new", return empty reward
	if (id === 'new') {
		// Load all ingredients for the requirements selector
		const { data: ingredients } = await supabase
			.from('ingredients')
			.select('id, name_en, name_fr, category, rarity')
			.order('name_en');

		return {
			reward: null,
			ingredients: ingredients || [],
			requirements: [],
			reputationRequirements: [],
			isNew: true
		};
	}

	// Load existing reward
	const { data: reward, error: fetchError } = await supabase
		.from('rewards')
		.select('*')
		.eq('id', id)
		.single();

	if (fetchError || !reward) {
		throw error(404, 'Reward not found');
	}

	// Load reward requirements
	const { data: requirements } = await supabase
		.from('reward_ingredients')
		.select(
			`
			reward_id,
			ingredient_id,
			quantity,
			unit,
			ingredients (
				id,
				name_en,
				name_fr,
				category,
				rarity
			)
		`
		)
		.eq('reward_id', id);

	// Load all ingredients for the selector
	const { data: ingredients } = await supabase
		.from('ingredients')
		.select('id, name_en, name_fr, category, rarity')
		.order('name_en');

	// Load reputation requirements
	const { data: reputationRequirements } = await supabase
		.from('reputation_requirements')
		.select('*')
		.eq('reward_id', id)
		.order('created_at');

	return {
		reward,
		ingredients: ingredients || [],
		requirements: requirements || [],
		reputationRequirements: reputationRequirements || [],
		isNew: false
	};
};
