import { db } from '$lib/server/db';
import { baseInfos } from '$lib/server/db/schema';

export async function load({ cookies }) {
	// let id = cookies.get('userid');

	// if (!id) {
	// 	id = crypto.randomUUID();
	// 	cookies.set('userid', id, { path: '/' });
	// }

	return { baseInfos: await db.select().from(baseInfos) };
}

export const actions = {
	create: async ({ request }) => {
		const formData = await request.formData();

		const data = Object.fromEntries(formData);

		console.log(data);
		try {
			await db.insert(baseInfos).values({
				subId: data.subId,
				title: data.title
			});
		} catch (error) {
			return fail(422, { error: error.message });
		}
	},

	update: async ({ request }) => {
		const formData = await request.formData();
		const data = Object.fromEntries(formData);

		await db
			.update(baseInfos)
			.set({ ...data })
			.where(eq(baseInfos.id, data.id));
	},

	disable: async ({ request }) => {
		const data = await request.formData();
		const id = data.get('id');

		//  await db.update(baseInfos)
		//     .set({ ...data })
		//     .where(eq(baseInfos.id, data.id));
	}
};
