import { env } from '$env/dynamic/private';
import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

function getRequired(name: string): string {
	const value = env[name as keyof typeof env];
	if (!value) throw new Error(`Missing required MariaDB env var: ${name}`);
	return value;
}

export function hasMariaConfig(): boolean {
	return Boolean(env.MARIADB_HOST && env.MARIADB_USER && env.MARIADB_DATABASE);
}

export function getMariaPool(): mysql.Pool {
	if (pool) return pool;

	pool = mysql.createPool({
		host: getRequired('MARIADB_HOST'),
		port: Number(env.MARIADB_PORT ?? 3306),
		user: getRequired('MARIADB_USER'),
		password: env.MARIADB_PASSWORD ?? '',
		database: getRequired('MARIADB_DATABASE'),
		connectionLimit: Number(env.MARIADB_CONNECTION_LIMIT ?? 10)
	});

	return pool;
}
