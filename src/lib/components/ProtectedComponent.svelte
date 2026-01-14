<script lang="ts">
	import { authStore } from '$lib/stores/auth.svelte';

	/**
	 * Exemple de composant qui nécessite une authentification
	 * Utilisez ce pattern dans n'importe quel composant de votre app
	 */
</script>

{#if authStore.loading}
	<div class="flex items-center justify-center p-8">
		<div class="text-center">
			<div
				class="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
			></div>
			<p class="text-gray-600">Chargement...</p>
		</div>
	</div>
{:else if authStore.user}
	<!-- Contenu accessible uniquement aux utilisateurs connectés -->
	<div class="rounded-lg border border-green-200 bg-green-50 p-6">
		<h3 class="mb-2 text-lg font-semibold text-green-900">🔒 Contenu protégé</h3>
		<p class="text-green-700">
			Bienvenue <strong>{authStore.user.email}</strong> ! Ce contenu est uniquement visible par les utilisateurs
			connectés.
		</p>
	</div>
{:else}
	<!-- Message pour les utilisateurs non connectés -->
	<div class="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
		<h3 class="mb-2 text-lg font-semibold text-yellow-900">⚠️ Authentification requise</h3>
		<p class="mb-4 text-yellow-700">Vous devez être connecté pour accéder à ce contenu.</p>
		<button
			onclick={() => authStore.openAuthDialog()}
			class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
		>
			Se connecter
		</button>
	</div>
{/if}
