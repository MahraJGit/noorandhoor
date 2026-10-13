import SellCategoryListingPage from "@/components/sections/sell-properties/SellCategoryListingPage";
import { getSellCategory } from "@/components/sections/sell-properties/sellCategoryConfig";
import { buildPageMetadata } from "@/lib/seo";

const category = getSellCategory("noor-hoor");

export const metadata = buildPageMetadata({
  title: category.metaTitle,
  description: category.metaDescription,
  path: category.path,
});

export default function SellNoorHoorPage({ searchParams }) {
  return <SellCategoryListingPage categoryKey="noor-hoor" searchParams={searchParams} />;
}
