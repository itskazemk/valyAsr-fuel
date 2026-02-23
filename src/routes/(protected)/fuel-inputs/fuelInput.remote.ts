import { command, query } from '$app/server';
import { db } from '$lib/server/db';
import { fuelInputs, fuelOutputs, vehicles } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { and, eq, lte } from 'drizzle-orm';
import * as v from 'valibot';

export const remainingFuelInputByDate = query(
	v.object({
		date: v.string(),
		fuelTypeId: v.pipe(v.string(), v.uuid()),
	}),
	async ({ date, fuelTypeId }) => {
		try {
			const fuelInputValues = await db
				.select()
				.from(fuelInputs)
				.where(and(lte(fuelInputs.date, date), eq(fuelInputs.type, fuelTypeId)));

			const fuelOutputValues = await db
				.select({ amount: fuelOutputs.amount })
				.from(fuelOutputs)
				.leftJoin(vehicles, eq(fuelOutputs.vehicleId, vehicles.id))
				.where(and(lte(fuelOutputs.date, date), eq(vehicles.fuelType, fuelTypeId)));

			console.log(12345, fuelOutputValues);

			if (fuelInputValues.length > 0 && fuelOutputValues.length > 0) {
				const sumOfInputFuels = fuelInputValues.reduce((acc, cur) => {
					return cur.amount + acc;
				}, 0);

				const sumOfOutputFuels = fuelOutputValues.reduce((acc, cur) => {
					return cur.amount + acc;
				}, 0);

				return sumOfInputFuels - sumOfOutputFuels;
			} else {
				return 0;
			}
		} catch {
			error(502, 'failed to get fuelInputs');
		}
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
