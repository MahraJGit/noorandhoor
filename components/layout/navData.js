import {
  IconApartments,
  IconTownhouses,
  IconPenthouses,
  IconVillas,
  IconProperties,
  IconResidential,
  IconListProperty,
  // IconGuide,
} from "@/components/layout/navIcons";

// const RENT_NAV_ITEM = {
//   label: "Rent",
//   href: "/rent",
//   links: [
//     {
//       label: "Properties rent",
//       href: "/rent/properties",
//       Icon: IconProperties,
//     },
//     {
//       label: "Apartment rent",
//       href: "/rent/apartments",
//       Icon: IconApartments,
//     },
//     { label: "House rent", href: "/rent/houses", Icon: IconVillas },
//     {
//       label: "Renting in Dubai",
//       href: "/rent/dubai",
//       Icon: IconResidential,
//     },
//   ],
// };
// 
// const SELL_NAV_ITEM = {
//   label: "Sell",
//   href: "/sell",
//   links: [
//     {
//       label: "Noor & Hoor Properties",
//       href: "/sell/noor-hoor",
//       Icon: IconResidential,
//     },
//     {
//       label: "Selling Properties",
//       href: "/sell/properties",
//       Icon: IconListProperty,
//     },
//     {
//       label: "Selling Apartment",
//       href: "/sell/apartments",
//       Icon: IconApartments,
//     },
//   ],
// };

export const NAV_ITEMS = [
  {
    label: "Buy",
    href: "/buy",
    links: [
      { label: "Buy Apartments", href: "/buy/apartments", Icon: IconApartments },
      { label: "Buy Town houses", href: "/buy/townhouses", Icon: IconTownhouses },
      { label: "Penthouses", href: "/buy/penthouses", Icon: IconPenthouses },
      { label: "Residential Villas", href: "/buy/villas", Icon: IconVillas },
      { label: "Buy Properties", href: "/buy/properties", Icon: IconProperties },
    ],
  },
  // Hidden from header/footer for now; rent/sell pages still use these items
  // RENT_NAV_ITEM,
  // SELL_NAV_ITEM,
  {
    label: "Off Plan",
    href: "/off-plan",
    links: [
      { label: "Villas", href: "/off-plan/villas", Icon: IconVillas },
      { label: "Apartments", href: "/off-plan/apartments", Icon: IconApartments },
      {
        label: "Commercial",
        href: "/off-plan/commercial",
        Icon: IconResidential,
      },
      { label: "Penthouse", href: "/off-plan/penthouses", Icon: IconPenthouses },
      { label: "Townhouse", href: "/off-plan/townhouses", Icon: IconTownhouses },
      // { label: "Off plan guide", href: "/off-plan/guide", Icon: IconGuide },
    ],
  },
  {
    label: "Developers",
    href: "/developers",
    footerCta: "View all developers",
    footerCtaHref: "/developers#developer-listings",
  },
  {
    label: "Blog",
    href: "/blog",
    footerCta: "View all articles",
    footerCtaHref: "/blog#blog-listings",
  },
  {
    label: "About",
    href: "/about-us",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

// const HIDDEN_NAV_ITEMS = [RENT_NAV_ITEM, SELL_NAV_ITEM];

export function navItemByHref(href) {
  return (
    NAV_ITEMS.find((item) => item.href === href)
    // || HIDDEN_NAV_ITEMS.find((item) => item.href === href)
  );
}
