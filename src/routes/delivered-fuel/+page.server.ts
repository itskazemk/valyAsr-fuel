import { db } from '$lib/server/db/index.js';
import { fuelOutputs, vehicles } from '$lib/server/db/schema.js';
import {
	CalendarDate,
	GregorianCalendar,
	PersianCalendar,
	toCalendar
} from '@internationalized/date';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function load({ cookies }) {
	// let id = cookies.get('userid');

	// if (!id) {
	// 	id = crypto.randomUUID();
	// 	cookies.set('userid', id, { path: '/' });
	// }

	return {
		fuelOutputs: await db.select().from(fuelOutputs),
		vehicles: await db.select().from(vehicles)
	};
}

export const actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		const data = Object.fromEntries(formData);

		// CONVERT Persian Date to Gregorian
		const dateSplitted = data.date.split('/');
		const datePersian = new CalendarDate(
			new PersianCalendar(),
			Number(dateSplitted?.at(0)),
			Number(dateSplitted?.at(1)),
			Number(dateSplitted?.at(2))
		);
		data.date = toCalendar(datePersian, new GregorianCalendar()).toString();

		console.log('fuelOutputs-Create', data);

		try {
			await db.insert(fuelOutputs).values(data);
		} catch (error) {
			return fail(422, { error: error.message });
		}
	},

	update: async ({ request }) => {
		const formData = await request.formData();

		const data = Object.fromEntries(formData);

		// CONVERT Persian Date to Gregorian
		const dateSplitted = data.date.split('/');
		const datePersian = new CalendarDate(
			new PersianCalendar(),
			Number(dateSplitted?.at(0)),
			Number(dateSplitted?.at(1)),
			Number(dateSplitted?.at(2))
		);
		data.date = toCalendar(datePersian, new GregorianCalendar()).toString();

		await db
			.update(fuelOutputs)
			.set({ ...data })
			.where(eq(fuelOutputs.id, data.id));
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		await db.delete(fuelOutputs).where(eq(fuelOutputs.id, id));
	}
};
