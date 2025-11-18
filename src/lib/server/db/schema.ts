import { relations, sql } from 'drizzle-orm';
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
export const vehiclesRelations = relations(vehicles, ({ many }) => ({
	fuelOutputs: many(fuelOutputs)
}));

export const fuelInputs = sqliteTable('fuel-inputs', {
	id: text()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID())
		.notNull(),

	date: text().notNull(),
	type: integer().notNull(),
	amount: integer().notNull(), // Liter

	updatedAt: text()
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	createdAt: text()
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});

export const fuelOutputs = sqliteTable('fuel-outputs', {
	id: text()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID())
		.notNull(),

	date: text().notNull(),
	fuelType: integer().notNull(),
	amount: integer().notNull(), // Liter
	vehicleId: text().notNull(),
	DelivererId: text().notNull(),
	ReceiverId: text().notNull(),

	updatedAt: text()
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	createdAt: text()
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});
export const fuelOutputsRelations = relations(fuelOutputs, ({ one }) => ({
	vehicle: one(vehicles, {
		fields: [fuelOutputs.vehicleId],
		references: [vehicles.id]
	})
}));

export const baseInfos = sqliteTable('base-infos', {
	id: text()
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID())
		.notNull(),

	subId: text().notNull(),
	title: text().notNull(),
	disabled: integer().notNull().default(0),

	updatedAt: text()
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull(),
	createdAt: text()
		.default(sql`CURRENT_TIMESTAMP`)
		.notNull()
});
