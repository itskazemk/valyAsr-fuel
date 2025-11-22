import { getBaseInfo } from '../baseInfos.remote.js';

export async function load({ params }) {
	let values = await getBaseInfo(params.id);

	return {
		baseInfos: values
	};
}
