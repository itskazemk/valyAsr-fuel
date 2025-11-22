import { getFuelPrices } from './fuelPrice.remote';

export async function load() {
	// let id = cookies.get('userid');

	// if (!id) {
	// 	id = crypto.randomUUID();
	// 	cookies.set('userid', id, { path: '/' });
	// }

	return { fuelPrices: await getFuelPrices() };
}
