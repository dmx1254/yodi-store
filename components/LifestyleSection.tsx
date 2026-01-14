"use client";

import Image from "next/image";

export default function LifestyleSection() {
    // ============================================
    // SECTION TEMPORAIREMENT MASQUÉE
    // Pour réactiver : supprimer le "return null" ci-dessous
    // ============================================
    return null;

    // Code original préservé - Ne pas supprimer
    return (
        <section className="w-full mt-16">
            {/* Pure image banner - no text, no overlay, no margin */}
            <div
                className="relative w-full"
                style={{ aspectRatio: '3024 / 870' }}
            >
                <Image
                    src="/lifestyle-banner.png"
                    alt="Yodi - Soins naturels pour cheveux"
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                />
            </div>
        </section>
    );
}
