import { query } from '$app/server';
import { db } from '$lib/server/db';
import { fuelInputs, fuelOutputs } from '$lib/server/db/schema';
import { and, eq, gte, lte } from 'drizzle-orm';
import * as v from 'valibot';

export const getFuelConsumptionDifference = query(
	v.object({
		startDate: v.string(),
		endDate: v.string(),
		fuelTypeId: v.number(),
	}),
	async ({ startDate, endDate, fuelTypeId }) => {
		try {
			const fuelInput = await db
				.select()
				.from(fuelInputs)
				.where(
					and(and(gte(fuelInputs.date, startDate), lte(fuelInputs.date, endDate)), eq(fuelInputs.type, fuelTypeId)),
				);
			const fuelOutput = await db.select().from(fuelOutputs).where();
		} catch {}
	},
);
