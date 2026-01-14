<div class="space-background fixed inset-0 -z-10">
	<div class="stars"></div>
	<div class="stars-layer-2"></div>
	<div class="nebula"></div>
</div>

<style>
	.space-background {
		background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
	}

	.stars,
	.stars-layer-2 {
		position: absolute;
		width: 100%;
		height: 100%;
		background: transparent;
	}

	.stars {
		background-image:
			radial-gradient(2px 2px at 20px 30px, #eee, transparent),
			radial-gradient(2px 2px at 40px 70px, #fff, transparent),
			radial-gradient(1px 1px at 90px 40px, #fff, transparent),
			radial-gradient(1px 1px at 160px 120px, #00d9ff, transparent);
		background-size: 200px 200px;
		animation: starsMove 120s linear infinite;
	}

	.stars-layer-2 {
		background-image:
			radial-gradient(1px 1px at 50px 50px, #ddd, transparent),
			radial-gradient(1px 1px at 100px 150px, #eee, transparent),
			radial-gradient(1px 1px at 150px 50px, #f4d03f, transparent);
		background-size: 250px 250px;
		animation: starsMove 200s linear infinite;
	}

	.nebula {
		position: absolute;
		width: 100%;
		height: 100%;
		background:
			radial-gradient(ellipse at 30% 50%, rgba(0, 217, 255, 0.1) 0%, transparent 50%),
			radial-gradient(ellipse at 70% 70%, rgba(212, 175, 55, 0.08) 0%, transparent 50%);
		animation: nebulaPulse 15s ease-in-out infinite;
	}

	@keyframes starsMove {
		from {
			transform: translateY(0);
		}
		to {
			transform: translateY(-200px);
		}
	}

	@keyframes nebulaPulse {
		0%,
		100% {
			opacity: 0.6;
		}
		50% {
			opacity: 1;
		}
	}
</style>
