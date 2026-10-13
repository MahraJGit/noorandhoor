import PropertyDetailPage from "@/components/sections/property/PropertyDetailPage";
import { getRentCategory } from "@/components/sections/rent-properties/rentCategoryConfig";
import { generateListingItemMetadata } from "@/lib/seo";

const category = getRentCategory("properties");

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }) {
  return generateListingItemMetadata({ params, category });
}

export default async function RentPropertyDetailPage({ params }) {
  return <PropertyDetailPage market="rent" categoryKey="properties" params={params} />;
}
