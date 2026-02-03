import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Meta CAPI Configuration
const PIXEL_ID = process.env.META_PIXEL_ID || "1200986641643855";
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const GRAPH_API_URL = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`;

interface CAPIEventData {
    event_name: string;
    event_id: string;
    event_time: number;
    event_source_url: string;
    content_ids?: string[];
    content_type?: string;
    content_name?: string;
    value?: number;
    currency?: string;
    num_items?: number;
    order_id?: string;
    user_data?: {
        em?: string; // hashed email
        ph?: string; // hashed phone
        fn?: string; // hashed first name
        ln?: string; // hashed last name
        external_id?: string;
    };
}

export async function POST(req: Request) {
    // Vérifier que le token est configuré
    if (!ACCESS_TOKEN) {
        console.warn("META_ACCESS_TOKEN not configured - CAPI event not sent");
        return NextResponse.json(
            { success: false, message: "CAPI not configured" },
            { status: 200 }
        );
    }

    try {
        const data: CAPIEventData = await req.json();

        // Récupérer les headers pour l'IP et User-Agent
        const headersList = await headers();
        const clientIp = headersList.get("x-forwarded-for")?.split(",")[0] ||
            headersList.get("x-real-ip") ||
            "unknown";
        const userAgent = headersList.get("user-agent") || "unknown";

        // Construire les données utilisateur pour le matching
        const user_data: Record<string, string> = {
            client_ip_address: clientIp,
            client_user_agent: userAgent,
        };

        // Ajouter les données utilisateur si disponibles
        if (data.user_data) {
            if (data.user_data.em) user_data.em = data.user_data.em;
            if (data.user_data.ph) user_data.ph = data.user_data.ph;
            if (data.user_data.fn) user_data.fn = data.user_data.fn;
            if (data.user_data.ln) user_data.ln = data.user_data.ln;
            if (data.user_data.external_id) user_data.external_id = data.user_data.external_id;
        }

        // Construire les custom_data
        const custom_data: Record<string, unknown> = {};
        if (data.content_ids) custom_data.content_ids = data.content_ids;
        if (data.content_type) custom_data.content_type = data.content_type;
        if (data.content_name) custom_data.content_name = data.content_name;
        if (data.value !== undefined) custom_data.value = data.value;
        if (data.currency) custom_data.currency = data.currency;
        if (data.num_items !== undefined) custom_data.num_items = data.num_items;
        if (data.order_id) custom_data.order_id = data.order_id;

        // Construire l'événement CAPI
        const capiEvent = {
            event_name: data.event_name,
            event_id: data.event_id, // Pour déduplication avec le Pixel
            event_time: data.event_time || Math.floor(Date.now() / 1000),
            event_source_url: data.event_source_url,
            action_source: "website",
            user_data,
            custom_data,
        };

        // Envoyer à Facebook Graph API
        const response = await fetch(GRAPH_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data: [capiEvent],
                access_token: ACCESS_TOKEN,
            }),
        });

        const result = await response.json();

        if (!response.ok) {
            console.error("CAPI Error:", result);
            return NextResponse.json(
                { success: false, error: result },
                { status: 500 }
            );
        }

        console.log(`CAPI Event sent: ${data.event_name} (ID: ${data.event_id})`);
        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error("CAPI Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
