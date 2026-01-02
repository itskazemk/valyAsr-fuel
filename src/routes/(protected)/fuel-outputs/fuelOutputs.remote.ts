import { command, query } from '$app/server';
import { db } from '$lib/server/db';
import { fuelOutputs } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { and, between, eq, gte, lte, or } from 'drizzle-orm';
import * as v from 'valibot';

export const getFuelOutputs = query(async () => {
	return await db.select().from(fuelOutputs);
});

export const createFuelOutput = command(
	v.object({
		date: v.string(),
		vehicleId: v.string(),
		DelivererPersonId: v.string(),
		ReceiverPersonId: v.string(),
		amount: v.number(),
		kilometer: v.number(),
		location: v.number(),
		description: v.nullable(v.string()),
	}),
	async ({
		date,
		vehicleId,
		DelivererPersonId,
		ReceiverPersonId,
		amount,
		kilometer,
		location,
		description,
	}) => {
		try {
			await db.insert(fuelOutputs).values({
				date,
				vehicleId,
				DelivererPersonId,
				ReceiverPersonId,
				amount,
				kilometer,
				location,
				description,
			});
		} catch {
			error(502, 'failed to create FuelOutput');
		}
	},
);

export const updateFuelOutput = command(
	v.object({
		id: v.pipe(v.string(), v.uuid()),
		date: v.string(),
		vehicleId: v.string(),
		DelivererPersonId: v.string(),
		ReceiverPersonId: v.string(),
		amount: v.number(),
		kilometer: v.number(),
		location: v.number(),
		description: v.string(),
	}),
	async ({
		id,
		date,
		vehicleId,
		DelivererPersonId,
		ReceiverPersonId,
		amount,
		kilometer,
		location,
		description,
	}) => {
		try {
			await db
				.update(fuelOutputs)
				.set({
					id,
					date,
					vehicleId,
					DelivererPersonId,
					ReceiverPersonId,
					amount,
					kilometer,
					location,
					description,
				})
				.where(eq(fuelOutputs.id, id));
		} catch {
			error(502, 'failed to update FuelOutput');
		}
	},
);

export const deleteFuelOutput = command(v.pipe(v.string(), v.uuid()), async (id) => {
	try {
		await db.delete(fuelOutputs).where(eq(fuelOutputs.id, id));
	} catch {
		error(502, 'failed to delete FuelOutput');
	}
});
