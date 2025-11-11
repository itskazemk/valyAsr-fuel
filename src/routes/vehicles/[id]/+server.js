import { db } from "$lib/server/db";
import { vehicles } from "$lib/server/db/schema.js";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export async function GET({ params }) {
    const { id } = params;
    const vehicle = (await db.select().from(vehicles).where(eq(vehicles.id, id)))?.at(0)

    if (!vehicle) {
        return json({ success: false, error: null });
    }

    return json({ success: true, error: null, data: vehicle });
}