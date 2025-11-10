import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const Vehicle = sqliteTable('Vehicles', {
	id: text()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID())
		.notNull(),
	title: text().notNull(),
	type: integer().notNull(),
	plate: text().notNull(),
	fuelType: integer().notNull(),
	ownerUnit: integer().notNull(),
	createdAt: text()
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});
