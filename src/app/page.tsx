import { Header } from "@/components/header";
import { PromoBanner } from "@/components/promo-banner";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Pricing } from "@/components/pricing";
import { Calculator } from "@/components/calculator";
import { Testimonials } from "@/components/testimonials";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <PromoBanner />
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Pricing />
        <Calculator />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
