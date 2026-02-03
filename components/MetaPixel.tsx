"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, Suspense } from "react";

export const FB_PIXEL_ID = "1200986641643855";

// Génère un ID unique pour la déduplication Pixel ↔ CAPI
export const generateEventId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
};

// Déclaration TypeScript pour fbq
declare global {
    interface Window {
        fbq: (
            action: string,
            eventName: string,
            params?: Record<string, unknown>,
            options?: { eventID?: string }
        ) => void;
        _fbq: unknown;
    }
}

// Types pour les données d'événements
interface BaseEventData {
    event_id?: string;
}

interface ViewContentData extends BaseEventData {
    id: string;
    name: string;
    category?: string;
    price: number;
    currency?: string;
}

interface AddToCartData extends BaseEventData {
    id: string;
    name: string;
    price: number;
    quantity: number;
    currency?: string;
}

interface InitiateCheckoutData extends BaseEventData {
    value: number;
    currency?: string;
    num_items: number;
    content_ids: string[];
}

interface AddPaymentInfoData extends BaseEventData {
    value: number;
    currency?: string;
    content_ids: string[];
    content_type?: string;
}

interface PurchaseData extends BaseEventData {
    value: number;
    currency?: string;
    content_ids: string[];
    num_items: number;
    order_id?: string;
}

// Fonction pour déclencher les événements PageView
export const pageview = () => {
    if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "PageView");
    }
};

// Fonction générique pour déclencher des événements avec event_id
export const event = (
    name: string,
    options: Record<string, unknown> = {},
    eventId?: string
) => {
    if (typeof window !== "undefined" && window.fbq) {
        const params: Record<string, unknown> = {
            ...options,
            event_time: Math.floor(Date.now() / 1000),
            event_source_url: typeof window !== "undefined" ? window.location.href : "",
        };

        if (eventId) {
            window.fbq("track", name, params, { eventID: eventId });
        } else {
            window.fbq("track", name, params);
        }
    }
};

// Événement ViewContent (page produit)
export const trackViewContent = (product: ViewContentData): string => {
    const eventId = product.event_id || generateEventId();
    event(
        "ViewContent",
        {
            content_ids: [product.id],
            content_name: product.name,
            content_category: product.category || "",
            content_type: "product",
            value: product.price,
            currency: product.currency || "XOF",
        },
        eventId
    );
    return eventId;
};

// Événement AddToCart
export const trackAddToCart = (product: AddToCartData): string => {
    const eventId = product.event_id || generateEventId();
    event(
        "AddToCart",
        {
            content_ids: [product.id],
            content_name: product.name,
            content_type: "product",
            value: product.price * product.quantity,
            currency: product.currency || "XOF",
            num_items: product.quantity,
        },
        eventId
    );
    return eventId;
};

// Événement InitiateCheckout
export const trackInitiateCheckout = (data: InitiateCheckoutData): string => {
    const eventId = data.event_id || generateEventId();
    event(
        "InitiateCheckout",
        {
            content_ids: data.content_ids,
            content_type: "product",
            value: data.value,
            currency: data.currency || "XOF",
            num_items: data.num_items,
        },
        eventId
    );
    return eventId;
};

// Événement AddPaymentInfo (nouveau)
export const trackAddPaymentInfo = (data: AddPaymentInfoData): string => {
    const eventId = data.event_id || generateEventId();
    event(
        "AddPaymentInfo",
        {
            content_ids: data.content_ids,
            content_type: data.content_type || "product",
            value: data.value,
            currency: data.currency || "XOF",
        },
        eventId
    );
    return eventId;
};

// Événement Purchase
export const trackPurchase = (data: PurchaseData): string => {
    const eventId = data.event_id || generateEventId();
    event(
        "Purchase",
        {
            content_ids: data.content_ids,
            content_type: "product",
            value: data.value,
            currency: data.currency || "XOF",
            num_items: data.num_items,
            order_id: data.order_id || "",
        },
        eventId
    );
    return eventId;
};

// Fonction pour envoyer des événements au CAPI backend
export const sendToCAPI = async (
    eventName: string,
    eventData: Record<string, unknown>,
    eventId: string
) => {
    try {
        await fetch("/api/meta-capi", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                event_name: eventName,
                event_id: eventId,
                event_time: Math.floor(Date.now() / 1000),
                event_source_url: typeof window !== "undefined" ? window.location.href : "",
                ...eventData,
            }),
        });
    } catch (error) {
        console.error("Error sending to CAPI:", error);
    }
};

// Composant qui suit les changements de route
function FacebookPixelPageView() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (pathname) {
            pageview();
        }
    }, [pathname, searchParams]);

    return null;
}

// Composant principal Meta Pixel
export default function MetaPixel() {
    return (
        <>
            {/* Script Meta Pixel */}
            <Script
                id="facebook-pixel"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '${FB_PIXEL_ID}');
                        fbq('track', 'PageView');
                    `,
                }}
            />
            {/* Noscript fallback */}
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: "none" }}
                    src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`}
                    alt=""
                />
            </noscript>
            {/* Suivi des changements de page */}
            <Suspense fallback={null}>
                <FacebookPixelPageView />
            </Suspense>
        </>
    );
}
