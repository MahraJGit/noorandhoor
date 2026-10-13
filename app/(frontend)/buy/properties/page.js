import CategoryListingPage from "@/components/sections/buy-category/CategoryListingPage";
import { getCategory } from "@/components/sections/buy-category/categoryConfig";
import { buildPageMetadata } from "@/lib/seo";

const category = getCategory("properties");

export const metadata = buildPageMetadata({
  title: category.metaTitle,
  description: category.metaDescription,
  path: category.path,
});

export default function BuyPropertiesPage({ searchParams }) {
  return <CategoryListingPage categoryKey="properties" searchParams={searchParams} />;
}
