#!/usr/bin/env node
import fs from 'node:fs/promises';
import https from 'node:https';

const SHEET_ID = process.env.SHEET_ID || '1ji0q_pp6iW35RG1YyFEsv-lsmZOaCStJXGdIEdLLwhM';
const DEFAULT_GID = process.env.SHEET_DEFAULT_GID || '265426743';
const MANUAL_GIDS = (process.env.SHEET_GIDS || '')
	.split(',')
	.map((v) => v.trim())
	.filter(Boolean);

const HTML_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/htmlview`;
const OUTPUT_PATH = 'src/lib/mock-db.generated.json';

function parseGvizPayload(raw) {
	const match = raw.match(/setResponse\((.*)\);?\s*$/s);
	if (!match) throw new Error('Unable to parse GViz response payload.');
	return JSON.parse(match[1]);
}

function extractSheetRefsFromHtml(html) {
	const byMenu = Array.from(html.matchAll(/<a[^>]+href="([^"]*gid=(\d+)[^"]*)"[^>]*>(.*?)<\/a>/gis)).map(
		(m) => ({ gid: m[2], name: m[3].replace(/<[^>]+>/g, '').trim() || `gid_${m[2]}` })
	);
	if (byMenu.length > 0) {
		const dedup = new Map();
		for (const item of byMenu) if (!dedup.has(item.gid)) dedup.set(item.gid, item);
		return [...dedup.values()];
	}

	const gids = [...new Set(Array.from(html.matchAll(/gid=(\d+)/g), (m) => m[1]))];
	if (gids.length > 0) return gids.map((gid) => ({ gid, name: `gid_${gid}` }));

	return [];
}

function dateValue(cell) {
	if (!cell) return null;
	if (cell.f && /^\d{4}-\d{2}-\d{2}/.test(cell.f)) return cell.f.slice(0, 10);
	if (typeof cell.v === 'string') {
		const m = cell.v.match(/(\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4})/);
		if (m) return m[1];
	}
	return null;
}

function normalizeKey(value) {
	return String(value ?? '')
		.toLowerCase()
		.normalize('NFKD')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}

function sheetTableToRows(payload) {
	const cols = payload?.table?.cols ?? [];
	const rows = payload?.table?.rows ?? [];
	const headers = cols.map((c, i) => (c?.label?.trim() ? c.label.trim() : `col_${i + 1}`));
	return rows.map((r) => {
		const out = {};
		(r.c ?? []).forEach((cell, i) => {
			out[headers[i]] = cell?.f ?? cell?.v ?? null;
		});
		return out;
	});
}

function fetchText(url, timeoutMs = 30000) {
	return new Promise((resolve, reject) => {
		const req = https.get(
			url,
			{
				headers: {
					'user-agent': 'Mozilla/5.0 (compatible; SC-Tool3-Rebuild/1.0)'
				}
			},
			(res) => {
				if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
					res.resume();
					resolve(fetchText(res.headers.location, timeoutMs));
					return;
				}
				if (!res.statusCode || res.statusCode < 200 || res.statusCode >= 300) {
					reject(new Error(`HTTP ${res.statusCode ?? 'unknown'} for ${url}`));
					res.resume();
					return;
				}
				let data = '';
				res.setEncoding('utf8');
				res.on('data', (chunk) => (data += chunk));
				res.on('end', () => resolve(data));
			}
		);
		req.setTimeout(timeoutMs, () => req.destroy(new Error(`Timeout after ${timeoutMs}ms: ${url}`)));
		req.on('error', reject);
	});
}

async function fetchSheetByGid(gid) {
	const gvizUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?gid=${encodeURIComponent(gid)}&tqx=out:json`;
	const payload = parseGvizPayload(await fetchText(gvizUrl));
	return sheetTableToRows(payload);
}

async function main() {
	console.log('Downloading sheet index...');

	let sheetRefs = [];

	if (MANUAL_GIDS.length > 0) {
		sheetRefs = MANUAL_GIDS.map((gid) => ({ gid, name: `gid_${gid}` }));
		console.log(`Using SHEET_GIDS override with ${sheetRefs.length} gid(s).`);
	} else {
		try {
			const html = await fetchText(HTML_URL);
			sheetRefs = extractSheetRefsFromHtml(html);
		} catch (error) {
			console.warn(`Could not fetch/parse htmlview index: ${error.message}`);
		}
	}

	if (sheetRefs.length === 0) {
		console.warn(`Falling back to default gid ${DEFAULT_GID}.`);
		sheetRefs = [{ gid: DEFAULT_GID, name: `gid_${DEFAULT_GID}` }];
	}

	console.log(`Found ${sheetRefs.length} sheet reference(s). Rebuilding from oldest entries to latest updates...`);

	const rawSheets = {};
	const mergedByKey = new Map();
	const events = [];

	for (const { gid, name } of sheetRefs) {
		let rows = [];
		try {
			rows = await fetchSheetByGid(gid);
		} catch (error) {
			console.warn(`Skipping gid ${gid} (${name}): ${error.message}`);
			continue;
		}

		rawSheets[name] = rows;

		for (const row of rows) {
			const values = Object.values(row);
			const firstText = values.find((v) => typeof v === 'string' && v.trim());
			if (!firstText) continue;

			const key = normalizeKey(row.id ?? row.ID ?? row.Name ?? row.name ?? firstText);
			const parsedDate = values.map((v) => dateValue(typeof v === 'object' ? v : { v })).find(Boolean);
			events.push({ key, sheetName: name, parsedDate, row });
		}
	}

	if (events.length === 0) {
		throw new Error('No rows extracted from available sheet references. Ensure the sheet is public and try SHEET_GIDS override.');
	}

	events.sort((a, b) => {
		if (!a.parsedDate && !b.parsedDate) return 0;
		if (!a.parsedDate) return -1;
		if (!b.parsedDate) return 1;
		return new Date(a.parsedDate) - new Date(b.parsedDate);
	});

	for (const event of events) {
		const existing = mergedByKey.get(event.key) ?? {};
		mergedByKey.set(event.key, {
			...existing,
			...event.row,
			__source_sheet: event.sheetName,
			__last_update: event.parsedDate ?? existing.__last_update ?? null
		});
	}

	const output = {
		meta: {
			sheetId: SHEET_ID,
			generatedAt: new Date().toISOString(),
			sheetRefCount: sheetRefs.length,
			rowEventCount: events.length,
			rebuildMode: 'oldest-first-then-update'
		},
		tabs: sheetRefs,
		rawSheets,
		mergedEntries: Array.from(mergedByKey.values())
	};

	await fs.writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf8');
	console.log(`Wrote ${OUTPUT_PATH}`);
}

main().catch((error) => {
	console.error('Failed to rebuild mock database from Google Sheet:', error.message);
	process.exitCode = 1;
});
