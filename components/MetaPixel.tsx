"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useEffect, Suspense } from "react";

export const FB_PIXEL_ID = "889942440243731";

// Déclaration TypeScript pour fbq
declare global {
    interface Window {
        fbq: (
            action: string,
            eventName: string,
            params?: Record<string, unknown>
        ) => void;
        _fbq: unknown;
    }
}

// Fonction pour déclencher les événements PageView
export const pageview = () => {
    if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "PageView");
    }
};

// Fonction pour déclencher des événements personnalisés
export const event = (name: string, options: Record<string, unknown> = {}) => {
    if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", name, options);
    }
};

// Événement ViewContent (page produit)
export const trackViewContent = (product: {
    id: string;
    name: string;
    category?: string;
    price: number;
    currency?: string;
}) => {
    event("ViewContent", {
        content_ids: [product.id],
        content_name: product.name,
        content_category: product.category || "",
        content_type: "product",
        value: product.price,
        currency: product.currency || "XOF",
    });
};

// Événement AddToCart
export const trackAddToCart = (product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    currency?: string;
}) => {
    event("AddToCart", {
        content_ids: [product.id],
        content_name: product.name,
        content_type: "product",
        value: product.price * product.quantity,
        currency: product.currency || "XOF",
        num_items: product.quantity,
    });
};

// Événement InitiateCheckout
export const trackInitiateCheckout = (data: {
    value: number;
    currency?: string;
    num_items: number;
    content_ids: string[];
}) => {
    event("InitiateCheckout", {
        content_ids: data.content_ids,
        content_type: "product",
        value: data.value,
        currency: data.currency || "XOF",
        num_items: data.num_items,
    });
};

// Événement Purchase
export const trackPurchase = (data: {
    value: number;
    currency?: string;
    content_ids: string[];
    num_items: number;
    order_id?: string;
}) => {
    event("Purchase", {
        content_ids: data.content_ids,
        content_type: "product",
        value: data.value,
        currency: data.currency || "XOF",
        num_items: data.num_items,
        order_id: data.order_id || "",
    });
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
