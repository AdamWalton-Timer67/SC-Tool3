<script lang="ts">
	let { data } = $props();
</script>

<div class="space-y-2">
	{#each data.lasers as laser}<div class="rounded bg-slate-800 p-3">
			<div class="font-semibold">{laser.name} ({laser.code})</div>
			<div class="text-xs">Size {laser.size} • Slots {laser.slots}</div>
		</div>{/each}
</div>
