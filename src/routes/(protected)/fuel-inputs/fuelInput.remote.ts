import { command, query } from '$app/server';
import { db } from '$lib/server/db';
import { fuelInputs } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';

export const getFuelInputs = query(
	v.object({ date: v.string(), fuelType: v.number() }),
	async () => {
		return await db.select().from(fuelInputs);
	},
);

export const createFuelInput = command(
	v.object({
		date: v.string(),
		type: v.pipe(v.string(), v.uuid()),
		amount: v.number(),
	}),
	async ({ date, type, amount }) => {
		try {
			await db.insert(fuelInputs).values({ date, type, amount });
		} catch {
			error(502, 'failed to create fuelInput');
		}
	},
);

export const updateFuelInput = command(
	v.object({
		id: v.pipe(v.string(), v.uuid()),
		date: v.string(),
		type: v.pipe(v.string(), v.uuid()),
		amount: v.number(),
	}),
	async ({ id, date, type, amount }) => {
		try {
			await db.update(fuelInputs).set({ date, type, amount }).where(eq(fuelInputs.id, id));
		} catch {
			error(502, 'failed to update fuelInput');
		}
	},
);

export const deleteFuelInput = command(v.pipe(v.string(), v.uuid()), async (id) => {
	try {
		await db.delete(fuelInputs).where(eq(fuelInputs.id, id));
	} catch {
		error(502, 'failed to delete fuelInput');
	}
});
