import CategoryListingPage from "@/components/sections/buy-category/CategoryListingPage";
import { getCategory } from "@/components/sections/buy-category/categoryConfig";
import { buildPageMetadata } from "@/lib/seo";

const category = getCategory("villas");

export const metadata = buildPageMetadata({
  title: category.metaTitle,
  description: category.metaDescription,
  path: category.path,
});

export default function BuyVillasPage({ searchParams }) {
  return <CategoryListingPage categoryKey="villas" searchParams={searchParams} />;
}
