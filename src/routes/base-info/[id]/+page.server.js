import { db } from '$lib/server/db/index.js';
import { baseInfos } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';

export async function load({ params }) {

    let values = await db.select().from(baseInfos).where(eq(baseInfos.subId, params.id))
    return {
        baseInfos: values
    };
}