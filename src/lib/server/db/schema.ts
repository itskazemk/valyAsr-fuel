import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const Vehicle = sqliteTable('Vehicles', {
	Id: text('Id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID())
		.notNull(),
	Title: text('Title').notNull(),
	Type: integer('type').notNull(),
	Plate: text('Plate').notNull(),
	FuelType: integer('FuelType').notNull(),
	OwnerUnit: integer('OwnerUnit').notNull(),
	CreatedAt: text('CreatedAt')
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});
