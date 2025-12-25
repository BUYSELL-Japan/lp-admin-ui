import Hero from './Hero';
import About from './About';
import Menu from './Menu';
import Pricing from './Pricing';
import CTA from './CTA';
import Gallery from './Gallery';
import Staff from './Staff';
import Reviews from './Reviews';
import News from './News';
import StoreInfo from './StoreInfo';
import Company from './Company';
import Access from './Access';
import FAQ from './FAQ';
import Contact from './Contact';

interface PreviewProps {
  sectionData: any;
}

export default function Preview({ sectionData }: PreviewProps) {
  return (
    <div className="h-screen overflow-y-auto bg-white relative">
      <div className="sticky top-0 z-0 bg-gray-800 text-white px-4 py-2 text-sm">
        プレビュー
      </div>
      <div>
        <Hero />
        <About />
        <Menu />
        <Pricing />
        <CTA />
        <Gallery />
        <Staff />
        <Reviews />
        <News />
        <StoreInfo />
        <Company />
        <Access />
        <FAQ />
        <Contact />
      </div>
    </div>
  );
}
