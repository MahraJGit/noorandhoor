import PropertyHero from "@/components/common/PropertyHero";
import PropertyCategories from "@/components/sections/property/PropertyCategories";
import OffPlanFeatured from "@/components/sections/offplan/OffPlanFeatured";
import PropertyJourneyCta from "@/components/sections/property/PropertyJourneyCta";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Off-Plan Properties in Dubai & UAE",
  description:
    "Explore 50+ off-plan projects in Dubai & UAE. Buy villas, apartments & penthouses directly from top developers with flexible 1–8 year payment plans.",
  path: "/off-plan",
});

export default function OffPlanPage() {
  return (
    <>
      <PropertyHero variant="offplan" />
      <PropertyCategories market="off-plan" />
      <OffPlanFeatured />
      <PropertyJourneyCta variant="offplan" secondaryExternal/>
    </>
  );
}
