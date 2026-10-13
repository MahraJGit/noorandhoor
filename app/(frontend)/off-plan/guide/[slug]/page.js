import OffPlanCategoryDetailPage from "@/components/sections/offplan/OffPlanCategoryDetailPage";
import { getOffPlanCategory } from "@/components/sections/offplan/offplanCategoryConfig";
import { generateListingItemMetadata } from "@/lib/seo";

const category = getOffPlanCategory("guide");

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  return generateListingItemMetadata({ params, category });
}

export default async function OffPlanGuideDetailPage({ params }) {
  return <OffPlanCategoryDetailPage categoryKey="guide" params={params} />;
}
