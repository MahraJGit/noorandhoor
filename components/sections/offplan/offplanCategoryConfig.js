import apartmentsImage from "@/public/images/buy/apartments.png";
import villasImage from "@/public/images/buy/villas.png";
import penthouseImage from "@/public/images/buy/penthouse.png";
import otherPropertiesImage from "@/public/images/buy/otherproperties.png";
import townhousesImage from "@/public/images/buy/townhouses.png";
import luxuryHome from "@/public/images/landingpage/LuxuryHome.png";
import propertyImg from "@/public/images/landingpage/propertyImg.png";
import carousel1 from "@/public/images/landingpage/landingpagecarousel1.jpg";
import carousel2 from "@/public/images/landingpage/landingpagecarousel2.jpg";
import carousel3 from "@/public/images/landingpage/landingpagecarousel3.jpg";
import carousel4 from "@/public/images/landingpage/landingpagecarousel4.jpg";
import starIcon from "@/public/images/buy/hero/star.svg";
import securityIcon from "@/public/images/buy/hero/security.png";
import googleLogo from "@/public/svgs/googlelogo.svg";
import { CONTACT_FORM_HREF } from "@/components/sections/contact/contactData";
import {
  INVESTMENT_GUIDE_DOWNLOAD_NAME,
  INVESTMENT_GUIDE_PDF,
} from "@/lib/siteAssets";

export const HOMES_PER_PAGE = 9;
export const TOTAL_PAGES = 3;

const TRUST_ICONS = [starIcon, securityIcon, googleLogo];

function trustSignals(items) {
  return items.map((lines, index) => ({
    icon: TRUST_ICONS[index % TRUST_ICONS.length],
    lines,
  }));
}

function heroActions(labels) {
  return labels.map((label, index) => {
    const isInvestmentGuide = label === "Investment Guide";
    return {
      label,
      variant: index === 0 ? "primary" : "outline",
      href: isInvestmentGuide ? INVESTMENT_GUIDE_PDF : CONTACT_FORM_HREF,
      ...(isInvestmentGuide
        ? { download: INVESTMENT_GUIDE_DOWNLOAD_NAME }
        : {}),
    };
  });
}

const UAE_LOCATIONS = [
  "Ajman, United Arab Emirates",
  "Dubai UAE",
  "Sharjah, United Arab Emirates",
  "Abu Dhabi, United Arab Emirates",
  "Al Zorah, Ajman",
];

const IMAGE_SETS = [
  [apartmentsImage, carousel1, propertyImg],
  [carousel2, apartmentsImage, luxuryHome],
  [carousel3, penthouseImage, otherPropertiesImage],
  [villasImage, carousel4, luxuryHome],
  [townhousesImage, apartmentsImage, carousel1],
  [penthouseImage, carousel2, propertyImg],
  [otherPropertiesImage, carousel3, luxuryHome],
  [luxuryHome, apartmentsImage, carousel4],
];

function buildHomes({ titles, slugs, locations = UAE_LOCATIONS }) {
  const count = HOMES_PER_PAGE * TOTAL_PAGES;
  return Array.from({ length: count }, (_, i) => {
    const title = titles[i % titles.length];
    return {
      id: i + 1,
      images: IMAGE_SETS[i % IMAGE_SETS.length],
      title,
      location: locations[i % locations.length],
      features: { bedroom: 6, bathroom: 2, area: 2900 },
      price: i % 6 === 5 ? 95000000 : 45000000,
      featured: i % 4 !== 3,
      slug: slugs[i % slugs.length],
    };
  });
}

function category(config) {
  return {
    ...config,
    eyebrow: config.eyebrow || "off plan Properties",
    homes: buildHomes({ titles: config.titles, slugs: config.slugs }),
  };
}

export const OFF_PLAN_CATEGORIES = {
  apartments: category({
    key: "apartments",
    path: "/off-plan/apartments",
    heading: "Apartments",
    breadcrumb: "Off plan apartments",
    heroTitle: "Reserve Your UAE Apartment Before It's Built",
    heroDescription:
      "Explore off-plan apartments in Dubai's fastest growing communities and buy directly from trusted developers before construction is complete.",
    metaTitle: "Off Plan Apartments in UAE | Noor and Hoor",
    metaDescription:
      "Explore off-plan apartments in Dubai's fastest growing communities and buy directly from trusted developers before construction is complete.",
    ctaHeading: "Want To Buy Before Prices Rise At Completion?",
    ctaDescription:
      "Secure your apartment early, with flexible payment plans and pre-launch pricing before construction is complete.",
    heroActions: heroActions([
      "Investment Guide",
      "Talk to an Apartment Specialist",
    ]),
    trustSignals: trustSignals([
      ["80+", "Off-Plan Apartment Projects"],
      ["1–7", "Years Handover Timeline Range"],
      ["10%", "Average Booking Deposit"],
    ]),
    titles: [
      "Palm Jumeirah Villa",
      "Spacious apartment",
      "Downtown apartment",
      "Two-bedroom with sauna",
      "Triplex apartment",
      "Al Zorah Beachfront Villa",
      "Two-bedroom with storage",
      "Loft conversion apartment",
      "Luxury apartment with pool",
      "New construction apartment",
    ],
    slugs: [
      "palm-jumeirah-villa",
      "spacious-apartment",
      "downtown-apartment",
      "two-bedroom-with-sauna",
      "triplex-apartment",
      "al-zorah-beachfront-villa",
      "two-bedroom-with-storage",
      "loft-conversion-apartment",
      "luxury-apartment-with-pool",
      "new-construction-apartment",
    ],
  }),
  villas: category({
    key: "villas",
    path: "/off-plan/villas",
    heading: "Villas",
    breadcrumb: "Off plan villas",
    heroTitle: "Reserve Your Future Villa In UAE",
    heroDescription:
      "Browse off-plan villas across Dubai's most exclusive communities, purchased directly from trusted developers before construction is complete.",
    metaTitle: "Off Plan Villas in UAE | Noor and Hoor",
    metaDescription:
      "Browse off-plan villas across Dubai's most exclusive communities, purchased directly from trusted developers before construction is complete.",
    ctaHeading: "Ready To Reserve Your Off-Plan Villa?",
    ctaDescription:
      "Secure your villa early, with flexible payment plans and the chance to customize your future home before it's built.",
    heroActions: heroActions([
      "Investment Guide",
      "Download Payment Plan Guide",
    ]),
    trustSignals: trustSignals([
      ["20+", "Off-Plan Villa Projects"],
      ["10–70%", "Booking to Handover Payment Structure"],
      ["3–5 Years", "Average Construction Timeline"],
    ]),
    titles: [
      "Palm Jumeirah Villa",
      "Al Zorah Beachfront Villa",
      "Garden Villa",
      "Independent Villa With Pool",
    ],
    slugs: [
      "palm-jumeirah-villa",
      "al-zorah-beachfront-villa",
      "garden-villa",
      "independent-villa-with-pool",
    ],
  }),
  commercial: category({
    key: "commercial",
    path: "/off-plan/commercial",
    heading: "Commercial",
    breadcrumb: "Off plan commercial",
    heroTitle: "Invest In Dubai's Commercial Future",
    heroDescription:
      "Discover off-plan commercial projects in Dubai's leading business areas and invest directly with trusted developers before completion.",
    metaTitle: "Off Plan Commercial | Noor and Hoor",
    metaDescription:
      "Discover off-plan commercial projects in Dubai's leading business areas and invest directly with trusted developers before completion.",
    ctaHeading: "Want To Secure Prime Commercial Space Early?",
    ctaDescription:
      "Secure your commercial space early, with flexible payment plans and pre-launch pricing before construction is complete.",
    heroActions: heroActions([
      "Investment Guide",
      "Talk to a Commercial Specialist",
    ]),
    trustSignals: trustSignals([
      ["30+", "Off-Plan Commercial Projects"],
      ["2–6", "Years Handover Timeline Range"],
      ["20%", "Average Booking Deposit"],
    ]),
    titles: [
      "Downtown Commercial",
      "Mixed-Use Residence",
      "Waterfront Commercial",
      "City Commercial Suite",
    ],
    slugs: [
      "downtown-commercial",
      "mixed-use-residence",
      "waterfront-commercial",
      "city-commercial-suite",
    ],
  }),
  penthouses: category({
    key: "penthouses",
    path: "/off-plan/penthouses",
    heading: "Penthouse",
    breadcrumb: "Off plan penthouses",
    heroTitle: "Own Dubai's Skyline From Above",
    heroDescription:
      "Find luxury off-plan penthouses across Dubai's famous towers and waterfront addresses, purchased directly from trusted developers before completion.",
    metaTitle: "Off Plan Penthouses in UAE | Noor and Hoor",
    metaDescription:
      "Find luxury off-plan penthouses across Dubai's famous towers and waterfront addresses, purchased directly from trusted developers before completion.",
    ctaHeading: "Ready To Claim Your Place Above The City?",
    ctaDescription:
      "Whether you're seeking a private sky sanctuary or a landmark investment, we connect you with penthouses still in the earliest, most exclusive stage of development.",
    heroActions: heroActions([
      "Investment Guide",
      "Talk to a Penthouse Specialist",
    ]),
    trustSignals: trustSignals([
      ["40+", "Off-Plan Penthouse Listings"],
      ["3–5", "Years Handover Timeline Range"],
      ["10%", "Average Booking Deposit"],
    ]),
    titles: [
      "Skyline Penthouse",
      "Duplex Penthouse",
      "Marina View Penthouse",
      "Terrace Penthouse",
    ],
    slugs: [
      "skyline-penthouse",
      "duplex-penthouse",
      "marina-view-penthouse",
      "terrace-penthouse",
    ],
  }),
  townhouses: category({
    key: "townhouses",
    path: "/off-plan/townhouses",
    heading: "Townhouse",
    breadcrumb: "Off plan townhouses",
    heroTitle: "Find Your Family's Future Home In UAE",
    heroDescription:
      "Discover new off-plan townhouses in Dubai's most desirable family communities, secured directly from trusted developers before completion.",
    metaTitle: "Off Plan Townhouses in UAE | Noor and Hoor",
    metaDescription:
      "Discover new off-plan townhouses in Dubai's most desirable family communities, secured directly from trusted developers before completion.",
    ctaHeading: "Looking For A Home That Grows With You?",
    ctaDescription:
      "Reserve your townhouse ahead of launch, with flexible payment plans and early pricing before construction begins.",
    heroActions: heroActions([
      "Investment Guide",
      "Talk to a Townhouse Specialist",
    ]),
    trustSignals: trustSignals([
      ["250+", "Off-Plan Townhouse Listings"],
      ["2–4", "Years Handover Timeline Range"],
      ["10%", "Average Booking Deposit"],
    ]),
    titles: [
      "Spacious Townhouse",
      "Marina Townhouse",
      "Family Townhouse With Garden",
      "Corner Townhouse",
    ],
    slugs: [
      "spacious-townhouse",
      "marina-townhouse",
      "family-townhouse-with-garden",
      "corner-townhouse",
    ],
  }),
  guide: category({
    key: "guide",
    path: "/off-plan/guide",
    heading: "Off Plan Guide",
    breadcrumb: "Off plan guide",
    heroTitle: "Your Complete Guide To Buying Off-Plan In The UAE",
    heroDescription:
      "Everything you need to know about buying off-plan in the UAE, from payment plans to handover, plus featured properties to get you started.",
    metaTitle: "Off Plan Guide | Noor and Hoor",
    metaDescription:
      "Everything you need to know about buying off-plan in the UAE, from payment plans to handover, plus featured properties to get you started.",
    ctaHeading: "Still Figuring Out How Off-Plan Works?",
    ctaDescription:
      "Get clear answers on payment plans, handover timelines, and developer reliability before you commit to anything.",
    heroActions: heroActions([
      "Investment Guide",
      "Talk to an off-plan specialist",
    ]),
    trustSignals: trustSignals([
      ["50+", "Off-Plan Projects Featured"],
      ["500+", "Buyers Guided Successfully"],
      ["10–30%", "Typical Booking Deposit Range"],
    ]),
    titles: [
      "Spacious apartment",
      "Palm Jumeirah Villa",
      "Downtown apartment",
      "Luxury apartment with pool",
    ],
    slugs: [
      "spacious-apartment",
      "palm-jumeirah-villa",
      "downtown-apartment",
      "luxury-apartment-with-pool",
    ],
  }),
};

export function getOffPlanCategory(key) {
  return OFF_PLAN_CATEGORIES[key];
}

function uniqueHomes(category) {
  return [...new Map(category.homes.map((item) => [item.slug, item])).values()].map(
    (item) => ({ ...item, basePath: category.path })
  );
}

export function getRelatedOffPlanHomes(category, currentSlug, count = 4) {
  const related = uniqueHomes(category).filter((item) => item.slug !== currentSlug);

  if (related.length >= count) return related.slice(0, count);

  const extras = Object.values(OFF_PLAN_CATEGORIES)
    .filter((item) => item.key !== category.key)
    .flatMap(uniqueHomes);

  const seen = new Set(related.map((item) => `${item.basePath}/${item.slug}`));
  for (const item of extras) {
    const key = `${item.basePath}/${item.slug}`;
    if (seen.has(key)) continue;
    related.push(item);
    seen.add(key);
    if (related.length >= count) break;
  }

  return related.slice(0, count);
}
