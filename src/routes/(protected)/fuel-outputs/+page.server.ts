import { getBaseInfoByTitle } from '../base-info/baseInfos.remote.js';
import { getVehicles } from '../vehicles/vehicles.remote.js';
import { getFuelOutputs } from './fuelOutputs.remote.js';

export async function load({ cookies }) {
	const DelivererPersons = (await getBaseInfoByTitle('DelivererPersons')).map((item) => {
		return { label: item.persianTitle, value: item.id };
	});

	const ReceiverPersons = (await getBaseInfoByTitle('ReceiverPersons')).map((item) => {
		return { label: item.persianTitle, value: item.id };
	});

	return {
		fuelOutputs: await getFuelOutputs(),
		vehicles: await getVehicles(),
		DelivererPersons: DelivererPersons,
		ReceiverPersons: ReceiverPersons,
		FuelingLocations: await getBaseInfoByTitle('FuelingLocations'),
	};
}
