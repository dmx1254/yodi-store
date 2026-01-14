import Categories from "@/components/Categories";
import CurrentSelection from "@/components/CurrentSelection";
import LifestyleSection from "@/components/LifestyleSection";
import SencondFooter from "@/components/SencondFooter";
import Slider from "@/components/Slider";

export default function Home() {
  return (
    <main>
      <Slider />
      <Categories />
      <CurrentSelection />
      <LifestyleSection />
      <SencondFooter />
      {/* Bandeau supérieur vert */}
    </main>
  );
}
