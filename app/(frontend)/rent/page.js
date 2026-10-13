import PropertyHero from "@/components/common/PropertyHero";
import PropertyCategories from "@/components/sections/property/PropertyCategories";
import FeaturedRentals from "@/components/sections/rent/FeaturedRentals";
import PrimeLocations from "@/components/sections/rent/PrimeLocations";
import RentalMatrix from "@/components/sections/rent/RentalMatrix";
import RentalMatchMaking from "@/components/sections/rent/RentalMatchMaking";
import TopRentalCommunities from "@/components/sections/rent/TopRentalCommunities";
import RentalAffordability from "@/components/sections/rent/RentalAffordability";
import RentingProcess from "@/components/sections/rent/RentingProcess";
import MarketInsights from "@/components/sections/buy/MarketInsights";
import TestimonialSection from "@/components/common/TestimonialSection";
import FaqSection from "@/components/common/FaqSection";
import TrustedDeveloperPartners from "@/components/sections/buy/TrustedDeveloperPartners";
import LeadGenerationForm from "@/components/sections/buy/LeadGenerationForm";
import PropertyJourneyCta from "@/components/sections/property/PropertyJourneyCta";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Rent Properties | Noor and Hoor",
  description:
    "We connect you with verified landlords and quality rentals across the UAE, making renting simple and stress-free.",
  path: "/rent",
});

export default function RentPage() {
  return (
    <>
      <PropertyHero variant="rent" />
      <PropertyCategories market="rent" />
      <FeaturedRentals />
      <PrimeLocations />
      <RentalMatrix />
      <RentalMatchMaking />
      <TopRentalCommunities />
      <RentalAffordability />
      <RentingProcess />
      <MarketInsights />
      <TestimonialSection variant="rent" />
      <FaqSection variant="rent" />
      <TrustedDeveloperPartners />
      <LeadGenerationForm showAgent={true} />
      <PropertyJourneyCta variant="rent" />
    </>
  );
}
