import { query } from '$app/server';
import { db } from '$lib/server/db';
import { baseInfos } from '$lib/server/db/schema';
import { eq, isNull } from 'drizzle-orm';
// import { db } from '../../lib/server/db';
// import { baseInfos } from '../../lib/server/db/schema';
import * as v from 'valibot';

export const getBaseInfo = query(v.nullable(v.pipe(v.string(), v.uuid())), async (subId) => {
	if (subId) {
		const items = await db.select().from(baseInfos).where(eq(baseInfos.subId, subId));
		return items;
	} else {
		const items = await db.select().from(baseInfos).where(isNull(baseInfos.subId));
		return items;
	}
});
