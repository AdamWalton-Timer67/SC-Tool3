<script lang="ts">
	import { authStore } from '$lib/stores/auth.svelte';
	import { wikeloStore } from '$lib/stores/wikelo.svelte';
	import { env } from '$env/dynamic/public';

	let mode: 'signin' | 'signup' = $state('signin');
	let email = $state('');
	let password = $state('');
	let displayName = $state('');
	let error = $state('');
	let loading = $state(false);

	// Check which OAuth providers are enabled
	const enableDiscord = env.PUBLIC_ENABLE_DISCORD_AUTH === 'true';
	const enableTwitch = env.PUBLIC_ENABLE_TWITCH_AUTH === 'true';
	const enableGoogle = env.PUBLIC_ENABLE_GOOGLE_AUTH === 'true';
	const hasOAuthProviders = enableDiscord || enableTwitch || enableGoogle;

	const t = $derived(
		wikeloStore.currentLang === 'fr'
			? {
					signIn: 'Connexion',
					signUp: 'Inscription',
					email: 'Email',
					password: 'Mot de passe',
					displayName: 'Nom In-Game',
					emailPlaceholder: 'votre@email.com',
					passwordPlaceholder: '••••••••',
					displayNamePlaceholder: 'Votre nom dans le jeu',
					signInButton: 'Se connecter',
					signUpButton: "S'inscrire",
					loading: 'Chargement...',
					switchToSignUp: "Pas encore de compte ? S'inscrire",
					switchToSignIn: 'Déjà un compte ? Se connecter',
					close: 'Fermer',
					continueWith: 'Continuer avec',
					orContinueWith: 'Ou continuer avec',
					discord: 'Discord',
					twitch: 'Twitch',
					google: 'Google'
				}
			: {
					signIn: 'Sign In',
					signUp: 'Sign Up',
					email: 'Email',
					password: 'Password',
					displayName: 'In-Game Name',
					emailPlaceholder: 'your@email.com',
					passwordPlaceholder: '••••••••',
					displayNamePlaceholder: 'Your in-game name',
					signInButton: 'Sign In',
					signUpButton: 'Sign Up',
					loading: 'Loading...',
					switchToSignUp: "Don't have an account? Sign Up",
					switchToSignIn: 'Already have an account? Sign In',
					close: 'Close',
					continueWith: 'Continue with',
					orContinueWith: 'Or continue with',
					discord: 'Discord',
					twitch: 'Twitch',
					google: 'Google'
				}
	);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		error = '';
		loading = true;

		try {
			if (mode === 'signin') {
				await authStore.signIn(email, password);
			} else {
				await authStore.signUp(email, password, displayName || null);
			}
			email = '';
			password = '';
			displayName = '';
		} catch (err: any) {
			error = err.message;
		} finally {
			loading = false;
		}
	}

	function switchMode() {
		mode = mode === 'signin' ? 'signup' : 'signin';
		error = '';
	}

	function closeDialog() {
		authStore.closeAuthDialog();
		error = '';
		email = '';
		password = '';
		displayName = '';
	}

	async function handleOAuthSignIn(provider: 'discord' | 'twitch' | 'google') {
		error = '';
		loading = true;

		try {
			await authStore.signInWithOAuth(provider);
		} catch (err: any) {
			error = err.message;
			loading = false;
		}
	}
</script>

{#if authStore.showAuthDialog}
	<!-- Space Background overlay -->
	<div
		role="presentation"
		class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/95 p-4 backdrop-blur-sm"
		onclick={(e) => e.target === e.currentTarget && closeDialog()}
		onkeydown={(e) => e.key === 'Escape' && closeDialog()}
	>
		<!-- Stars effect -->
		<div class="absolute inset-0 opacity-30">
			<div class="stars"></div>
			<div class="stars-layer-2"></div>
		</div>

		<!-- Dialog card -->
		<div
			class="relative w-full max-w-md overflow-hidden rounded-xl border-2 border-cyan-400/50 bg-slate-900/90 shadow-2xl shadow-cyan-400/20 backdrop-blur-xl"
		>
			<!-- Animated top border -->
			<div
				class="animate-header-glow absolute top-0 right-0 left-0 h-1 bg-linear-to-r from-cyan-400 via-yellow-400 to-cyan-400"
			></div>

			<!-- Header -->
			<div class="relative border-b border-white/10 p-6">
				<div class="flex items-center justify-between">
					<h2
						class="font-orbitron flex items-center gap-3 text-2xl font-bold tracking-wider text-yellow-400 uppercase"
					>
						<span class="text-3xl">◈</span>
						{mode === 'signin' ? t.signIn : t.signUp}
					</h2>
					<button
						type="button"
						onclick={closeDialog}
						class="rounded-lg border border-white/10 bg-white/5 p-2 text-gray-400 transition-all hover:border-red-400/50 hover:bg-white/10 hover:text-red-400"
						aria-label={t.close}
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
			</div>

			<!-- OAuth Providers -->
			{#if hasOAuthProviders}
				<div class="space-y-3 p-6 pb-4">
					<!-- Discord Button -->
					{#if enableDiscord}
						<button
							type="button"
							onclick={() => handleOAuthSignIn('discord')}
							disabled={loading}
							class="group font-rajdhani relative w-full overflow-hidden rounded-lg border-2 border-[#5865F2]/50 bg-[#5865F2]/10 px-4 py-3 font-bold tracking-wider text-[#5865F2] uppercase transition-all hover:border-[#5865F2] hover:shadow-lg hover:shadow-[#5865F2]/20 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<div
								class="absolute inset-0 bg-[#5865F2]/10 opacity-0 transition-opacity group-hover:opacity-100"
							></div>
							<span class="relative flex items-center justify-center gap-3">
								<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"
									/>
								</svg>
								{t.continueWith}
								{t.discord}
							</span>
						</button>
					{/if}

					<!-- Twitch Button -->
					{#if enableTwitch}
						<button
							type="button"
							onclick={() => handleOAuthSignIn('twitch')}
							disabled={loading}
							class="group font-rajdhani relative w-full overflow-hidden rounded-lg border-2 border-[#9146FF]/50 bg-[#9146FF]/10 px-4 py-3 font-bold tracking-wider text-[#9146FF] uppercase transition-all hover:border-[#9146FF] hover:shadow-lg hover:shadow-[#9146FF]/20 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<div
								class="absolute inset-0 bg-[#9146FF]/10 opacity-0 transition-opacity group-hover:opacity-100"
							></div>
							<span class="relative flex items-center justify-center gap-3">
								<svg class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
									<path
										d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"
									/>
								</svg>
								{t.continueWith}
								{t.twitch}
							</span>
						</button>
					{/if}

					<!-- Google Button -->
					{#if enableGoogle}
						<button
							type="button"
							onclick={() => handleOAuthSignIn('google')}
							disabled={loading}
							class="group font-rajdhani relative w-full overflow-hidden rounded-lg border-2 border-white/20 bg-white/10 px-4 py-3 font-bold tracking-wider text-white uppercase transition-all hover:border-white/40 hover:shadow-lg hover:shadow-white/10 disabled:cursor-not-allowed disabled:opacity-50"
						>
							<div
								class="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100"
							></div>
							<span class="relative flex items-center justify-center gap-3">
								<svg class="h-5 w-5" viewBox="0 0 24 24">
									<path
										fill="#4285F4"
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									/>
									<path
										fill="#34A853"
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									/>
									<path
										fill="#FBBC05"
										d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									/>
									<path
										fill="#EA4335"
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									/>
								</svg>
								{t.continueWith}
								{t.google}
							</span>
						</button>
					{/if}
				</div>

				<!-- Divider -->
				<div class="px-6 pb-4">
					<div class="relative">
						<div class="absolute inset-0 flex items-center">
							<div class="w-full border-t border-white/10"></div>
						</div>
						<div class="relative flex justify-center text-sm">
							<span
								class="font-rajdhani bg-slate-900/90 px-4 tracking-wide text-gray-400 uppercase"
							>
								{t.orContinueWith} Email
							</span>
						</div>
					</div>
				</div>
			{/if}

			<!-- Form -->
			<form onsubmit={handleSubmit} class="px-6 pb-6">
				<div class="mb-4">
					<label
						for="email"
						class="font-rajdhani mb-2 block text-sm font-semibold tracking-wide text-cyan-400 uppercase"
					>
						{t.email}
					</label>
					<input
						id="email"
						type="email"
						bind:value={email}
						required
						class="font-rajdhani w-full rounded-lg border-2 border-white/10 bg-slate-800/50 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none"
						placeholder={t.emailPlaceholder}
					/>
				</div>

				<div class="mb-4">
					<label
						for="password"
						class="font-rajdhani mb-2 block text-sm font-semibold tracking-wide text-cyan-400 uppercase"
					>
						{t.password}
					</label>
					<input
						id="password"
						type="password"
						bind:value={password}
						required
						minlength="6"
						class="font-rajdhani w-full rounded-lg border-2 border-white/10 bg-slate-800/50 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/50 focus:outline-none"
						placeholder={t.passwordPlaceholder}
					/>
				</div>

				<!-- Display Name (only for signup) -->
				{#if mode === 'signup'}
					<div class="mb-6">
						<label
							for="displayName"
							class="font-rajdhani mb-2 block text-sm font-semibold tracking-wide text-yellow-400 uppercase"
						>
							{t.displayName}
							<span class="text-xs text-gray-400 normal-case">(optionnel)</span>
						</label>
						<input
							id="displayName"
							type="text"
							bind:value={displayName}
							maxlength="50"
							class="font-rajdhani w-full rounded-lg border-2 border-white/10 bg-slate-800/50 px-4 py-3 text-white placeholder-gray-500 backdrop-blur-sm transition-all focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/50 focus:outline-none"
							placeholder={t.displayNamePlaceholder}
						/>
						<p class="mt-1 text-xs text-gray-500">
							{wikeloStore.currentLang === 'fr' ? 'Vous pourrez le modifier plus tard dans votre compte' : 'You can change it later in your account'}
						</p>
					</div>
				{:else}
					<div class="mb-6"></div>
				{/if}

				{#if error}
					<div
						class="font-rajdhani mb-4 rounded-lg border border-red-400/50 bg-red-500/20 p-3 text-sm text-red-300"
					>
						⚠️ {error}
					</div>
				{/if}

				<button
					type="submit"
					disabled={loading}
					class="group font-orbitron relative mb-4 w-full overflow-hidden rounded-lg border-2 border-yellow-400/50 bg-slate-800/50 px-6 py-3 font-bold tracking-wider text-yellow-400 uppercase transition-all hover:border-yellow-400 hover:shadow-lg hover:shadow-yellow-400/20 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<div
						class="absolute inset-0 bg-linear-to-r from-cyan-400/0 via-yellow-400/20 to-cyan-400/0 opacity-0 transition-opacity group-hover:opacity-100"
					></div>
					<span class="relative">
						{loading ? t.loading : mode === 'signin' ? t.signInButton : t.signUpButton}
					</span>
				</button>

				<button
					type="button"
					onclick={switchMode}
					class="font-rajdhani w-full text-sm text-gray-400 transition-colors hover:text-cyan-400"
				>
					{mode === 'signin' ? t.switchToSignUp : t.switchToSignIn}
				</button>
			</form>
		</div>
	</div>
{/if}
