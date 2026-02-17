import { getMariaPool, hasMariaConfig } from '$lib/server/maria';
import type { ResultSetHeader } from 'mysql2';

type PendingUser = {
	id: string;
	email: string;
	created_at: string;
	display_name: string;
};

function requireMaria() {
	if (!hasMariaConfig()) {
		throw new Error(
			'MariaDB is not configured. Set MARIADB_HOST, MARIADB_USER and MARIADB_DATABASE.'
		);
	}

	return getMariaPool();
}

export async function listPendingUsers() {
	const pool = requireMaria();
	const [rows] = await pool.query(
		`SELECT id, email, created_at, display_name
		 FROM users
		 WHERE approved = 0
		 ORDER BY created_at ASC`
	);

	return { data: rows as PendingUser[], error: null };
}

export async function approveUserById(userId: string) {
	const pool = requireMaria();
	const [result] = await pool.query<ResultSetHeader>(
		`UPDATE users SET approved = 1, approved_at = NOW() WHERE id = ?`,
		[userId]
	);

	if (result.affectedRows === 0) {
		return { data: null, error: null };
	}

	return { data: { id: userId, approved: true }, error: null };
}

export async function rejectUserById(userId: string) {
	const pool = requireMaria();
	const [result] = await pool.query<ResultSetHeader>(`DELETE FROM users WHERE id = ?`, [userId]);

	if (result.affectedRows === 0) {
		return { error: { message: 'User not found.' } };
	}

	return { error: null };
}

export async function createPendingUser(input: {
	email: string;
	passwordHash: string;
	displayName: string;
}) {
	const pool = requireMaria();
	const id = crypto.randomUUID();

	const [existing] = await pool.query(`SELECT id FROM users WHERE email = ? LIMIT 1`, [
		input.email
	]);
	if (Array.isArray(existing) && existing.length > 0) {
		return { data: null, error: { message: 'An account with this email already exists.' } };
	}

	await pool.query(
		`INSERT INTO users (id, email, password_hash, display_name, approved, created_at)
		 VALUES (?, ?, ?, ?, 0, NOW())`,
		[id, input.email, input.passwordHash, input.displayName]
	);

	return { data: { id, email: input.email, display_name: input.displayName }, error: null };
}
