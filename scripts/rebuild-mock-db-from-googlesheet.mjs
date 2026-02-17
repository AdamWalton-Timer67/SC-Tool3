#!/usr/bin/env node
import fs from 'node:fs/promises';

const SHEET_ID = '1ji0q_pp6iW35RG1YyFEsv-lsmZOaCStJXGdIEdLLwhM';
const HTML_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/htmlview`;
const OUTPUT_PATH = 'src/lib/mock-db.generated.json';

function parseGvizPayload(raw) {
	const match = raw.match(/setResponse\((.*)\);?\s*$/s);
	if (!match) throw new Error('Unable to parse GViz response payload.');
	return JSON.parse(match[1]);
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

async function fetchText(url) {
	const res = await fetch(url);
	if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
	return res.text();
}

async function main() {
	console.log('Downloading sheet index...');
	const html = await fetchText(HTML_URL);

	const names = Array.from(
		html.matchAll(/<td[^>]*>([^<]+)<\/td>/g),
		(m) => m[1].trim()
	)
		.filter(Boolean)
		.filter((value, i, arr) => arr.indexOf(value) === i);

	if (names.length === 0) {
		throw new Error('No sheet names found in htmlview export.');
	}

	console.log(`Found ${names.length} tabs. Rebuilding from oldest entries to latest updates...`);

	const rawSheets = {};
	const mergedByKey = new Map();
	const events = [];

	for (const sheetName of names) {
		const gvizUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(sheetName)}&tqx=out:json`;
		const payload = parseGvizPayload(await fetchText(gvizUrl));
		const rows = sheetTableToRows(payload);
		rawSheets[sheetName] = rows;

		for (const row of rows) {
			const values = Object.values(row);
			const firstText = values.find((v) => typeof v === 'string' && v.trim());
			if (!firstText) continue;

			const key = normalizeKey(row.id ?? row.ID ?? row.Name ?? row.name ?? firstText);
			const parsedDate = values
				.map((v) => dateValue(typeof v === 'object' ? v : { v }))
				.find(Boolean);

			events.push({ key, sheetName, parsedDate, row });
		}
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
			tabCount: names.length,
			rowEventCount: events.length,
			rebuildMode: 'oldest-first-then-update'
		},
		tabs: names,
		rawSheets,
		mergedEntries: Array.from(mergedByKey.values())
	};

	await fs.writeFile(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf8');
	console.log(`Wrote ${OUTPUT_PATH}`);
}

main().catch((error) => {
	console.error('Failed to rebuild mock database from Google Sheet:', error.message);
	process.exit(1);
});
