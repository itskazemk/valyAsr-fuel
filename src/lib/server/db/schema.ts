import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const vehicles = sqliteTable('vehicles', {
	id: text()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID())
		.notNull(),

	title: text().notNull(),
	type: integer().notNull(),
	plate: text().notNull(),
	fuelType: integer().notNull(),
	ownerUnit: integer().notNull(),

	updatedAt: text()
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	createdAt: text()
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});

export const fuelInputs = sqliteTable('fuel-inputs', {
	id: text()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID())
		.notNull(),

	date: text().notNull(),
	amount: integer().notNull(), // Liter

	updatedAt: text()
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	createdAt: text()
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});
