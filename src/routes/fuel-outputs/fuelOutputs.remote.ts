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
	v.object({ startDate: v.string(), endDate: v.string(), type: v.number(), amount: v.number() }),
	async ({ startDate, endDate, type, amount }) => {
		try {
			await db.insert(fuelOutputs).values({ startDate, endDate, type, amount });
		} catch {
			error(502, 'failed to create FuelOutput');
		}
	},
);

export const updateFuelOutput = command(
	v.object({
		id: v.pipe(v.string(), v.uuid()),
		startDate: v.string(),
		endDate: v.string(),
		type: v.number(),
		amount: v.number(),
	}),
	async ({ id, startDate, endDate, type, amount }) => {
		try {
			await db
				.update(fuelOutputs)
				.set({ startDate, endDate, type, amount })
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
