import PropertyHero from "@/components/common/PropertyHero";
import PropertyCategories from "@/components/sections/buy/PropertyCategories";
import FeaturedBuyProperties from "@/components/sections/buy/FeaturedBuyProperties";
import MatchMaking from "@/components/sections/buy/MatchMaking";
import InvestmentMatrix from "@/components/sections/buy/InvestmentMatrix";
import PopularCommunities from "@/components/sections/buy/PopularCommunities";
import FinancialArchitecture from "@/components/sections/buy/FinancialArchitecture";
import BuyingProcess from "@/components/sections/buy/BuyingProcess";
import MarketInsights from "@/components/sections/buy/MarketInsights";
import TestimonialSection from "@/components/common/TestimonialSection";
import FaqSection from "@/components/common/FaqSection";
import TrustedDeveloperPartners from "@/components/sections/buy/TrustedDeveloperPartners";
import LeadGenerationForm from "@/components/sections/buy/LeadGenerationForm";
import PropertyJourneyCta from "@/components/sections/property/PropertyJourneyCta";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Buy Apartments, Villas & Penthouses in Dubai",
  description:
    "Browse 1000+ premium properties for sale in Dubai & UAE. Buy apartments, villas, townhouses & penthouses with expert guidance, even remotely from abroad.",
  path: "/buy",
});

export default function BuyPage() {
  return (
    <>
      <PropertyHero variant="buy" />
      <PropertyCategories market="buy" />
      <FeaturedBuyProperties />
      <MatchMaking />
      <InvestmentMatrix />
      <PopularCommunities />
      <FinancialArchitecture />
      <BuyingProcess />
      <MarketInsights />
      <TestimonialSection variant="buy" />
      <FaqSection variant="buy" />
      <TrustedDeveloperPartners />
      <LeadGenerationForm
        title="Let's Find Your Perfect Property"
        description="Tell us what you're looking for, and our property experts will help you find the right opportunity within 24 hours."
        showAgent={true}
      />
      <PropertyJourneyCta variant="buy" secondaryExternal/>
    </>
  );
}
