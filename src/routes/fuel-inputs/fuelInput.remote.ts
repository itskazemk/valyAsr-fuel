import { query } from '$app/server';
import { db } from '$lib/server/db';
import { fuelInputs } from '$lib/server/db/schema';
import * as v from 'valibot';

export const getFuelInputs = query(
	v.object({ date: v.string(), fuelType: v.number() }),
	async () => {
		return await db.select().from(fuelInputs);
	},
);
