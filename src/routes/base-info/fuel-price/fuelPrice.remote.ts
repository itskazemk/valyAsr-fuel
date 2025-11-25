import { command, query } from '$app/server';
import { db } from '$lib/server/db';
import { fuelPrices } from '$lib/server/db/schema';
import * as v from 'valibot';

export const getFuelPrices = query(async () => {
	return await db.select().from(fuelPrices);
});

export const createFuelPrice = command(
	v.object({ startDate: v.string(), endDate: v.string(), type: v.number(), amount: v.number() }),
	async () => {},
);

export const updateFuelPrice = command(
	v.object({
		id: v.pipe(v.string(), v.uuid()),
		startDate: v.string(),
		endDate: v.string(),
		type: v.number(),
		amount: v.number(),
	}),
	async () => {},
);
