import OffPlanCategoryDetailPage from "@/components/sections/offplan/OffPlanCategoryDetailPage";
import { getOffPlanCategory } from "@/components/sections/offplan/offplanCategoryConfig";
import { generateListingItemMetadata } from "@/lib/seo";

const category = getOffPlanCategory("commercial");

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  return generateListingItemMetadata({ params, category });
}

export default async function OffPlanCommercialDetailPage({ params }) {
  return <OffPlanCategoryDetailPage categoryKey="commercial" params={params} />;
}
