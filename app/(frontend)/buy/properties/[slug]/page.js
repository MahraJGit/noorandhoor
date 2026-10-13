import CategoryDetailPage from "@/components/sections/buy-category/CategoryDetailPage";
import { getCategory } from "@/components/sections/buy-category/categoryConfig";
import { generateListingItemMetadata } from "@/lib/seo";

const category = getCategory("properties");

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  return generateListingItemMetadata({ params, category });
}

export default async function BuyPropertyDetailPage({ params }) {
  return <CategoryDetailPage categoryKey="properties" params={params} />;
}
