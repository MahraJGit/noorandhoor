import OffPlanListingPage from "@/components/sections/offplan/OffPlanListingPage";
import { getOffPlanCategory } from "@/components/sections/offplan/offplanCategoryConfig";
import { buildPageMetadata } from "@/lib/seo";

const category = getOffPlanCategory("penthouses");

export const metadata = buildPageMetadata({
  title: category.metaTitle,
  description: category.metaDescription,
  path: category.path,
});

export default function OffPlanPenthousesPage({ searchParams }) {
  return <OffPlanListingPage categoryKey="penthouses" searchParams={searchParams} />;
}
