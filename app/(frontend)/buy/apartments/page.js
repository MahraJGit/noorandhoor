import CategoryListingPage from "@/components/sections/buy-category/CategoryListingPage";
import { getCategory } from "@/components/sections/buy-category/categoryConfig";
import { buildPageMetadata } from "@/lib/seo";

const category = getCategory("apartments");

export const metadata = buildPageMetadata({
  title: category.metaTitle,
  description: category.metaDescription,
  path: category.path,
});

export default function BuyApartmentsPage({ searchParams }) {
  return <CategoryListingPage categoryKey="apartments" searchParams={searchParams} />;
}
