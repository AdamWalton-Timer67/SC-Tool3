export function normalizeImageUrl(url: unknown): string {
	if (typeof url !== 'string') return '';
	const trimmed = url.trim();
	if (!trimmed) return '';
	if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
		return trimmed;
	}
	if (trimmed.startsWith('//')) return `https:${trimmed}`;
	if (trimmed.startsWith('/')) return trimmed;
	return `/${trimmed}`;
}
