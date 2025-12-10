import { db } from '$lib/server/db/index.js';
import { vehicles } from '$lib/server/db/schema.js';
import { fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { getVehicles } from './vehicles.remote';

export async function load({ cookies }) {
	// let id = cookies.get('userid');

	// if (!id) {
	// 	id = crypto.randomUUID();
	// 	cookies.set('userid', id, { path: '/' });
	// }

	return { vehicles: await getVehicles() };
}
