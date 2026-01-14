<script lang="ts">
	const messages = {
		fr: 'L\'application coûte actuellement trop cher à maintenir (Supabase). La base de données est désactivée jusqu\'à ce que le développeur ait le temps de migrer vers un hébergement moins onéreux.',
		en: 'The application is currently too expensive to maintain (Supabase). The database is disabled until the developer has time to migrate to a cheaper hosting solution.'
	};
</script>

<div class="maintenance-banner">
	<div class="banner-content">
		<svg
			class="warning-icon"
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
			/>
		</svg>
		<div class="messages">
			<p class="message"><strong>🇫🇷</strong> {messages.fr}</p>
			<p class="message"><strong>🇬🇧</strong> {messages.en}</p>
		</div>
	</div>
</div>

<style>
	.maintenance-banner {
		position: sticky;
		top: 0;
		z-index: 9999;
		background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
		color: white;
		padding: 1rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
	}

	.banner-content {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		align-items: flex-start;
		gap: 1rem;
	}

	.warning-icon {
		width: 24px;
		height: 24px;
		flex-shrink: 0;
		margin-top: 0.2rem;
	}

	.messages {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.message {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.5;
	}

	.message strong {
		margin-right: 0.5rem;
	}

	@media (max-width: 640px) {
		.maintenance-banner {
			padding: 0.75rem;
		}

		.message {
			font-size: 0.875rem;
		}

		.banner-content {
			gap: 0.75rem;
		}
	}
</style>
