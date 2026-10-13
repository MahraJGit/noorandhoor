import RentCategoryListingPage from "@/components/sections/rent-properties/RentCategoryListingPage";
import { getRentCategory } from "@/components/sections/rent-properties/rentCategoryConfig";
import { buildPageMetadata } from "@/lib/seo";

const category = getRentCategory("houses");

export const metadata = buildPageMetadata({
  title: category.metaTitle,
  description: category.metaDescription,
  path: category.path,
});

export default function RentHousesPage({ searchParams }) {
  return <RentCategoryListingPage categoryKey="houses" searchParams={searchParams} />;
}
