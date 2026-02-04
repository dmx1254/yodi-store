import Categories from "@/components/Categories";
import CurrentSelection from "@/components/CurrentSelection";
import LifestyleSection from "@/components/LifestyleSection";
import ProductCarousel from "@/components/ProductCarousel";
import SencondFooter from "@/components/SencondFooter";
import Slider from "@/components/Slider";

// ============================================
// 🚀 SSR + ISR: Fetch products at build/request time with caching
// ============================================
async function getCarouselProducts() {
  try {
    // Use absolute URL for server-side fetch
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/products?limit=12&inStock=true&sort=newest`, {
      next: { revalidate: 300 } // ISR: revalidate every 5 minutes
    });

    if (!res.ok) {
      console.error('Failed to fetch carousel products:', res.status);
      return [];
    }

    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching carousel products:', error);
    return [];
  }
}

export default async function Home() {
  // Fetch products server-side - passed to client carousel
  const carouselProducts = await getCarouselProducts();

  return (
    <main>
      <Slider />
      <Categories />
      <CurrentSelection />
      <ProductCarousel initialProducts={carouselProducts} />
      <LifestyleSection />
      <SencondFooter />
      {/* Bandeau supérieur vert */}
    </main>
  );
}
