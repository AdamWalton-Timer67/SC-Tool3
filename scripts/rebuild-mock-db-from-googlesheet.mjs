#!/usr/bin/env node
import fs from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const SHEET_ID = process.env.SHEET_ID ?? '1ji0q_pp6iW35RG1YyFEsv-lsmZOaCStJXGdIEdLLwhM';
const HTML_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/htmlview`;
const OUTPUT_PATH = process.env.OUTPUT_PATH ?? 'src/lib/mock-db.generated.json';

function parseGvizPayload(raw) {
	const match = raw.match(/setResponse\((.*)\);?\s*$/s);
	if (!match) throw new Error('Unable to parse GViz response payload.');
	return JSON.parse(match[1]);
}

function normalizeDate(value) {
	if (!value) return null;
	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

	const us = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
	if (us) {
		const [, month, day, year] = us;
		return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
	}

	const parsed = new Date(value);
	if (!Number.isNaN(parsed.valueOf())) {
		return parsed.toISOString().slice(0, 10);
	}
	return null;
}

function dateValue(cell) {
	if (!cell) return null;

	if (typeof cell.f === 'string') {
		const f = cell.f.trim();
		const iso = f.match(/\d{4}-\d{2}-\d{2}/)?.[0];
		if (iso) return iso;
		const slash = f.match(/\d{1,2}\/\d{1,2}\/\d{4}/)?.[0];
		if (slash) return normalizeDate(slash);
	}

	if (typeof cell.v === 'string') {
		const fromString = normalizeDate(cell.v.trim());
		if (fromString) return fromString;
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

async function fetchTextWithCurl(url) {
	const { stdout } = await execFileAsync('curl', ['-fsSL', '--retry', '3', '--retry-delay', '1', url], {
		maxBuffer: 10 * 1024 * 1024
	});
	return stdout;
}

async function fetchText(url) {
	return fetchTextWithCurl(url);
}

function decodeJsString(raw) {
	const normalized = raw
		.replace(/\\\\x([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)))
		.replace(/\\x([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(Number.parseInt(hex, 16)))
		.replace(/\\([&>])/g, '$1');
	try {
		return JSON.parse(`"${normalized}"`);
	} catch {
		return normalized;
	}
}


function parseSheetNamesFromHtml(html) {
	const names = [];

	for (const match of html.matchAll(/items\.push\(\{name:\s*"((?:\\.|[^"\\])*)"/g)) {
		const name = decodeJsString(match[1]).trim();
		if (name) names.push(name);
	}

	if (names.length > 0) {
		return [...new Set(names)];
	}

	for (const match of html.matchAll(/<a[^>]+href="#[^"]*gid=\d+"[^>]*>(.*?)<\/a>/gsi)) {
		const text = match[1]
			.replace(/<[^>]*>/g, ' ')
			.replace(/&nbsp;/gi, ' ')
			.trim();
		if (text) names.push(text);
	}

	return [...new Set(names)];
}

async function main() {
	console.log(`Downloading sheet index for ${SHEET_ID}...`);
	const html = await fetchText(HTML_URL);
	const names = parseSheetNamesFromHtml(html);

	if (names.length === 0) {
		throw new Error('No sheet names found in htmlview export. Check sheet sharing settings.');
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
		return new Date(a.parsedDate).valueOf() - new Date(b.parsedDate).valueOf();
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

	await fs.writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
	console.log(`Wrote ${OUTPUT_PATH} (${output.mergedEntries.length} merged entries).`);
}

main().catch((error) => {
	console.error('Failed to rebuild mock database from Google Sheet:', error.message);
	process.exit(1);
});
