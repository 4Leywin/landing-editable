import { NextRequest, NextResponse } from "next/server";
import { getAll, createItem } from "@/services/firebase/content";

// ✅ GET → lee una colección completa
export async function GET(req: NextRequest) {
    const nameCollection = req.nextUrl.searchParams.get("collection");
    if (!nameCollection) {
        return NextResponse.json(
            { error: "Missing 'collection' parameter" },
            { status: 400 }
        );
    }

    console.log("📦 Fetching collection:", nameCollection);

    try {
        const content = await getAll(nameCollection);
        return NextResponse.json(content);
    } catch (err) {
        console.error("❌ Error fetching collection:", err);
        return NextResponse.json(
            { error: "Failed to read content" },
            { status: 500 }
        );
    }
}

// ✅ POST → crea un nuevo documento en la colección especificada
export async function POST(req: NextRequest) {
    const nameCollection = req.nextUrl.searchParams.get("collection");

    if (!nameCollection) {
        return NextResponse.json(
            { error: "Missing 'collection' parameter" },
            { status: 400 }
        );
    }

    try {
        const body = await req.json();
        const id = await createItem(nameCollection, body);
        return NextResponse.json({ success: true, id });
    } catch (err) {
        console.error("❌ Error creating item:", err);
        return NextResponse.json(
            { error: "Failed to create content" },
            { status: 500 }
        );
    }
}
