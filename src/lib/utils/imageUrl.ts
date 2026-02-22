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
