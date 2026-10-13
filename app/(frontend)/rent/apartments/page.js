import RentCategoryListingPage from "@/components/sections/rent-properties/RentCategoryListingPage";
import { getRentCategory } from "@/components/sections/rent-properties/rentCategoryConfig";
import { buildPageMetadata } from "@/lib/seo";

const category = getRentCategory("apartments");

export const metadata = buildPageMetadata({
  title: category.metaTitle,
  description: category.metaDescription,
  path: category.path,
});

export default function RentApartmentsPage({ searchParams }) {
  return <RentCategoryListingPage categoryKey="apartments" searchParams={searchParams} />;
}
