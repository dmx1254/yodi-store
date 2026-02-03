import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Yodi Cosmetics - Parapharmacie en ligne',
    short_name: 'Yodi Cosmetics',
    description: 'Yodi-store vend des produits pharmaceutiques et cosmétiques, vous trouverez ici toute les sortes de produit cosmétiques',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#A36F5E',
    icons: [
      {
        src: '/logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
    categories: ['shopping', 'health', 'beauty'],
    lang: 'fr',
    orientation: 'portrait',
  }
}
