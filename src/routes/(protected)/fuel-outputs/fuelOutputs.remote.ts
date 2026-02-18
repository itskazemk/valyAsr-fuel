import { command, query } from '$app/server';
import { db } from '$lib/server/db';
import { fuelOutputs } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { and, count, desc, eq, gte, lte } from 'drizzle-orm';
import * as v from 'valibot';

export const getFuelOutputsPagination = query(
	v.object({
		startDate: v.string(),
		endDate: v.string(),
		pageNumber: v.number(),
		pageSize: v.number(),
	}),
	async ({ startDate, endDate, pageNumber = 1, pageSize = 10 }) => {
		console.log(111, startDate, endDate, pageNumber, pageSize);

		const items = await db
			.select()
			.from(fuelOutputs)
			.where(and(gte(fuelOutputs.date, startDate), lte(fuelOutputs.date, endDate)))
			.orderBy(desc(fuelOutputs.date))
			.limit(pageSize)
			.offset(pageSize * (pageNumber - 1));

		const totalCount = (
			await db
				.select({ count: count() })
				.from(fuelOutputs)
				.where(and(gte(fuelOutputs.date, startDate), lte(fuelOutputs.date, endDate)))
				.orderBy(desc(fuelOutputs.date))
		)?.at(0);

		console.log(56555555, totalCount);

		const ReturningPageObj = { items, currentPageNumber: pageNumber, pageSize, totalCount: totalCount?.count };

		console.log(222, ReturningPageObj);
		return ReturningPageObj;
	},
);

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
		kilometer: v.nullable(v.number()),
		locationId: v.pipe(v.string(), v.uuid()),
		description: v.nullable(v.string()),
	}),
	async ({ date, vehicleId, DelivererPersonId, ReceiverPersonId, amount, kilometer, locationId, description }) => {
		try {
			await db.insert(fuelOutputs).values({
				date,
				vehicleId,
				DelivererPersonId,
				ReceiverPersonId,
				amount,
				kilometer,
				locationId,
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
		kilometer: v.nullable(v.number()),
		locationId: v.pipe(v.string(), v.uuid()),
		description: v.string(),
	}),
	async ({ id, date, vehicleId, DelivererPersonId, ReceiverPersonId, amount, kilometer, locationId, description }) => {
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
					locationId,
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
