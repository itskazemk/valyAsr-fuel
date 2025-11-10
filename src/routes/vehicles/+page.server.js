import { invalidate, invalidateAll } from '$app/navigation';
import { db } from '$lib/server/db/index.js';
import { Vehicle } from '$lib/server/db/schema.js';
import { fail, json } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';


export async function load({ cookies }) {
    // let id = cookies.get('userid');

    // if (!id) {
    // 	id = crypto.randomUUID();
    // 	cookies.set('userid', id, { path: '/' });
    // }

    return { vehicles: await db.select().from(Vehicle) };
}

export const actions = {
    create: async ({ cookie, request }) => {

        const formData = await request.formData();

        const data = Object.fromEntries(formData)

        console.log(data)
        try {
            await db.insert(Vehicle).values({ Title: data.title, Type: Number(data.type), Plate: data.plate, FuelType: Number(data.fuelType), OwnerUnit: Number(data.ownerUnit) })

        } catch (error) {
            return fail(422, { error: error.message })
        }

    },

    update: async ({ cookie, request }) => {
        const formData = await request.formData();
        const data = Object.fromEntries(formData)

        console.log(69, data)

    },

    delete: async ({ cookie, request }) => {
        const data = await request.formData();
        const id = data.get("id");
        await db.delete(Vehicle).where(eq(Vehicle.Id, id))
    }

}


