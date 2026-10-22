import { HeroSlider } from '@/features/home/components/HeroSlider';
import { ModelsSection } from '@/features/home/components/ModelsSection';
import { OffersSection } from '@/features/home/components/OffersSection';

export default function Home() {
  return (
    <div className="page">
      <HeroSlider />
      <OffersSection />
      <ModelsSection />
    </div>
  );
}
