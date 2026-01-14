<script lang="ts">
	interface Props {
		onclick: () => void;
		variant?: 'default' | 'danger';
		icon?: import('svelte').Snippet;
		children?: import('svelte').Snippet;
	}

	let { onclick, variant = 'default', icon, children }: Props = $props();

	const variantClasses = {
		default: 'text-white hover:bg-cyan-500/10 hover:text-cyan-400',
		danger: 'text-red-400 hover:bg-red-500/10'
	};
</script>

<button
	{onclick}
	class="flex w-full items-center gap-2 px-4 py-3 text-left text-sm font-medium transition-colors {variantClasses[variant]}"
>
	{#if icon}
		{@render icon()}
	{/if}
	{#if children}
		{@render children()}
	{/if}
</button>
