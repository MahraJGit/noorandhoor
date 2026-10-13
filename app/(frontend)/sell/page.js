import PropertyHero from "@/components/common/PropertyHero";
import PropertyCategories from "@/components/sections/property/PropertyCategories";
import FeaturedSellProperties from "@/components/sections/sell/FeaturedSellProperties";
import SellPropertyMatching from "@/components/sections/sell/SellPropertyMatching";
import SellingProcess from "@/components/sections/sell/SellingProcess";
import SellerInsights from "@/components/sections/sell/SellerInsights";
import PopularCommunities from "@/components/sections/buy/PopularCommunities";
import PropertyValueReturns from "@/components/sections/sell/PropertyValueReturns";
import TestimonialSection from "@/components/common/TestimonialSection";
import FaqSection from "@/components/common/FaqSection";
import TrustedDeveloperPartners from "@/components/sections/buy/TrustedDeveloperPartners";
import LeadGenerationForm from "@/components/sections/buy/LeadGenerationForm";
import PropertyJourneyCta from "@/components/sections/property/PropertyJourneyCta";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Sell Properties | Noor and Hoor",
  description:
    "A trusted network of serious buyers, expert pricing insight, and a seamless process from listing to sale.",
  path: "/sell",
});

export default function SellPage() {
  return (
    <>
      <PropertyHero variant="sell" />
      <PropertyCategories market="sell" />
      <FeaturedSellProperties />
      <SellPropertyMatching />
      <SellingProcess />
      <SellerInsights />
      <PopularCommunities />
      <PropertyValueReturns />
      <TestimonialSection variant="sell" />
      <FaqSection variant="sell" />
      <TrustedDeveloperPartners />
      <LeadGenerationForm
        title="Start Your Selling Journey"
        description="Fill out the form below and our team will get in touch to guide you through the next steps."
        showAgent={true}
      />
      <PropertyJourneyCta variant="sell" />
    </>
  );
}
