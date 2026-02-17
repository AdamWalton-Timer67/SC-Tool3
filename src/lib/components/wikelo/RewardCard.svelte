<script lang="ts">
	import { wikeloStore } from '$lib/stores/wikelo.svelte';
	import type { Reward } from '$lib/stores/wikelo.svelte';
	import ImageWithFallback from './ImageWithFallback.svelte';
	import SuggestionDialog from '$lib/components/SuggestionDialog.svelte';
	import { captureEvent } from '$lib/analytics';

	interface Props {
		reward: Reward;
		onLoginRequired?: () => void;
		priority?: number; // Priorité de chargement de l'image
	}

	let { reward, onLoginRequired, priority = 999 }: Props = $props();

	let isSuggestionDialogOpen = $state(false);

	const viewMode = $derived(wikeloStore.viewMode);

	const progress = $derived(wikeloStore.calculateProgress(reward));
	const isCompleted = $derived(progress.percentage === 100);
	const completionCount = $derived(wikeloStore.getCompletionCount(reward.id));
	const getText = (obj: { en?: string; fr?: string } | undefined | null) =>
		wikeloStore.getText(obj);

	const rarityColors = {
		legendary: 'from-purple-500 via-pink-500 to-yellow-500',
		epic: 'from-purple-600 to-blue-500',
		rare: 'from-blue-500 to-cyan-400',
		uncommon: 'from-emerald-500 to-green-600',
		common: 'from-gray-500 to-gray-400'
	};

	const rarityLabels = $derived(
		wikeloStore.currentLang === 'fr'
			? {
					legendary: 'Légendaire',
					epic: 'Épique',
					rare: 'Rare',
					uncommon: 'Inhabituel',
					common: 'Commun'
				}
			: {
					legendary: 'Legendary',
					epic: 'Epic',
					rare: 'Rare',
					uncommon: 'Uncommon',
					common: 'Common'
				}
	);

	const t = $derived(
		wikeloStore.currentLang === 'fr'
			? {
					viewLoadout: 'Voir le Loadout Détaillé',
					requiredIngredients: 'Ingrédients Requis',
					details: 'Détails',
					detailsTitle: "Voir les détails de l'ingrédient",
					progression: 'Progression',
					available: 'disponibles',
					required: 'requis',
					completedTimes: 'Complétée',
					times: 'fois',
					restartReward: 'Recommencer cette récompense',
					restartTooltip: 'Décoche tous les ingrédients et incrémente le compteur',
					comingSoon: 'Prochainement',
					notReleasedMessage:
						"Cette récompense arrivera prochainement dans le jeu mais n'est pas encore implémentée.",
					suggest: 'Suggérer'
				}
			: {
					viewLoadout: 'View Detailed Loadout',
					requiredIngredients: 'Required Ingredients',
					details: 'Details',
					detailsTitle: 'View ingredient details',
					progression: 'Progression',
					available: 'available',
					required: 'required',
					completedTimes: 'Completed',
					times: 'times',
					restartReward: 'Restart this reward',
					restartTooltip: 'Uncheck all ingredients and increment counter',
					comingSoon: 'Coming Soon',
					notReleasedMessage: 'This reward is coming soon to the game but is not yet implemented.',
					suggest: 'Suggest'
				}
	);

	function handleCheckboxClick(event: Event, requirementId: string) {
		if (!wikeloStore.currentUser) {
			// Inverse l'état de la checkbox pour revenir à l'état d'origine
			(event.target as HTMLInputElement).checked = !(event.target as HTMLInputElement).checked;
			onLoginRequired?.();
			return;
		}

		const requirement = reward.requirements.find((r) => r.id === requirementId);
		wikeloStore.toggleRequirement(reward.id, requirementId);
		captureEvent('wikelo_requirement_checkbox_toggled', {
			rewardId: reward.id,
			rewardName: getText(reward.name),
			requirementId: requirementId,
			requirementName: requirement ? getText(requirement.name) : '',
			checked: !wikeloStore.isRequirementObtained(reward.id, requirementId)
		});
	}

	function getRarityBadgeClass(rarity: Reward['rarity']) {
		const baseClass =
			'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-linear-to-r';
		return `${baseClass} ${rarityColors[rarity]} text-white shadow-lg`;
	}

	async function handleResetReward() {
		if (!wikeloStore.currentUser) {
			onLoginRequired?.();
			return;
		}
		await wikeloStore.resetReward(reward.id);
		captureEvent('wikelo_reward_restarted', {
			rewardId: reward.id,
			rewardName: getText(reward.name),
			newCompletionCount: wikeloStore.getCompletionCount(reward.id)
		});
	}

	const isFavorite = $derived(wikeloStore.isFavoriteReward(reward.id));

	async function handleToggleFavorite() {
		if (!wikeloStore.currentUser) {
			onLoginRequired?.();
			return;
		}
		await wikeloStore.toggleFavoriteReward(reward.id);
		captureEvent('wikelo_favorite_toggled', {
			rewardId: reward.id,
			rewardName: getText(reward.name),
			isFavorite: !isFavorite
		});
	}

	const isCollapsed = $derived(wikeloStore.isCompactView);
</script>

{#if viewMode === 'list'}
	<!-- Mode Liste -->
	<div
		class="animate-fade-in group relative overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-xl
			{isCompleted ? 'border-green-400 shadow-green-400/50' : 'border-white/10 hover:border-cyan-400/50'}
			bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl"
	>
		<!-- Rarity top border -->
		<div
			class="absolute top-0 right-0 left-0 h-1 bg-linear-to-r {rarityColors[
				reward.rarity
			]} opacity-0 transition-opacity group-hover:opacity-100"
		></div>

		<div class="absolute top-2 right-2 z-20">
			<button
				onclick={(e) => {
					e.stopPropagation();
					handleToggleFavorite();
				}}
				class="group/fav rounded-full bg-slate-900/50 p-2 backdrop-blur-sm transition-all hover:bg-pink-500/10 hover:scale-110"
				title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
			>
				<span class="text-xl transition-transform duration-300 group-hover/fav:scale-125 {isFavorite ? 'text-pink-500' : 'text-gray-400 group-hover/fav:text-pink-400'}">
					{isFavorite ? '❤️' : '🤍'}
				</span>
			</button>
		</div>

		<div class="flex gap-4 p-4">
			<!-- Image à gauche -->
			<div class="shrink-0">
				<div class="group relative">
					<!-- Base shadow layers -->
					<div class="absolute inset-0 bg-cyan-400/10 blur-md"></div>
					<div class="absolute inset-0 bg-purple-500/5 blur-lg"></div>

					<!-- Image compacte pour le mode liste -->
					<div
						class="relative flex items-center justify-center"
						style="width: 140px; height: 110px;"
					>
						<div class="burned-image-container">
							<ImageWithFallback
								src={reward.image}
								alt={`${getText(reward.name)} - ${getText(reward.type)} ${rarityLabels[reward.rarity]}`}
								itemName={getText(reward.name)}
								class="burned-image-edges h-full w-full object-cover"
								width={140}
								height={110}
								{priority}
							/>
						</div>
					</div>
				</div>
			</div>

			<!-- Contenu principal -->
			<div class="min-w-0 flex-1">
				<!-- Badge de rareté au-dessus du titre -->
				<div class="mb-2">
					<span class={getRarityBadgeClass(reward.rarity)}>
						{rarityLabels[reward.rarity]}
					</span>
				</div>

				<!-- Titre -->
				<div class="mb-2">
					<h3
						class="font-orbitron text-lg font-bold tracking-wide text-yellow-400 uppercase"
					>
						{getText(reward.name)}
					</h3>
					{#if reward.version}
						<span
							class="mt-1 inline-block rounded border border-cyan-400/30 bg-slate-700 px-2 py-0.5 text-xs font-bold text-cyan-300"
						>
							v{reward.version}
						</span>
					{/if}
				</div>

				<p class="mb-1 text-sm font-semibold tracking-wider text-cyan-400 uppercase">
					{getText(reward.type)}
				</p>

				{#if !reward.notReleased && reward.missionName}
					<p class="mb-2 text-xs text-gray-500 italic">
						📋 {getText(reward.missionName)}
					</p>
				{/if}

				{#if !reward.notReleased}
					<!-- Description removed -->

					{#if !isCollapsed && reward.reputationRequirements && reward.reputationRequirements.length > 0}
						<div class="mt-2 rounded-lg border border-orange-500/30 bg-orange-500/10 p-2">
							<h5
								class="font-orbitron mb-1 text-xs font-bold tracking-wide text-orange-400 uppercase"
							>
								⭐ Réputation Requise
							</h5>
							{#each reward.reputationRequirements as repReq}
								<div class="flex items-center justify-between text-xs">
									<span class="font-semibold text-orange-300"
										>{getText(repReq.reputation_name)}</span
									>
									<span class="font-orbitron font-bold text-orange-400"
										>Niveau {repReq.required_level}</span
									>
								</div>
							{/each}
						</div>
					{/if}
				{/if}

				{#if reward.notReleased}
					<!-- Affichage pour récompense non implémentée -->
					<div class="mb-3 rounded-lg border border-orange-500/30 bg-orange-500/10 p-3">
						<div class="mb-2 flex items-center gap-2">
							<span class="text-lg text-orange-400">🚧</span>
							<span
								class="font-orbitron text-sm font-bold tracking-wider text-orange-400 uppercase"
							>
								{t.comingSoon}
							</span>
						</div>
						<p class="text-xs leading-relaxed text-orange-300">
							{t.notReleasedMessage}
						</p>
					</div>
				{:else}
					<!-- Ingrédients en flex wrap (seulement si non-collapsed) -->
					{#if !isCollapsed}
						<div class="mb-3">
							<h4 class="font-orbitron mb-2 text-xs font-bold tracking-wider text-cyan-400 uppercase">
								{t.requiredIngredients}
							</h4>

							<div class="flex flex-wrap gap-2">
								{#each reward.requirements as requirement}
									{@const ingredient = wikeloStore.getIngredient(requirement.id)}
									{@const isObtained = wikeloStore.currentUser
										? wikeloStore.isRequirementObtained(reward.id, requirement.id)
										: false}
									{@const availableQuantity = wikeloStore.inventory[requirement.id] ?? 0}

									<label
										class="group/ingredient relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-lg border px-3 py-1.5 text-sm transition-all hover:bg-white/10
											{isObtained ? 'border-green-500/30 bg-green-500/10' : 'border-white/10 bg-white/5'}"
									>
										<input
											type="checkbox"
											checked={isObtained}
											onchange={(e) => handleCheckboxClick(e, requirement.id)}
											class="checkbox-custom scale-75"
										/>

										<div
											class="flex items-center gap-1 {isObtained ? 'line-through opacity-60' : ''}"
										>
											<span class="text-xs font-medium text-white">
												📦 {getText(requirement.name)}
											</span>
											<span class="font-orbitron text-xs font-bold text-yellow-400">
												x{requirement.quantity}
											</span>
										</div>

										{#if availableQuantity > 0 && !isObtained}
											<span
												class="text-xs font-semibold {availableQuantity >= requirement.quantity
													? 'text-cyan-400'
													: 'text-orange-400'}"
											>
												{#if availableQuantity < requirement.quantity}
													⚠️ {availableQuantity}/{requirement.quantity}
												{:else}
													✓ {availableQuantity}
												{/if}
											</span>
										{/if}

										<!-- Bouton détails compact -->
										<button
											onclick={(e) => {
												e.stopPropagation();
												if (ingredient) {
													wikeloStore.openIngredientDialog(ingredient);
													captureEvent('wikelo_ingredient_details_clicked', {
														ingredientId: ingredient.id,
														ingredientName: getText(ingredient.name),
														fromReward: reward.id,
														fromRewardName: getText(reward.name)
													});
												}
											}}
											class="details-button group/details flex shrink-0 cursor-pointer items-center gap-1 rounded border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 transition-all hover:border-cyan-400/50 hover:bg-cyan-400/20"
											title={t.detailsTitle}
										>
											<span class="text-xs font-semibold tracking-wide text-cyan-400 uppercase"
												>{t.details}</span
											>
											<span
												class="text-xs text-cyan-400 transition-transform group-hover/details:translate-x-0.5"
												>→</span
											>
										</button>
									</label>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Progress Bar compact (toujours visible) -->
					<div class="flex items-center gap-3">
						<div class="flex-1">
							<div class="mb-1 flex justify-between text-xs text-gray-400">
								<span>{t.progression}</span>
								<div class="flex items-center gap-2">
									<span>{progress.obtained}/{progress.total} ({progress.percentage}%)</span>
									{#if completionCount > 0}
										<span class="font-orbitron font-bold text-green-400">
											✓ {completionCount}x
										</span>
									{/if}
								</div>
							</div>
							<div class="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
								<div
									class="h-full rounded-full bg-linear-to-r from-green-500 to-cyan-400 transition-all duration-500"
									style="width: {progress.percentage}%"
								></div>
							</div>
						</div>

						{#if reward.favorCost}
							<div
								class="flex shrink-0 items-center gap-1 rounded border border-white/10 bg-white/5 px-2 py-1"
							>
								<span class="text-sm">💎</span>
								<span class="font-orbitron text-xs font-bold text-yellow-400"
									>{reward.favorCost}</span
								>
							</div>
						{/if}

						{#if reward.hasLoadout && reward.components && reward.components.length > 0}
							<button
								onclick={() => {
									wikeloStore.openShipDialog(reward);
									captureEvent('wikelo_loadout_clicked', {
										rewardId: reward.id,
										rewardName: getText(reward.name),
										rewardType: getText(reward.type)
									});
								}}
								class="shrink-0 rounded border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 transition-all hover:border-cyan-400/50 hover:bg-cyan-400/20"
								title={t.viewLoadout}
							>
								<span class="text-sm text-cyan-400">🔧</span>
							</button>
						{/if}

						<button
							onclick={() => (isSuggestionDialogOpen = true)}
							class="shrink-0 rounded border border-purple-400/30 bg-purple-500/10 px-2 py-1 transition-all hover:border-purple-400/50 hover:bg-purple-500/20"
							title={t.suggest}
						>
							<span class="text-sm text-purple-400">💡</span>
						</button>

						{#if isCompleted}
							<button
								onclick={handleResetReward}
								class="group/restart shrink-0 rounded border border-green-500/30 bg-green-500/10 px-2 py-1 transition-all hover:border-green-500/50 hover:bg-green-500/20"
								title={t.restartTooltip}
							>
								<span
									class="inline-block text-sm text-green-400 transition-transform duration-300 group-hover/restart:rotate-180"
									>↻</span
								>
							</button>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
{:else}
	<!-- Mode Grille (existant) -->
	<div
		class="animate-fade-in group relative overflow-hidden rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
			{isCompleted ? 'border-green-400 shadow-green-400/50' : 'border-white/10 hover:border-cyan-400/50'}
			bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl"
	>
		<!-- Rarity top border -->
		<div
			class="absolute top-0 right-0 left-0 h-1 bg-linear-to-r {rarityColors[
				reward.rarity
			]} opacity-0 transition-opacity group-hover:opacity-100"
		></div>

		<!-- Header -->
		<div class="border-b border-white/10 p-6 relative">
			<div class="absolute top-4 right-4 z-20">
				<button
					onclick={(e) => {
						e.stopPropagation();
						handleToggleFavorite();
					}}
					class="group/fav rounded-full bg-slate-900/50 p-2 backdrop-blur-sm transition-all hover:bg-pink-500/10 hover:scale-110"
					title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
				>
					<span class="text-xl transition-transform duration-300 group-hover/fav:scale-125 {isFavorite ? 'text-pink-500' : 'text-gray-400 group-hover/fav:text-pink-400'}">
						{isFavorite ? '❤️' : '🤍'}
					</span>
				</button>
			</div>

			<!-- Image with glitch effect -->
			<div class="mb-4 flex justify-center">
				<div class="group relative">
					<!-- Glitch layers (hover only) -->
					<div
						class="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
					>
						<div class="animate-glitch-1 absolute inset-0 bg-cyan-400/20 blur-sm"></div>
						<div class="animate-glitch-2 absolute inset-0 bg-purple-500/20 blur-sm"></div>
					</div>

					<!-- Base shadow layers (always visible) -->
					<div class="absolute inset-0 bg-cyan-400/10 blur-md"></div>
					<div class="absolute inset-0 bg-purple-500/5 blur-lg"></div>

					<!-- Image avec bordure et effet de bords brûlés -->
					<div
						class="relative flex items-center justify-center"
						style="width: 260px; height: 230px;"
					>
						<div class="burned-image-container">
							<ImageWithFallback
								src={reward.image}
								alt={`${getText(reward.name)} - ${getText(reward.type)} ${rarityLabels[reward.rarity]} - Star Citizen Wikelo Emporium ${getText(reward.description)}`}
								itemName={getText(reward.name)}
								class="burned-image-edges reward-image-size"
								width={260}
								height={230}
								{priority}
							/>
						</div>
					</div>
				</div>
			</div>

			<div class="mb-3 flex items-start justify-between">
				<div class="flex-1">
					<h3 class="font-orbitron text-xl font-bold tracking-wide text-yellow-400 uppercase">
						{getText(reward.name)}
					</h3>
					{#if reward.version}
						<span
							class="mt-1 inline-block rounded border border-cyan-400/30 bg-slate-700 px-2 py-0.5 text-xs font-bold text-cyan-300"
						>
							v{reward.version}
						</span>
					{/if}
				</div>
				<span class={getRarityBadgeClass(reward.rarity)}>
					{rarityLabels[reward.rarity]}
				</span>
			</div>

			{#if getText(reward.type)}
				<p class="mb-2 text-xs font-semibold tracking-wider bg-cyan-400 text-black rounded-xl w-fit px-2 py-1 uppercase">
					{getText(reward.type)}
				</p>
			{/if}

			{#if !reward.notReleased && reward.missionName}
				<p class="mb-2 text-sm text-gray-500">
					📋 {getText(reward.missionName)}
				</p>
			{/if}

			{#if !isCollapsed}
				{#if !reward.notReleased}
					<!-- Description removed -->


					{#if reward.reputationRequirements && reward.reputationRequirements.length > 0}
						<div class="mt-3 rounded-lg border border-orange-500/30 bg-orange-500/10 p-3">
							<h5
								class="font-orbitron mb-2 text-sm font-bold tracking-wide text-orange-400 uppercase"
							>
								⭐ Réputation Requise
							</h5>
							<div class="space-y-1">
								{#each reward.reputationRequirements as repReq}
									<div class="flex items-center justify-between text-sm">
										<span class="font-semibold text-orange-300"
											>{getText(repReq.reputation_name)}</span
										>
										<span class="font-orbitron font-bold text-orange-400"
											>Niveau {repReq.required_level}</span
										>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				{/if}

				{#if reward.notReleased}
					<!-- Affichage pour récompense non implémentée -->
					<div class="mt-4 rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
						<div class="mb-2 flex items-center gap-2">
							<span class="text-xl text-orange-400">🚧</span>
							<span class="font-orbitron text-sm font-bold tracking-wider text-orange-400 uppercase">
								{t.comingSoon}
							</span>
						</div>
						<p class="text-sm leading-relaxed text-orange-300">
							{t.notReleasedMessage}
						</p>
					</div>
				{:else}
				{#if reward.favorCost}
					<div
						class="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2"
					>
						<span class="text-xl">💎</span>
						<span class="font-orbitron font-bold text-yellow-400"
							>{reward.favorCost} Wikelo Favor</span
						>
					</div>
				{/if}

				{#if reward.hasLoadout && reward.components && reward.components.length > 0}
					<button
						onclick={() => {
							wikeloStore.openShipDialog(reward);
							captureEvent('wikelo_loadout_clicked', {
								rewardId: reward.id,
								rewardName: getText(reward.name),
								rewardType: getText(reward.type)
							});
						}}
						class="group/btn mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 transition-all hover:border-cyan-400/50 hover:bg-cyan-400/20"
					>
						<span class="text-xl text-cyan-400">🔧</span>
						<span class="text-sm font-bold tracking-wider text-cyan-400 uppercase">
							{t.viewLoadout}
						</span>
						<span class="text-cyan-400 opacity-0 transition-opacity group-hover/btn:opacity-100">
							→
						</span>
					</button>
				{/if}
			{/if}
			{/if}
		</div>

		<!-- Requirements -->
		{#if !reward.notReleased}
			<div class="p-6">
				{#if !isCollapsed}
					<h4 class="font-orbitron mb-4 text-sm font-bold tracking-wider text-cyan-400 uppercase">
						{t.requiredIngredients}
					</h4>

					<div class="mb-6 space-y-2">
						{#each reward.requirements as requirement}
							{@const ingredient = wikeloStore.getIngredient(requirement.id)}
							{@const isObtained = wikeloStore.currentUser
								? wikeloStore.isRequirementObtained(reward.id, requirement.id)
								: false}
							{@const availableQuantity = wikeloStore.inventory[requirement.id] ?? 0}

							<label
								class="group/ingredient relative flex w-full cursor-pointer items-center gap-3 overflow-hidden rounded-lg border p-3 transition-all hover:bg-white/10
									{isObtained ? 'border-green-500/30 bg-green-500/10' : 'border-white/10 bg-white/5'}"
							>
								<!-- Effet de brillance au hover -->
								<div
									class="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-cyan-400/10 to-transparent transition-transform duration-700 group-hover/ingredient:translate-x-full"
								></div>

								<input
									type="checkbox"
									checked={isObtained}
									onchange={(e) => handleCheckboxClick(e, requirement.id)}
									class="checkbox-custom"
								/>

								<div class="flex-1 {isObtained ? 'line-through opacity-60' : ''}">
									<div class="flex flex-col gap-1">
										<div>
											<span class="font-semibold text-white">
												📦 {getText(requirement.name)}
											</span>
											<span class="font-orbitron ml-2 font-bold text-yellow-400">
												x{requirement.quantity}
											</span>
										</div>
										{#if availableQuantity > 0 && !isObtained}
											<span
												class="text-xs font-semibold {availableQuantity >= requirement.quantity
													? 'text-cyan-400'
													: 'text-orange-400'} flex items-center gap-1"
											>
												{#if availableQuantity < requirement.quantity}
													<span class="text-orange-400">⚠️</span>
													{availableQuantity}/{requirement.quantity}
													{t.required}
												{:else}
													{availableQuantity} {t.available}
												{/if}
											</span>
										{/if}
									</div>
								</div>

								<!-- Bouton détails -->
								<button
									onclick={(e) => {
										e.stopPropagation();
										if (ingredient) {
											wikeloStore.openIngredientDialog(ingredient);
											captureEvent('wikelo_ingredient_details_clicked', {
												ingredientId: ingredient.id,
												ingredientName: getText(ingredient.name),
												fromReward: reward.id,
												fromRewardName: getText(reward.name)
											});
										}
									}}
									class="group/details relative z-10 flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md border border-cyan-400/30 bg-cyan-400/10 px-2 py-1 transition-all hover:border-cyan-400/50 hover:bg-cyan-400/20"
									title={t.detailsTitle}
								>
									<span class="text-xs font-semibold tracking-wide text-cyan-400 uppercase"
										>{t.details}</span
									>
									<span
										class="text-xs text-cyan-400 transition-transform group-hover/details:translate-x-0.5"
										>→</span
									>
								</button>
							</label>
						{/each}
					</div>
				{/if}

				<!-- Progress Bar (toujours visible) -->
				<div class="{isCollapsed ? '' : 'border-t border-white/10 pt-4'}">
					<div class="mb-2 flex justify-between text-sm text-gray-400">
						<span>{t.progression}</span>
						<div class="flex items-center gap-2">
							<span>{progress.obtained}/{progress.total} ({progress.percentage}%)</span>
							{#if completionCount > 0}
								<span class="font-orbitron text-base font-bold text-green-400">
									✓ {completionCount}x
								</span>
							{/if}
						</div>
					</div>

					<div class="h-2 w-full overflow-hidden rounded-full bg-white/10">
						<div
							class="h-full rounded-full bg-linear-to-r from-green-500 to-cyan-400 shadow-lg shadow-green-500/50 transition-all duration-500"
							style="width: {progress.percentage}%"
						></div>
					</div>

					{#if !isCollapsed}
						<div class="mt-3 flex gap-2">
							<button
								onclick={() => (isSuggestionDialogOpen = true)}
								class="flex flex-1 items-center justify-center gap-2 rounded-lg border border-purple-400/30 bg-purple-500/10 px-4 py-2 transition-all hover:border-purple-400/50 hover:bg-purple-500/20"
							>
								<span class="text-lg text-purple-400">💡</span>
								<span class="text-sm font-bold tracking-wider text-purple-400 uppercase">
									{t.suggest}
								</span>
							</button>

							{#if isCompleted}
								<button
									onclick={handleResetReward}
									class="group/restart flex flex-1 items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 transition-all hover:border-green-500/50 hover:bg-green-500/20"
									title={t.restartTooltip}
								>
									<span
										class="inline-block text-xl text-green-400 transition-transform duration-300 group-hover/restart:rotate-180"
										>↻</span
									>
									<span class="text-sm font-bold tracking-wider text-green-400 uppercase">
										{t.restartReward}
									</span>
								</button>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		{/if}

	</div>
{/if}

<!-- Suggestion Dialog -->
<SuggestionDialog
	bind:isOpen={isSuggestionDialogOpen}
	itemType="reward"
	itemId={reward.id}
	itemName={getText(reward.name)}
	lang={wikeloStore.currentLang}
	onClose={() => (isSuggestionDialogOpen = false)}
/>
