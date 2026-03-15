<script lang="ts">
	let { data } = $props();
</script>

<div class="space-y-2">
	{#each data.modules as module}<div class="rounded bg-slate-800 p-3">
			<div class="font-semibold">{module.name} ({module.code})</div>
			<div class="text-xs">
				Category {module.category} • Default active: {module.active ? 'yes' : 'no'}
			</div>
		</div>{/each}
</div>
