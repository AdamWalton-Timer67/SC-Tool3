const DEFAULT_IMAGE_URL = '/images/wikelo/wikelo_favor.webp';

function sanitizePart(value: string): string {
	return value
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/&/g, ' and ')
		.replace(/[^a-z0-9]+/g, '_')
		.replace(/^_+|_+$/g, '')
		.replace(/_+/g, '_');
}

export function normalizeImageUrl(url: unknown): string {
	if (typeof url !== 'string') return '';
	const trimmed = url.trim();
	if (!trimmed) return '';
	if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
		return encodeURI(trimmed);
	}
	if (trimmed.startsWith('//')) return encodeURI(`https:${trimmed}`);
	if (trimmed.startsWith('/')) return encodeURI(trimmed);
	return encodeURI(`/${trimmed}`);
}

export function getDefaultImageUrl(): string {
	return DEFAULT_IMAGE_URL;
}

export function getRewardImageCandidates(name: string, explicitUrl?: string | null): string[] {
	const candidates = new Set<string>();
	const normalizedExplicit = normalizeImageUrl(explicitUrl);
	if (normalizedExplicit) {
		candidates.add(normalizedExplicit);
	}

	const sanitized = sanitizePart(name || '');
	if (sanitized) {
		const base = `/images/wikelo/${sanitized}`;
		candidates.add(`${base}.webp`);
		candidates.add(`${base}.png`);
		candidates.add(`${base}.jpg`);
		candidates.add(`${base}.jpeg`);
	}

	candidates.add(DEFAULT_IMAGE_URL);
	return Array.from(candidates);
}
