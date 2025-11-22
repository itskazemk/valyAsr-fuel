import { command, form, query } from '$app/server';
import { db } from '$lib/server/db';
import { baseInfos } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
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

export const createBaseInfo = command(
	v.object({
		subId: v.pipe(v.string(), v.uuid(), v.nonEmpty()),
		title: v.pipe(v.string(), v.nonEmpty()),
	}),
	async ({ subId, title }) => {
		try {
			await db.insert(baseInfos).values({ title, subId });
		} catch {
			error(502, 'failed to create baseInfo');
		}
	},
);

export const updateBaseInfo = command(
	v.object({
		id: v.pipe(v.string(), v.uuid()),
		title: v.pipe(v.string(), v.nonEmpty()),
	}),
	async ({ id, title }) => {
		try {
			await db.update(baseInfos).set({ title }).where(eq(baseInfos.id, id));
		} catch {
			error(502, 'failed to update baseInfo');
		}
	},
);

export const toggleDisableBaseInfo = command(v.pipe(v.string(), v.uuid()), async (id) => {
	try {
		const oldRecord = (await db.select().from(baseInfos).where(eq(baseInfos.id, id)))?.at(0);

		await db
			.update(baseInfos)
			.set({ disabled: Number(!oldRecord?.disabled) })
			.where(eq(baseInfos.id, id));
	} catch {
		error(502, 'failed to toggle disable baseInfo');
	}
});
