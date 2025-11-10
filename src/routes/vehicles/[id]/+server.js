import { db } from "$lib/server/db";
import { Vehicle } from "$lib/server/db/schema";
import { json } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

export async function GET({ params }) {
    const { id } = params;
    const vehicle = (await db.select().from(Vehicle).where(eq(Vehicle.id, id)))?.at(0)

    if (!vehicle) {
        return json({ success: false, error: null });
    }

    return json({ success: true, error: null, data: vehicle });
}