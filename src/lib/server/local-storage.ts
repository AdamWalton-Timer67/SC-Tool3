import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const STATIC_DIR = path.resolve('static');
const UPLOAD_BASE_DIR = path.join(STATIC_DIR, 'uploads');

const MIME_TO_EXT: Record<string, string> = {
	'image/jpeg': 'jpg',
	'image/png': 'png',
	'image/webp': 'webp',
	'image/gif': 'gif',
	'image/svg+xml': 'svg'
};

function sanitizeFolder(folder: string): string {
	return folder
		.split('/')
		.map((part) => part.replace(/[^a-zA-Z0-9_-]/g, ''))
		.filter(Boolean)
		.join('/');
}

function extensionFor(file: File): string {
	const mimeExt = MIME_TO_EXT[file.type];
	if (mimeExt) return mimeExt;

	const nameParts = file.name.split('.');
	if (nameParts.length > 1) {
		const ext = nameParts[nameParts.length - 1].toLowerCase().replace(/[^a-z0-9]/g, '');
		if (ext) return ext;
	}

	return 'bin';
}

export async function uploadToLocalStorage(file: File, folder = 'images'): Promise<string> {
	const safeFolder = sanitizeFolder(folder);
	const targetDir = path.join(UPLOAD_BASE_DIR, safeFolder);
	await fs.mkdir(targetDir, { recursive: true });

	const fileName = `${Date.now()}-${crypto.randomUUID()}.${extensionFor(file)}`;
	const fullPath = path.join(targetDir, fileName);

	const bytes = await file.arrayBuffer();
	await fs.writeFile(fullPath, Buffer.from(bytes));

	return `/uploads/${safeFolder}/${fileName}`;
}

export async function uploadLocalVariants(
	files: { thumbnail: File; medium: File; original: File },
	folder = 'images'
): Promise<{ thumbnail: string; medium: string; original: string }> {
	const thumbnail = await uploadToLocalStorage(files.thumbnail, `${folder}/thumbnails`);
	const medium = await uploadToLocalStorage(files.medium, `${folder}/medium`);
	const original = await uploadToLocalStorage(files.original, `${folder}/original`);

	return { thumbnail, medium, original };
}
