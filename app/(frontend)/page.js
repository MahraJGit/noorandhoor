import PropertyHero from "@/components/common/PropertyHero";
import FeaturedProperties from "@/components/sections/home/FeaturedProperties";
import CompanyStats from "@/components/sections/home/CompanyStats";
import TrustedPartners from "@/components/sections/home/TrustedPartners";
import Locations from "@/components/sections/home/Locations";
import About from "@/components/sections/home/About";
import OffPlanLaunches from "@/components/sections/home/OffPlanLaunches";
import Developers from "@/components/sections/home/Developers";
import NewProperties from "@/components/sections/home/NewProperties";
import RealEstateDevelopers from "@/components/sections/home/RealEstateDevelopers";
import Services from "@/components/sections/home/Services";
import ClientStories from "@/components/sections/home/ClientStories";
import TestimonialSection from "@/components/common/TestimonialSection";
import Commitments from "@/components/sections/home/Commitments";
import OurTeam from "@/components/sections/home/OurTeam";
import Features from "@/components/sections/home/Features";
import Blogs from "@/components/sections/home/Blogs";
import FaqSection from "@/components/common/FaqSection";
import ListYourProperty from "@/components/sections/home/ListYourProperty";
import GetStarted from "@/components/sections/home/GetStarted";
import { SITE_DESCRIPTION, SITE_NAME, buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildPageMetadata({
  title: `${SITE_NAME} | Explore Your Dream Property in UAE`,
  description: SITE_DESCRIPTION,
  path: "/",
});

export default function Home() {
  return (
    <>
      <PropertyHero variant="home" />
      <FeaturedProperties />
      <CompanyStats />
      <TrustedPartners />
      <Locations />
      <About />
      <OffPlanLaunches />
      <Developers />
      <NewProperties />
      <RealEstateDevelopers />
      <Services />
      <ClientStories />
      <TestimonialSection variant="home" />
      <Commitments />
      <OurTeam />
      <Features />
      <Blogs />
      <FaqSection variant="home" />
      <ListYourProperty />
      <GetStarted />
    </>
  );
}
