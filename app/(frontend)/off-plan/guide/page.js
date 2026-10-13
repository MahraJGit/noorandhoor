import OffPlanListingPage from "@/components/sections/offplan/OffPlanListingPage";
import { getOffPlanCategory } from "@/components/sections/offplan/offplanCategoryConfig";
import { buildPageMetadata } from "@/lib/seo";

const category = getOffPlanCategory("guide");

export const metadata = buildPageMetadata({
  title: category.metaTitle,
  description: category.metaDescription,
  path: category.path,
});

export default function OffPlanGuidePage({ searchParams }) {
  return <OffPlanListingPage categoryKey="guide" searchParams={searchParams} />;
}
