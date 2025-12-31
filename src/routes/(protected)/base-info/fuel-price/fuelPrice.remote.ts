import { command, query } from '$app/server';
import { db } from '$lib/server/db';
import { fuelPrices } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { and, between, eq, gte, lte, or } from 'drizzle-orm';
import * as v from 'valibot';

export const getFuelPrices = query(async () => {
	return await db.select().from(fuelPrices);
});

export const createFuelPrice = command(
	v.object({ startDate: v.string(), endDate: v.string(), type: v.number(), amount: v.number() }),
	async ({ startDate, endDate, type, amount }) => {
		try {
			await db.insert(fuelPrices).values({ startDate, endDate, type, amount });
		} catch {
			error(502, 'failed to create fuelPrice');
		}
	},
);

export const updateFuelPrice = command(
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
				.update(fuelPrices)
				.set({ startDate, endDate, type, amount })
				.where(eq(fuelPrices.id, id));
		} catch {
			error(502, 'failed to update fuelPrice');
		}
	},
);

export const deleteFuelPrice = command(v.pipe(v.string(), v.uuid()), async (id) => {
	try {
		await db.delete(fuelPrices).where(eq(fuelPrices.id, id));
	} catch {
		error(502, 'failed to delete fuelPrice');
	}
});

export const getFuelPriceAtDate = query(
	v.object({ date: v.string(), fuelType: v.number() }),
	async ({ date, fuelType }) => {
		try {
			const val = await db
				.select({ amount: fuelPrices.amount })
				.from(fuelPrices)
				.where(
					and(
						and(gte(fuelPrices.endDate, date), lte(fuelPrices.startDate, date)),
						eq(fuelPrices.type, fuelType),
					),
				);

			console.log(3333, val, val?.at(0)?.amount);

			if (val.length === 0) {
				return null;
			}

			return val?.at(0)?.amount;
		} catch {
			error(502, `failed to get fuelPrice at ${date}`);
		}
	},
);
