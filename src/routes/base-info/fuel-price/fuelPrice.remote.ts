import { query } from '$app/server';
import { db } from '$lib/server/db';
import { fuelPrices } from '$lib/server/db/schema';

export const getFuelPrices = query(async () => {
	return await db.select().from(fuelPrices);
});
