import RentCategoryListingPage from "@/components/sections/rent-properties/RentCategoryListingPage";
import { getRentCategory } from "@/components/sections/rent-properties/rentCategoryConfig";
import { buildPageMetadata } from "@/lib/seo";

const category = getRentCategory("dubai");

export const metadata = buildPageMetadata({
  title: category.metaTitle,
  description: category.metaDescription,
  path: category.path,
});

export default function RentDubaiPage({ searchParams }) {
  return <RentCategoryListingPage categoryKey="dubai" searchParams={searchParams} />;
}
