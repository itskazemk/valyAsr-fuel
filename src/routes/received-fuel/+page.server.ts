import { db } from '$lib/server/db/index.js';
import { fuelInputs } from '$lib/server/db/schema.js';
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

	return { fuelInputs: await db.select().from(fuelInputs) };
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

		console.log(data);
		try {
			await db.insert(fuelInputs).values({
				date: data.date,
				type: data.type,
				amount: data.amount
			});
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
			.update(fuelInputs)
			.set({ ...data })
			.where(eq(fuelInputs.id, data.id));
	},

	delete: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');
		await db.delete(fuelInputs).where(eq(fuelInputs.id, id));
	}
};
