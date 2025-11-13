import { db } from '$lib/server/db/index.js';
import { vehicles } from '$lib/server/db/schema.js';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';


export async function load({ cookies }) {
    // let id = cookies.get('userid');

    // if (!id) {
    // 	id = crypto.randomUUID();
    // 	cookies.set('userid', id, { path: '/' });
    // }

    return { vehicles: await db.select().from(vehicles) };
}

export const actions = {
    create: async ({ request }) => {

        const formData = await request.formData();

        const data = Object.fromEntries(formData)



        console.log(data)
        try {
            await db.insert(vehicles).values({ title: data.title, type: Number(data.type), plate: data.plate, fuelType: Number(data.fuelType), ownerUnit: Number(data.ownerUnit) })

        } catch (error) {
            return fail(422, { error: error.message })
        }

    },

    update: async ({ request }) => {
        const formData = await request.formData();
        const data = Object.fromEntries(formData)


        await db.update(vehicles)
            .set({ ...data })
            .where(eq(vehicles.id, data.id));


    },

    delete: async ({ request }) => {
        const data = await request.formData();
        const id = data.get("id");
        await db.delete(vehicles).where(eq(vehicles.id, id))
    }

}


