<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import type { ArmorItem, ArmorSlot } from '$lib/types/armor';

	type Props = {
		equippedItems: ArmorItem[];
	};

	let { equippedItems }: Props = $props();

	let container: HTMLDivElement | null = null;
	let renderer: THREE.WebGLRenderer | null = null;
	let scene: THREE.Scene | null = null;
	let camera: THREE.PerspectiveCamera | null = null;
	let animationFrame = 0;

	const slotMeshes = new Map<ArmorSlot, THREE.Mesh>();

	const SLOT_COLORS: Record<ArmorSlot, string> = {
		undersuit: '#475569',
		helmet: '#38bdf8',
		torso: '#a78bfa',
		arms: '#f59e0b',
		legs: '#22c55e',
		backpack: '#ef4444'
	};

	function clearSlotMeshes() {
		for (const mesh of slotMeshes.values()) {
			scene?.remove(mesh);
			mesh.geometry.dispose();
			if (Array.isArray(mesh.material)) mesh.material.forEach((m: THREE.Material) => m.dispose());
			else mesh.material.dispose();
		}
		slotMeshes.clear();
	}

	function addSlotMesh(slot: ArmorSlot) {
		if (!scene) return;

		let geometry: THREE.BufferGeometry;
		let position = new THREE.Vector3(0, 0, 0);
		let scale = new THREE.Vector3(1, 1, 1);

		switch (slot) {
			case 'helmet':
				geometry = new THREE.SphereGeometry(0.28, 24, 24);
				position.set(0, 1.65, 0);
				break;
			case 'torso':
				geometry = new THREE.BoxGeometry(0.8, 0.9, 0.4);
				position.set(0, 0.95, 0);
				break;
			case 'arms':
				geometry = new THREE.BoxGeometry(1.35, 0.28, 0.28);
				position.set(0, 1.0, 0);
				break;
			case 'legs':
				geometry = new THREE.BoxGeometry(0.55, 1.0, 0.32);
				position.set(0, -0.1, 0);
				break;
			case 'backpack':
				geometry = new THREE.BoxGeometry(0.5, 0.7, 0.3);
				position.set(0, 0.95, -0.33);
				break;
			case 'undersuit':
			default:
				geometry = new THREE.CapsuleGeometry(0.42, 1.8, 8, 16);
				position.set(0, 0.6, 0);
				scale.set(1, 1, 0.9);
				break;
		}

		const material = new THREE.MeshStandardMaterial({
			color: SLOT_COLORS[slot],
			metalness: 0.35,
			roughness: 0.55,
			transparent: slot === 'undersuit',
			opacity: slot === 'undersuit' ? 0.45 : 0.95
		});

		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.copy(position);
		mesh.scale.copy(scale);
		scene.add(mesh);
		slotMeshes.set(slot, mesh);
	}

	function rebuildEquippedMeshes() {
		clearSlotMeshes();
		for (const item of equippedItems) addSlotMesh(item.slot);
	}

	function initScene() {
		if (!container) return;

		scene = new THREE.Scene();
		scene.background = new THREE.Color('#020617');

		camera = new THREE.PerspectiveCamera(
			45,
			container.clientWidth / container.clientHeight,
			0.1,
			100
		);
		camera.position.set(0, 1.2, 4.2);

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(container.clientWidth, container.clientHeight);
		container.appendChild(renderer.domElement);

		const hemi = new THREE.HemisphereLight('#ffffff', '#334155', 1.7);
		scene.add(hemi);

		const dir = new THREE.DirectionalLight('#ffffff', 2.2);
		dir.position.set(4, 6, 5);
		scene.add(dir);

		const floor = new THREE.Mesh(
			new THREE.CircleGeometry(3, 48),
			new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 1 })
		);
		floor.rotation.x = -Math.PI / 2;
		floor.position.y = -1.05;
		scene.add(floor);

		const mannequin = new THREE.Mesh(
			new THREE.CapsuleGeometry(0.35, 1.7, 8, 16),
			new THREE.MeshStandardMaterial({
				color: '#cbd5e1',
				metalness: 0.1,
				roughness: 0.9,
				transparent: true,
				opacity: 0.25
			})
		);
		mannequin.position.set(0, 0.55, 0);
		scene.add(mannequin);

		rebuildEquippedMeshes();

		const animate = () => {
			animationFrame = requestAnimationFrame(animate);
			if (scene) scene.rotation.y += 0.0035;
			renderer?.render(scene as THREE.Scene, camera as THREE.PerspectiveCamera);
		};

		animate();
	}

	function handleResize() {
		if (!container || !camera || !renderer) return;
		camera.aspect = container.clientWidth / container.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(container.clientWidth, container.clientHeight);
	}

	onMount(() => {
		initScene();
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
			cancelAnimationFrame(animationFrame);
			clearSlotMeshes();
			renderer?.dispose();
			if (renderer?.domElement?.parentNode)
				renderer.domElement.parentNode.removeChild(renderer.domElement);
		};
	});

	$effect(() => {
		equippedItems;
		if (scene) rebuildEquippedMeshes();
	});
</script>

<div class="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80">
	<div bind:this={container} class="h-[520px] w-full"></div>
</div>
