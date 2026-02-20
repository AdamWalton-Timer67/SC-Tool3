/**
 * Wikelo Tracker - Svelte 5 Runes State Management
 * Stores for managing rewards, ingredients, and user progress
 * Now with Supabase integration for persistent storage
 */

import { browser } from '$app/environment';
import { supabase } from '$lib/supabase';
import { normalizeImageUrl } from '$lib/utils/imageUrl';

import { SvelteMap } from 'svelte/reactivity';

function toBoolean(value: unknown): boolean {
	if (typeof value === 'boolean') return value;
	if (typeof value === 'number') return value === 1;
	if (typeof value === 'string') {
		const normalized = value.trim().toLowerCase();
		return normalized === '1' || normalized === 'true' || normalized === 'yes';
	}
	return false;
}

function toNumber(value: unknown, fallback = 0): number {
	if (typeof value === 'number' && Number.isFinite(value)) return value;
	if (typeof value === 'string') {
		const parsed = Number(value);
		if (Number.isFinite(parsed)) return parsed;
	}
	return fallback;
}

// Types
export interface TranslatedText {
	en?: string;
	fr?: string;
}

export interface Requirement {
	id: string;
	name: TranslatedText;
	quantity: number;
	unit?: string;
	obtained: boolean;
}

export interface ShipComponent {
	count: number;
	name: string;
	category: string;
	class: string;
	grade: string;
}

export interface ReputationRequirement {
	id?: string;
	reputation_name: TranslatedText;
	required_level: number;
}

export interface Reward {
	id: string;
	name: TranslatedText;
	type: TranslatedText;
	rarity: 'legendary' | 'epic' | 'rare' | 'uncommon' | 'common';
	version?: string;
	favorCost?: number;
	description: TranslatedText;
	image: string;
	imageCredit?: string;
	missionName?: TranslatedText;
	requirements: Requirement[];
	reputationRequirements?: ReputationRequirement[];
	categoryId?: string;
	gives?: number;
	hasLoadout?: boolean;
	components?: ShipComponent[];
	notReleased?: boolean;
}

export interface Category {
	id: string;
	name: TranslatedText;
	icon: string;
	description: TranslatedText;
	rewards: Reward[];
}

export interface IngredientLinks {
	documentation?: {
		starcitizen_tools?: string;
		cstone_finder?: string;
	};
	market?: {
		uexcorp?: string;
	};
}

export interface Ingredient {
	id: string;
	name: TranslatedText;
	category: string;
	rarity: string;
	image: string;
	credit?: string;
	description: TranslatedText;
	howToObtain?: TranslatedText;
	locations?: {
		en: string[];
		fr: string[];
	};
	links?: IngredientLinks;
	location_id?: string | null;
	location_slug?: string | null;
	location_name_en?: string | null;
	location_name_fr?: string | null;
}

// Types pour les données Supabase
interface SupabaseReward {
	id: string;
	name_en: string;
	name_fr: string;
	type_en?: string;
	type_fr?: string;
	category: string;
	rarity: string;
	version?: string;
	favor_cost?: number;
	description_en?: string;
	description_fr?: string;
	image_url?: string;
	image_credit?: string;
	mission_name_en?: string;
	mission_name_fr?: string;
	has_loadout?: boolean;
	components?: ShipComponent[];
	gives?: number;
	not_released?: boolean;
	reward_ingredients?: {
		ingredient_id: string;
		quantity: number;
		unit?: string;
		ingredients: {
			id: string;
			name_en: string;
			name_fr: string;
			category: string;
			rarity: string;
		};
	}[];
	reputation_requirements?: {
		id: string;
		reward_id: string;
		reputation_name_en: string;
		reputation_name_fr: string;
		required_level: number;
	}[];
}

interface SupabaseIngredient {
	id: string;
	name_en: string;
	name_fr: string;
	category: string;
	rarity: string;
	image_url?: string;
	image_credit?: string;
	description_en?: string;
	description_fr?: string;
	how_to_obtain_en?: string;
	how_to_obtain_fr?: string;
	locations_en?: string[];
	locations_fr?: string[];
	location_id?: string | null;
	locations?: {
		id: string;
		slug: string;
		name_en: string;
		name_fr: string;
	} | null;
}

// Reactive state using Svelte 5 runes
class WikeloStore {
	rewards = $state<Category[]>([]);
	ingredients = $state<Ingredient[]>([]);
	introMission = $state<{
		id: string;
		name: TranslatedText;
		description: TranslatedText;
		version?: string;
		requirements: Requirement[];
	} | null>(null);
	userProgress = $state<Record<string, Record<string, boolean>>>({});
	inventory = $state<Record<string, number>>({});
	rewardCompletions = $state<Record<string, number>>({});
	favoriteRewards = $state<Set<string>>(new Set());

	favoriteIngredients = $state<Set<string>>(new Set());
	isCompactView = $state<boolean>(
		browser && localStorage.getItem('wikelo_compact_view') === 'true' ? true : false
	);

	currentLang = $state<'fr' | 'en'>('en');
	currentCategory = $state<string>('all');
	currentRarity = $state<string>('all');
	searchQuery = $state<string>('');
	favoritesOnly = $state<boolean>(false);
	viewMode = $state<'grid' | 'list'>('grid');

	isLoading = $state<boolean>(true);
	error = $state<string | null>(null);
	dataLoaded = $state<boolean>(false);

	// Dialog states
	selectedIngredient = $state<Ingredient | null>(null);
	selectedShip = $state<Reward | null>(null);
	currentUser = $state<{ id: string; email?: string } | null>(null);

	// Dialog de confirmation pour récupérer les ingrédients
	uncheckConfirmDialog = $state<{
		isOpen: boolean;
		rewardId: string;
		requirementId: string;
		ingredientName: string;
		quantity: number;
		unit?: string;
	} | null>(null);

	// Supabase realtime subscriptions
	// Realtime functionality removed as per request

	constructor() {
		if (browser) {
			// Start loading data immediately
			this.loadData();
			this.initAuth();
		}
	}

	// Initialize authentication and check current user
	async initAuth() {
		if (!browser) return;

		try {
			// Use getUser() instead of getSession() for security
			const {
				data: { user },
				error
			} = await supabase.auth.getUser();
			if (!error && user) {
				this.currentUser = {
					id: user.id,
					email: user.email
				};
				// Load data from Supabase when user is authenticated
				await this.loadInventoryFromSupabase();
				await this.loadRewardIngredientsFromSupabase();
				await this.loadRewardCompletionsFromSupabase();
				await this.loadFavoritesFromSupabase();
			}

			// Listen for auth changes
			supabase.auth.onAuthStateChange(async (event: any, session: any) => {
				if (event === 'SIGNED_IN' && session?.user) {
					// Verify the user with getUser() for security
					const {
						data: { user },
						error
					} = await supabase.auth.getUser();
					if (!error && user) {
						this.currentUser = {
							id: user.id,
							email: user.email
						};
						await this.loadInventoryFromSupabase();
						await this.loadRewardIngredientsFromSupabase();
						await this.loadRewardIngredientsFromSupabase();
						await this.loadRewardCompletionsFromSupabase();
						await this.loadFavoritesFromSupabase();
						await this.loadRewardCompletionsFromSupabase();
						await this.loadFavoritesFromSupabase();
						// Realtime subscriptions removed
						// this.cleanupRealtimeSubscriptions();
						// this.setupRealtimeSubscriptions();
					}
				} else if (event === 'SIGNED_OUT') {
					this.currentUser = null;
					// Clear data when logged out
					this.inventory = {};
					this.userProgress = {};
					this.rewardCompletions = {};
					this.favoriteRewards = new Set();
					this.favoriteIngredients = new Set();
					// Realtime subscriptions removed
					// this.cleanupRealtimeSubscriptions();
					// this.setupRealtimeSubscriptions();
				}
			});
		} catch (err) {
			console.error('Error initializing auth:', err);
		}
	}

	// Load data from Supabase with cache and parallel loading
	// Force reload data (useful after admin changes)
	async reloadData(): Promise<void> {
		this.dataLoaded = false;
		await this.loadData(true);
	}

	async loadData(force: boolean = false): Promise<void> {
		// Skip if data is already loaded and not forced
		if (this.dataLoaded && !force) {
			return;
		}

		try {
			this.isLoading = true;
			this.error = null;

			// Load all data in parallel for faster loading
			const [
				rewardsResult,
				rewardIngredientsResult,
				reputationRequirementsResult,
				ingredientsResult
			] = await Promise.all([
				// Load rewards
				supabase.from('rewards').select('*').order('name_en'),

				// Load reward_ingredients with ingredients
				supabase.from('reward_ingredients').select(`
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
					`),

				// Load reputation_requirements
				supabase.from('reputation_requirements').select('*'),

				// Load ingredients with location info
				supabase
					.from('ingredients')
					.select(
						`
						*,
						locations:location_id (
							id,
							slug,
							name_en,
							name_fr
						)
					`
					)
					.order('name_en')
			]);

			// Check for errors
			if (rewardsResult.error) {
				console.error('Error loading rewards:', rewardsResult.error);
				throw rewardsResult.error;
			}

			if (rewardIngredientsResult.error) {
				console.error('Error loading reward_ingredients:', rewardIngredientsResult.error);
				throw rewardIngredientsResult.error;
			}

			if (reputationRequirementsResult.error) {
				console.error('Error loading reputation_requirements:', reputationRequirementsResult.error);
				throw reputationRequirementsResult.error;
			}

			if (ingredientsResult.error) {
				console.error('Error loading ingredients:', ingredientsResult.error);
				throw ingredientsResult.error;
			}

			// Merge data manually
			const mergedRewardsData = (rewardsResult.data || []).map((reward) => ({
				...reward,
				reward_ingredients: (rewardIngredientsResult.data || [])
					.filter((ri) => ri.reward_id === reward.id)
					.map((ri) => ({
						ingredient_id: ri.ingredient_id,
						quantity: ri.quantity,
						unit: ri.unit,
						ingredients: ri.ingredients
					})),
				reputation_requirements: (reputationRequirementsResult.data || []).filter(
					(rr) => rr.reward_id === reward.id
				)
			}));

			// Transform data to expected format
			const transformedRewards = this.transformSupabaseRewards(mergedRewardsData || []);
			const transformedIngredients = this.transformSupabaseIngredients(
				ingredientsResult.data || []
			);

			this.rewards = transformedRewards;
			this.ingredients = transformedIngredients;

			this.dataLoaded = true;
			this.isLoading = false;
		} catch (err) {
			console.error('Error loading Wikelo data:', err);
			this.error = err instanceof Error ? err.message : 'Unknown error';
			this.isLoading = false;
		}
	}

	// Transform Supabase rewards data to expected format
	transformSupabaseRewards(rewardsData: SupabaseReward[]): Category[] {
		// Grouper les rewards par catégorie
		const categoriesMap = new SvelteMap<string, Category>();

		rewardsData.forEach((reward: SupabaseReward) => {
			const categoryKey = reward.category;

			if (!categoriesMap.has(categoryKey)) {
				categoriesMap.set(categoryKey, {
					id: categoryKey,
					name: this.getCategoryName(categoryKey),
					icon: this.getCategoryIcon(categoryKey),
					description: this.getCategoryDescription(categoryKey),
					rewards: []
				});
			}

			// Transformer le reward au format attendu
			const transformedReward: Reward = {
				id: reward.id,
				name: {
					en: reward.name_en,
					fr: reward.name_fr
				},
				type: {
					en: reward.type_en || '',
					fr: reward.type_fr || ''
				},
				rarity: reward.rarity as 'legendary' | 'epic' | 'rare' | 'uncommon' | 'common',
				version: reward.version,
				favorCost: reward.favor_cost,
				description: {
					en: reward.description_en || '',
					fr: reward.description_fr || ''
				},
				image: normalizeImageUrl(reward.image_url),
				imageCredit: reward.image_credit,
				missionName:
					reward.mission_name_en || reward.mission_name_fr
						? {
								en: reward.mission_name_en,
								fr: reward.mission_name_fr
							}
						: undefined,
				requirements: Array.from(
					(reward.reward_ingredients || [])
						.reduce((acc, ri) => {
							const existing = acc.get(ri.ingredient_id);
							if (existing) {
								existing.quantity += ri.quantity;
								return acc;
							}

							acc.set(ri.ingredient_id, {
								id: ri.ingredient_id,
								name: {
									en: ri.ingredients.name_en,
									fr: ri.ingredients.name_fr
								},
								quantity: ri.quantity,
								unit: ri.unit,
								obtained: false
							});
							return acc;
						}, new Map<string, Requirement>())
						.values()
				),
				reputationRequirements: (reward.reputation_requirements || []).map((rr) => ({
					id: rr.id,
					reputation_name: {
						en: rr.reputation_name_en,
						fr: rr.reputation_name_fr
					},
					required_level: rr.required_level
				})),
				categoryId: reward.category,
				gives: toNumber(reward.gives, 1),
				hasLoadout: toBoolean(reward.has_loadout),
				components: reward.components,
				notReleased: toBoolean(reward.not_released)
			};

			categoriesMap.get(categoryKey)?.rewards.push(transformedReward);
		});

		// Trier les catégories dans l'ordre souhaité
		const sortedCategories = Array.from(categoriesMap.values()).sort((a, b) => {
			return this.getCategoryOrder(a.id) - this.getCategoryOrder(b.id);
		});

		return sortedCategories;
	}

	// Transform Supabase ingredients data to expected format
	transformSupabaseIngredients(ingredientsData: SupabaseIngredient[]): Ingredient[] {
		return ingredientsData.map((ingredient: SupabaseIngredient) => {
			const transformedIngredient: Partial<Ingredient> = {
				id: ingredient.id,
				name: {
					en: ingredient.name_en,
					fr: ingredient.name_fr
				},
				category: ingredient.category,
				rarity: ingredient.rarity,
				image: normalizeImageUrl(ingredient.image_url),
				credit: ingredient.image_credit,
				description: {
					en: ingredient.description_en || '',
					fr: ingredient.description_fr || ''
				}
			};

			// Ajouter howToObtain seulement s'il y a du contenu
			if (ingredient.how_to_obtain_en || ingredient.how_to_obtain_fr) {
				transformedIngredient.howToObtain = {
					en: ingredient.how_to_obtain_en || '',
					fr: ingredient.how_to_obtain_fr || ''
				};
			}

			// Ajouter locations seulement s'il y a du contenu
			if (ingredient.locations_en?.length || ingredient.locations_fr?.length) {
				// S'assurer que locations_en et locations_fr sont des tableaux de strings
				const ensureStringArray = (arr: unknown): string[] => {
					if (!arr) return [];
					if (!Array.isArray(arr)) return [];

					// Aplatir le tableau si c'est un tableau de tableaux [[...]]
					const flattened = arr.flat(Infinity);

					return flattened.map((item) => (typeof item === 'string' ? item : String(item)));
				};

				transformedIngredient.locations = {
					en: ensureStringArray(ingredient.locations_en),
					fr: ensureStringArray(ingredient.locations_fr)
				};
			}

			// Ajouter les données de location structurée si disponible
			if (ingredient.locations) {
				transformedIngredient.location_id = ingredient.locations.id;
				transformedIngredient.location_slug = ingredient.locations.slug;
				transformedIngredient.location_name_en = ingredient.locations.name_en;
				transformedIngredient.location_name_fr = ingredient.locations.name_fr;
			}

			return transformedIngredient as Ingredient;
		});
	}

	// Helper functions pour les catégories
	getCategoryName(categoryId: string): TranslatedText {
		const names: Record<string, TranslatedText> = {
			ships: { en: 'Ships', fr: 'Vaisseaux' },
			weapons: { en: 'Weapons', fr: 'Armes' },
			armor: { en: 'Armor', fr: 'Armures' },
			utility: { en: 'Utilities', fr: 'Utilitaires' },
			utilities: { en: 'Utilities', fr: 'Utilitaires' },
			vehicles: { en: 'Vehicles', fr: 'Véhicules' },
			currency: { en: 'Currencies', fr: 'Monnaies' }
		};
		return names[categoryId] || { en: categoryId, fr: categoryId };
	}

	getCategoryIcon(categoryId: string): string {
		const icons: Record<string, string> = {
			ships: '🚀',
			weapons: '⚔️',
			armor: '🛡️',
			utility: '🔧',
			utilities: '🔧',
			vehicles: '🚜',
			currency: '💎'
		};
		return icons[categoryId] || '📦';
	}

	getCategoryDescription(categoryId: string): TranslatedText {
		const descriptions: Record<string, TranslatedText> = {
			ships: {
				en: 'Spacecraft and space vehicles',
				fr: 'Vaisseaux spatiaux et véhicules spatiaux'
			},
			weapons: { en: 'Weapons and armaments', fr: 'Armes et armements' },
			armor: { en: 'Protective gear and armor', fr: 'Équipements de protection et armures' },
			utility: { en: 'Utility items and tools', fr: 'Objets utilitaires et outils' },
			utilities: { en: 'Utility items and tools', fr: 'Objets utilitaires et outils' },
			vehicles: {
				en: 'Ground and atmospheric vehicles',
				fr: 'Véhicules terrestres et atmosphériques'
			},
			currency: { en: 'Currencies and valuable items', fr: 'Monnaies et objets de valeur' }
		};
		return descriptions[categoryId] || { en: '', fr: '' };
	}

	getCategoryOrder(categoryId: string): number {
		const order: Record<string, number> = {
			currency: 1,
			utility: 2,
			utilities: 2,
			weapons: 3,
			armor: 4,
			vehicles: 5,
			ships: 6
		};
		return order[categoryId] || 999; // Les catégories non définies vont à la fin
	}

	// Check if user is authenticated (used to block actions)
	get isAuthenticated(): boolean {
		return this.currentUser !== null;
	}

	getInventoryQuantity(ingredientId: string): number {
		return this.inventory[ingredientId] ?? 0;
	}

	async setInventoryQuantity(ingredientId: string, quantity: number) {
		if (!this.currentUser) return; // Block if not authenticated

		const nextInventory = { ...this.inventory };
		if (quantity <= 0) {
			delete nextInventory[ingredientId];
		} else {
			nextInventory[ingredientId] = quantity;
		}
		this.inventory = nextInventory;

		await this.saveInventoryToSupabase(ingredientId, quantity);
	}

	async adjustInventoryQuantity(ingredientId: string, delta: number) {
		if (!this.currentUser) return; // Block if not authenticated

		const current = this.getInventoryQuantity(ingredientId);
		const newQuantity = Math.max(0, current + delta);
		await this.setInventoryQuantity(ingredientId, newQuantity);
	}

	// ========================================
	// Supabase Integration Methods
	// ========================================

	// Load inventory from Supabase
	async loadInventoryFromSupabase() {
		if (!browser || !this.currentUser) return;

		try {
			const { data, error } = await supabase
				.from('user_inventory')
				.select('ingredient_id, quantity')
				.eq('user_id', this.currentUser.id);

			if (error) {
				console.error('Error loading inventory from Supabase:', error);
				throw error;
			}

			if (data) {
				const inventoryMap: Record<string, number> = {};
				data.forEach((item) => {
					inventoryMap[item.ingredient_id] = item.quantity;
				});
				this.inventory = inventoryMap;
			}
		} catch (err) {
			console.error('Error loading inventory from Supabase:', err);
		}
	}

	// Save inventory to Supabase
	async saveInventoryToSupabase(ingredientId: string, quantity: number) {
		if (!browser || !this.currentUser) return;

		try {
			if (quantity <= 0) {
				// Delete the record if quantity is 0
				const { error } = await supabase
					.from('user_inventory')
					.delete()
					.eq('user_id', this.currentUser.id)
					.eq('ingredient_id', ingredientId);

				if (error) {
					console.error('Error deleting inventory item:', error, {
						ingredientId,
						userId: this.currentUser.id
					});
				}
			} else {
				// Upsert the record
				const { error } = await supabase.from('user_inventory').upsert(
					{
						user_id: this.currentUser.id,
						ingredient_id: ingredientId,
						quantity: quantity
					},
					{
						onConflict: 'user_id,ingredient_id'
					}
				);

				if (error) {
					console.error('Error upserting inventory item:', error, {
						ingredientId,
						quantity,
						userId: this.currentUser.id
					});
				}
			}
		} catch (err) {
			console.error('Error saving inventory to Supabase:', err);
		}
	}

	// Load reward ingredients from Supabase
	async loadRewardIngredientsFromSupabase() {
		if (!browser || !this.currentUser) return;

		try {
			const { data, error } = await supabase
				.from('user_reward_ingredients')
				.select('reward_id, ingredient_id, is_checked')
				.eq('user_id', this.currentUser.id);

			if (error) throw error;

			if (data) {
				const progressMap: Record<string, Record<string, boolean>> = {};
				data.forEach((item) => {
					if (!progressMap[item.reward_id]) {
						progressMap[item.reward_id] = {};
					}
					progressMap[item.reward_id][item.ingredient_id] = item.is_checked;
				});
				this.userProgress = progressMap;
			}
		} catch (err) {
			console.error('Error loading reward ingredients from Supabase:', err);
		}
	}

	// Save reward ingredient check to Supabase
	async saveRewardIngredientToSupabase(rewardId: string, ingredientId: string, isChecked: boolean) {
		if (!browser || !this.currentUser) return;

		try {
			await supabase.from('user_reward_ingredients').upsert(
				{
					user_id: this.currentUser.id,
					reward_id: rewardId,
					ingredient_id: ingredientId,
					is_checked: isChecked
				},
				{
					onConflict: 'user_id,reward_id,ingredient_id'
				}
			);
		} catch (err) {
			console.error('Error saving reward ingredient to Supabase:', err);
		}
	}

	// Load reward completions from Supabase
	async loadRewardCompletionsFromSupabase() {
		if (!browser || !this.currentUser) return;

		try {
			const { data, error } = await supabase
				.from('user_reward_completions')
				.select('reward_id, completion_count')
				.eq('user_id', this.currentUser.id);

			if (error) throw error;

			if (data) {
				const completionsMap: Record<string, number> = {};
				data.forEach((item) => {
					completionsMap[item.reward_id] = item.completion_count;
				});
				this.rewardCompletions = completionsMap;
			}
		} catch (err) {
			console.error('Error loading reward completions from Supabase:', err);
		}
	}

	// Save reward completion to Supabase
	async saveRewardCompletionToSupabase(rewardId: string, completionCount: number) {
		if (!browser || !this.currentUser) return;

		try {
			await supabase.from('user_reward_completions').upsert(
				{
					user_id: this.currentUser.id,
					reward_id: rewardId,
					completion_count: completionCount
				},
				{
					onConflict: 'user_id,reward_id'
				}
			);
		} catch (err) {
			console.error('Error saving reward completion to Supabase:', err);
		}
	}

	// Load favorites from Supabase
	async loadFavoritesFromSupabase() {
		if (!browser || !this.currentUser) return;

		try {
			// Load favorite rewards
			const { data: rewardsData, error: rewardsError } = await supabase
				.from('user_favorite_rewards')
				.select('reward_id')
				.eq('user_id', this.currentUser.id);

			if (rewardsError) throw rewardsError;

			if (rewardsData) {
				this.favoriteRewards = new Set(rewardsData.map((r) => r.reward_id));
			}

			// Load favorite ingredients
			const { data: ingredientsData, error: ingredientsError } = await supabase
				.from('user_favorite_ingredients')
				.select('ingredient_id')
				.eq('user_id', this.currentUser.id);

			if (ingredientsError) throw ingredientsError;

			if (ingredientsData) {
				this.favoriteIngredients = new Set(ingredientsData.map((i) => i.ingredient_id));
			}
		} catch (err) {
			console.error('Error loading favorites from Supabase:', err);
		}
	}

	// Toggle favorite reward
	async toggleFavoriteReward(rewardId: string) {
		if (!this.currentUser) return;

		const isFav = this.favoriteRewards.has(rewardId);
		if (isFav) {
			this.favoriteRewards.delete(rewardId);
			// Force reactivity for Set
			this.favoriteRewards = new Set(this.favoriteRewards);
			await supabase
				.from('user_favorite_rewards')
				.delete()
				.eq('user_id', this.currentUser.id)
				.eq('reward_id', rewardId);
		} else {
			this.favoriteRewards.add(rewardId);
			this.favoriteRewards = new Set(this.favoriteRewards);
			await supabase.from('user_favorite_rewards').insert({
				user_id: this.currentUser.id,
				reward_id: rewardId
			});
		}
	}

	// Toggle favorite ingredient
	async toggleFavoriteIngredient(ingredientId: string) {
		if (!this.currentUser) return;

		const isFav = this.favoriteIngredients.has(ingredientId);
		if (isFav) {
			this.favoriteIngredients.delete(ingredientId);
			this.favoriteIngredients = new Set(this.favoriteIngredients);
			await supabase
				.from('user_favorite_ingredients')
				.delete()
				.eq('user_id', this.currentUser.id)
				.eq('ingredient_id', ingredientId);
		} else {
			this.favoriteIngredients.add(ingredientId);
			this.favoriteIngredients = new Set(this.favoriteIngredients);
			await supabase.from('user_favorite_ingredients').insert({
				user_id: this.currentUser.id,
				ingredient_id: ingredientId
			});
		}
	}

	// Toggle global compact view
	toggleCompactView() {
		this.isCompactView = !this.isCompactView;
		// Save to localStorage
		if (browser) {
			localStorage.setItem('wikelo_compact_view', String(this.isCompactView));
		}
	}

	// Check if reward is collapsed (now uses global state)
	isRewardCollapsed(): boolean {
		return this.isCompactView;
	}

	// ========================================
	// End Supabase Integration Methods
	// ========================================

	// Toggle requirement completion
	async toggleRequirement(rewardId: string, requirementId: string) {
		const currentRewardProgress = this.userProgress[rewardId] ?? {};
		const wasChecked = currentRewardProgress[requirementId] ?? false;
		const isNowChecked = !wasChecked;

		if (!this.currentUser) {
			this.userProgress = {
				...this.userProgress,
				[rewardId]: {
					...currentRewardProgress,
					[requirementId]: isNowChecked
				}
			};
			return;
		}

		// Si on décoche (wasChecked = true), afficher la dialog de confirmation
		if (wasChecked) {
			const requirement = this.getRequirement(rewardId, requirementId);
			if (requirement) {
				this.uncheckConfirmDialog = {
					isOpen: true,
					rewardId,
					requirementId,
					ingredientName: this.getText(requirement.name),
					quantity: requirement.quantity,
					unit: requirement.unit
				};
				return; // Ne pas continuer le toggle, attendre la confirmation
			}
		}

		// Si on coche, procéder normalement
		this.userProgress = {
			...this.userProgress,
			[rewardId]: {
				...currentRewardProgress,
				[requirementId]: isNowChecked
			}
		};
		await this.saveRewardIngredientToSupabase(rewardId, requirementId, isNowChecked);

		// Get the requirement details to know the quantity
		const requirement = this.getRequirement(rewardId, requirementId);
		if (requirement) {
			// Decrement inventory when checking, increment when unchecking
			const delta = isNowChecked ? -requirement.quantity : requirement.quantity;
			await this.adjustInventoryQuantityWithSupabase(requirementId, delta);
		}
	}

	// Helper to get requirement details
	getRequirement(rewardId: string, requirementId: string): Requirement | null {
		for (const category of this.rewards) {
			const reward = category.rewards.find((r) => r.id === rewardId);
			if (reward) {
				const requirement = reward.requirements.find((r) => r.id === requirementId);
				if (requirement) {
					return requirement;
				}
			}
		}
		return null;
	}

	// Confirmer le décochage avec récupération des ingrédients dans l'inventaire
	async confirmUncheckWithInventory() {
		if (!this.uncheckConfirmDialog) return;

		const { rewardId, requirementId, quantity } = this.uncheckConfirmDialog;

		// Décocher l'élément
		this.userProgress = {
			...this.userProgress,
			[rewardId]: {
				...(this.userProgress[rewardId] ?? {}),
				[requirementId]: false
			}
		};
		await this.saveRewardIngredientToSupabase(rewardId, requirementId, false);

		// Ajouter les ingrédients à l'inventaire
		await this.adjustInventoryQuantityWithSupabase(requirementId, quantity);

		// Fermer la dialog
		this.uncheckConfirmDialog = null;
	}

	// Confirmer le décochage sans récupération des ingrédients
	async confirmUncheckWithoutInventory() {
		if (!this.uncheckConfirmDialog) return;

		const { rewardId, requirementId } = this.uncheckConfirmDialog;

		// Décocher l'élément sans modifier l'inventaire
		this.userProgress = {
			...this.userProgress,
			[rewardId]: {
				...(this.userProgress[rewardId] ?? {}),
				[requirementId]: false
			}
		};
		await this.saveRewardIngredientToSupabase(rewardId, requirementId, false);

		// Fermer la dialog
		this.uncheckConfirmDialog = null;
	}

	// Helper to check if is favorite
	isFavoriteReward(rewardId: string): boolean {
		return this.favoriteRewards.has(rewardId);
	}

	isFavoriteIngredient(ingredientId: string): boolean {
		return this.favoriteIngredients.has(ingredientId);
	}

	// Annuler le décochage (remettre la checkbox cochée)
	cancelUncheck() {
		// Simplement fermer la dialog sans rien faire
		// La checkbox reste cochée car on n'a pas modifié userProgress
		this.uncheckConfirmDialog = null;
	}

	// Adjust inventory with Supabase support
	async adjustInventoryQuantityWithSupabase(ingredientId: string, delta: number) {
		if (!this.currentUser) return; // Block if not authenticated

		const current = this.getInventoryQuantity(ingredientId);
		const newQuantity = Math.max(0, current + delta);

		// Update local state with immutable write so Svelte reacts to every click
		const nextInventory = { ...this.inventory };
		if (newQuantity <= 0) {
			delete nextInventory[ingredientId];
		} else {
			nextInventory[ingredientId] = newQuantity;
		}
		this.inventory = nextInventory;

		await this.saveInventoryToSupabase(ingredientId, newQuantity);
	}

	// Check if requirement is obtained
	isRequirementObtained(rewardId: string, requirementId: string): boolean {
		return this.userProgress[rewardId]?.[requirementId] ?? false;
	}

	// Calculate reward progress
	calculateProgress(reward: Reward) {
		if (!reward || !reward.requirements) {
			return { total: 0, obtained: 0, percentage: 0 };
		}

		const total = reward.requirements.length;
		const obtained = reward.requirements.filter((req) =>
			this.isRequirementObtained(reward.id, req.id)
		).length;
		const percentage = total > 0 ? Math.round((obtained / total) * 100) : 0;

		return { total, obtained, percentage };
	}

	// Get all rewards with filtering
	get filteredRewards(): Reward[] {
		const allRewards: Reward[] = [];

		// Collect all rewards
		this.rewards.forEach((category) => {
			category.rewards.forEach((reward) => {
				allRewards.push({ ...reward, categoryId: category.id });
			});
		});

		// Apply filters
		return allRewards.filter((reward) => {
			// Category filter
			if (this.currentCategory !== 'all' && reward.categoryId !== this.currentCategory) {
				return false;
			}

			// Rarity filter
			if (this.currentRarity !== 'all' && reward.rarity !== this.currentRarity) {
				return false;
			}

			// Search filter
			if (this.searchQuery && this.searchQuery.trim() !== '') {
				const query = this.searchQuery.toLowerCase().trim();
				const matchesSearch =
					this.getText(reward.name).toLowerCase().includes(query) ||
					this.getText(reward.description).toLowerCase().includes(query) ||
					this.getText(reward.type).toLowerCase().includes(query);

				if (!matchesSearch) {
					return false;
				}
			}

			// Favorites filter
			if (this.favoritesOnly && !this.favoriteRewards.has(reward.id)) {
				return false;
			}

			return true;
		});
	}

	// Get stats
	get stats() {
		let totalRewards = 0;
		let completedRewards = 0;

		this.rewards.forEach((category) => {
			category.rewards.forEach((reward) => {
				totalRewards++;
				const progress = this.calculateProgress(reward);
				if (progress.percentage === 100) {
					completedRewards++;
				}
			});
		});

		const progressPercent =
			totalRewards > 0 ? Math.round((completedRewards / totalRewards) * 100) : 0;

		return { totalRewards, completedRewards, progressPercent };
	}

	// Get ingredient by ID
	getIngredient(id: string): Ingredient | undefined {
		return this.ingredients.find((ing) => ing.id === id);
	}

	// Get completion count for a reward
	getCompletionCount(rewardId: string): number {
		return this.rewardCompletions[rewardId] ?? 0;
	}

	// Reset a completed reward (uncheck all ingredients and increment completion counter)
	async resetReward(rewardId: string) {
		if (!this.currentUser) return;

		const reward = this.getRewardById(rewardId);
		if (!reward) return;

		// Increment completion counter
		const currentCount = this.getCompletionCount(rewardId);
		const newCount = currentCount + 1;
		this.rewardCompletions[rewardId] = newCount;
		await this.saveRewardCompletionToSupabase(rewardId, newCount);

		// Uncheck all requirements
		if (this.userProgress[rewardId]) {
			const updatedRewardProgress = { ...(this.userProgress[rewardId] ?? {}) };
			for (const requirementId of Object.keys(updatedRewardProgress)) {
				updatedRewardProgress[requirementId] = false;
				await this.saveRewardIngredientToSupabase(rewardId, requirementId, false);
			}
			this.userProgress = {
				...this.userProgress,
				[rewardId]: updatedRewardProgress
			};
		}
	}

	// Get reward by ID
	getRewardById(rewardId: string): Reward | null {
		for (const category of this.rewards) {
			const reward = category.rewards.find((r) => r.id === rewardId);
			if (reward) {
				return reward;
			}
		}
		return null;
	}

	// Helper pour obtenir le texte traduit
	getText(obj: TranslatedText | undefined | null): string {
		if (!obj) return '';
		const text = obj[this.currentLang] || obj.en || obj.fr || '';
		// S'assurer que text est bien une chaîne de caractères
		return typeof text === 'string' ? text : '';
	}

	// Traductions de l'interface
	get t() {
		const translations = {
			fr: {
				// Header
				subtitle: 'Banu Trading Systems • Stanton Sector',
				totalRewards: 'Total Récompenses',
				completed: 'Complétées',
				progression: 'Progression',

				// Filters
				searchPlaceholder: 'Rechercher une récompense...',
				allRarities: 'Toutes',
				legendary: 'Légendaire',
				epic: 'Épique',
				rare: 'Rare',
				uncommon: 'Inhabituel',
				common: 'Commun',

				gridView: 'Grille',
				listView: 'Liste',
				favoritesOnly: 'Favoris',

				// Categories
				allCategories: 'Toutes les Récompenses',

				// View Options
				compactView: 'Compact',

				// Loading & Errors
				loading: 'Chargement des données Wikelo...',
				loadingError: 'Erreur de chargement',
				noResults: 'Aucune récompense trouvée avec les filtres actuels',

				// Footer
				footerVersion: 'Wikelo Tracker v1.0 • Données Star Citizen Alpha 4.3+',
				footerDisclaimer: "Cet outil n'est pas affilié à Cloud Imperium Games",
				rsiWebsite: 'RSI Website',
				officialWiki: 'Wiki Officiel',
				dataSources: 'Sources de Données'
			},
			en: {
				// Header
				subtitle: 'Banu Trading Systems • Stanton Sector',
				totalRewards: 'Total Rewards',
				completed: 'Completed',
				progression: 'Progress',

				// Filters
				searchPlaceholder: 'Search for a reward...',
				allRarities: 'All',
				legendary: 'Legendary',
				epic: 'Epic',
				rare: 'Rare',
				uncommon: 'Uncommon',
				common: 'Common',

				gridView: 'Grid',
				listView: 'List',
				favoritesOnly: 'Favorites',

				// Categories
				allCategories: 'All Rewards',

				// View Options
				compactView: 'Compact',

				// Loading & Errors
				loading: 'Loading Wikelo data...',
				loadingError: 'Loading Error',
				noResults: 'No rewards found with current filters',

				// Footer
				footerVersion: 'Wikelo Tracker v1.0 • Star Citizen Alpha 4.5 Data',
				footerDisclaimer: 'This tool is not affiliated with Cloud Imperium Games',
				rsiWebsite: 'RSI Website',
				officialWiki: 'Official Wiki',
				dataSources: 'Data Sources'
			}
		};

		return translations[this.currentLang];
	}

	// Ouvrir dialog ingrédient
	openIngredientDialog(ingredient: Ingredient) {
		this.selectedIngredient = ingredient;
	}

	// Fermer dialog ingrédient
	closeIngredientDialog() {
		this.selectedIngredient = null;
	}

	// Ouvrir dialog loadout vaisseau
	openShipDialog(ship: Reward) {
		this.selectedShip = ship;
	}

	// Fermer dialog loadout vaisseau
	closeShipDialog() {
		this.selectedShip = null;
	}
}

// Export singleton instance
export const wikeloStore = new WikeloStore();
