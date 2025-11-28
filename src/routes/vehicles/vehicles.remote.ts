import { command, query } from '$app/server';
import { db } from '$lib/server/db';
import { vehicles } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as v from 'valibot';

export const getVehicles = query(async () => {
	return await db.select().from(vehicles);
});

export const createVehicle = command(
	v.object({ title, type, plate, fuelType, ownerUnit}),
	async ({ title, type, plate, fuelType, ownerUnit }) => {
		try {
			await db
				.insert(vehicles)
				.values({
					title: ,
					type: ,
					plate:,
					fuelType: ,
					ownerUnit: ,
				});
		} catch {
			error(502, 'failed to create vehicle');
		}
	},
);

export const updateVehicle = command(
	v.object({
		id: v.pipe(v.string(), v.uuid()),
		startDate: v.string(),
		endDate: v.string(),
		type: v.number(),
		amount: v.number(),
	}),
	async ({ id, title, type, plate, fuelType, ownerUnit }) => {
		try {
			await db
				.update(vehicles)
				.set({ title, type, plate, fuelType, ownerUnit })
				.where(eq(vehicles.id, id));
		} catch {
			error(502, 'failed to update vehicle');
		}
	},
);

export const deleteVehicle = command(v.pipe(v.string(), v.uuid()), async (id) => {
	try {
		await db.delete(vehicles).where(eq(vehicles.id, id));
	} catch {
		error(502, 'failed to delete vehicle');
	}
});
