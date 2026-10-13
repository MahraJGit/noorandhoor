import OffPlanListingPage from "@/components/sections/offplan/OffPlanListingPage";
import { getOffPlanCategory } from "@/components/sections/offplan/offplanCategoryConfig";
import { buildPageMetadata } from "@/lib/seo";

const category = getOffPlanCategory("villas");

export const metadata = buildPageMetadata({
  title: category.metaTitle,
  description: category.metaDescription,
  path: category.path,
});

export default function OffPlanVillasPage({ searchParams }) {
  return <OffPlanListingPage categoryKey="villas" searchParams={searchParams} />;
}
