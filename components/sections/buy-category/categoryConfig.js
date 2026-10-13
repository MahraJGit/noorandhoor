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

const TRUST_ICONS = [starIcon, securityIcon, googleLogo];

function trustSignals(items) {
  return items.map((lines, index) => ({
    icon: TRUST_ICONS[index % TRUST_ICONS.length],
    lines,
  }));
}

const SHARED_IMAGES = [
  apartmentsImage,
  villasImage,
  penthouseImage,
  otherPropertiesImage,
  townhousesImage,
  luxuryHome,
  propertyImg,
  carousel1,
  carousel2,
  carousel3,
  carousel4,
];

function buildHomes({ titles, imageSets, slugs, locations }) {
  return Array.from({ length: 24 }, (_, i) => {
    const title = titles[i % titles.length];
    const images = imageSets[i % imageSets.length];
    const location = locations[i % locations.length];
    return {
      id: i + 1,
      images,
      title,
      location,
      features: { bedroom: 6, bathroom: 2, area: 2900 },
      price: 45000000,
      featured: i % 3 === 0,
      slug: slugs[i % slugs.length],
    };
  });
}

const UAE_LOCATIONS = [
  "Ajman, United Arab Emirates",
  "Dubai, United Arab Emirates",
  "Sharjah, United Arab Emirates",
  "Abu Dhabi, United Arab Emirates",
];

export const BUY_CATEGORIES = {
  apartments: {
    key: "apartments",
    path: "/buy/apartments",
    breadcrumb: "Buy apartments",
    eyebrow: "Buy Apartments",
    heading: "Apartments",
    heroTitle: "Find Your Perfect Apartment In The UAE",
    heroDescription:
      "Whether you're buying your first home or expanding your portfolio, discover UAE apartments that fit your vision and budget.",
    metaTitle: "Apartments for Sale in Dubai & UAE",
    metaDescription:
      "Browse apartments for sale in Dubai & UAE. From first homes to investment units, find the right apartment with expert guidance from Noor and Hoor Properties.",
    ctaHeading: "Ready to Find Your Ideal Apartment in the UAE?",
    ctaDescription:
      "Browse our curated listings and talk to our team — your perfect apartment is closer than you think.",
    trustSignals: trustSignals([
      ["15%+", "Average Annual ROI"],
      ["150+", "Happy Apartment Owners"],
      ["98%", "On-Time Handovers"],
    ]),
    filterPrefix: "apt",
    propertyTypes: ["Home", "Studio", "Duplex", "Serviced", "Luxury Residences"],
    homes: buildHomes({
      titles: [
        "Spacious Apartment",
        "Downtown Apartment",
        "Two-Bedroom With Sauna",
        "Triplex Apartment",
      ],
      imageSets: [
        [apartmentsImage, carousel1, propertyImg],
        [carousel2, apartmentsImage, luxuryHome],
        [carousel3, penthouseImage, otherPropertiesImage],
        [villasImage, carousel4, luxuryHome],
        [townhousesImage, apartmentsImage, carousel1],
        [penthouseImage, carousel2, propertyImg],
        [otherPropertiesImage, carousel3, luxuryHome],
        [luxuryHome, apartmentsImage, carousel4],
      ],
      slugs: [
        "spacious-apartment-with-parking",
        "downtown-apartment",
        "two-bedroom-with-sauna",
        "triplex-apartment",
      ],
      locations: UAE_LOCATIONS,
    }),
  },
  townhouses: {
    key: "townhouses",
    path: "/buy/townhouses",
    breadcrumb: "Buy town houses",
    eyebrow: "Buy Town Houses",
    heading: "Townhouses",
    heroTitle: "Find Your Ideal Townhouses In The UAE",
    heroDescription:
      "More space, more privacy, more room to grow. Discover townhouses designed for families who want a home, not just an apartment.",
    metaTitle: "Dubai Townhouses for Sale | 2, 3 & 4 Bedroom",
    metaDescription:
      "Looking for a family home with more space? Explore townhouses for sale in Dubai's best communities, with expert guidance and remote buying support.",
    ctaHeading: "Ready to Find Your Family's Next Home?",
    ctaDescription:
      "Explore townhouses built for space and community, and talk to our team to get started.",
    trustSignals: trustSignals([
      ["13%+", "Average Annual ROI"],
      ["200+", "Families Settled"],
      ["96%", "Client Satisfaction Rate"],
    ]),
    filterPrefix: "th",
    propertyTypes: ["Townhouse", "End Unit", "Corner", "Luxury Townhouse"],
    homes: buildHomes({
      titles: [
        "Spacious Townhouse",
        "Marina Townhouse",
        "Family Townhouse With Garden",
        "Corner Townhouse",
      ],
      imageSets: [
        [townhousesImage, carousel1, propertyImg],
        [carousel2, townhousesImage, luxuryHome],
        [carousel3, villasImage, otherPropertiesImage],
        [apartmentsImage, carousel4, luxuryHome],
        [townhousesImage, apartmentsImage, carousel1],
        [villasImage, carousel2, propertyImg],
        [otherPropertiesImage, carousel3, luxuryHome],
        [luxuryHome, townhousesImage, carousel4],
      ],
      slugs: [
        "spacious-townhouse-with-garden",
        "marina-townhouse",
        "family-townhouse-with-garden",
        "corner-townhouse",
      ],
      locations: UAE_LOCATIONS,
    }),
  },
  penthouses: {
    key: "penthouses",
    path: "/buy/penthouses",
    breadcrumb: "Penthouses",
    eyebrow: "Buy Penthouses",
    heading: "Penthouses",
    heroTitle: "Own The Top Floor Of The UAE",
    heroDescription:
      "Unmatched views, private elevators, and space that redefines luxury. Discover penthouses built for those who expect nothing less than the best.",
    metaTitle: "Dubai Penthouses for Sale | Noor and Hoor Properties",
    metaDescription:
      "Find your dream penthouse in Dubai & UAE. Private terraces, panoramic views and premium finishes. Remote buying support available for overseas buyers.",
    ctaHeading: "Ready to Own the View Everyone Else Is Chasing?",
    ctaDescription:
      "Explore penthouses built for those who settle for nothing less, and talk to our team today.",
    trustSignals: trustSignals([
      ["18%+", "Average Annual ROI"],
      ["80+", "Penthouses Sold"],
      ["99%", "Client Satisfaction Rate"],
    ]),
    filterPrefix: "ph",
    propertyTypes: ["Penthouse", "Duplex Penthouse", "Sky Villa", "Luxury Penthouse"],
    homes: buildHomes({
      titles: [
        "Skyline Penthouse",
        "Duplex Penthouse",
        "Marina View Penthouse",
        "Terrace Penthouse",
      ],
      imageSets: [
        [penthouseImage, carousel1, propertyImg],
        [carousel2, penthouseImage, luxuryHome],
        [carousel3, apartmentsImage, otherPropertiesImage],
        [villasImage, carousel4, luxuryHome],
        [penthouseImage, apartmentsImage, carousel1],
        [townhousesImage, carousel2, propertyImg],
        [otherPropertiesImage, carousel3, luxuryHome],
        [luxuryHome, penthouseImage, carousel4],
      ],
      slugs: [
        "skyline-penthouse",
        "duplex-penthouse",
        "marina-view-penthouse",
        "terrace-penthouse",
      ],
      locations: UAE_LOCATIONS,
    }),
  },
  villas: {
    key: "villas",
    path: "/buy/villas",
    breadcrumb: "Residential villas",
    eyebrow: "Buy Residential Villas",
    heading: "Villas",
    heroTitle: "Find Your Family's Forever Home In The UAE",
    heroDescription:
      "Private gardens, extra space, and a neighborhood built for living, not just visiting. Discover villas designed for families who want room to grow.",
    metaTitle: "Buy Residential Villas | Noor and Hoor",
    metaDescription:
      "Private gardens, extra space, and a neighborhood built for living, not just visiting. Discover villas designed for families who want room to grow.",
    ctaHeading: "Ready to Find Your Family's Forever Home?",
    ctaDescription:
      "Explore villas built for space, privacy, and community, and talk to our team to get started.",
    trustSignals: trustSignals([
      ["14%+", "Average Annual ROI"],
      ["250+", "Families Settled"],
      ["97%", "Client Satisfaction Rate"],
    ]),
    filterPrefix: "villa",
    propertyTypes: ["Villa", "Independent Villa", "Garden Villa", "Luxury Villa"],
    homes: buildHomes({
      titles: [
        "Luxury Villa",
        "Garden Villa",
        "Independent Villa With Pool",
        "Family Villa",
      ],
      imageSets: [
        [villasImage, carousel1, propertyImg],
        [carousel2, villasImage, luxuryHome],
        [carousel3, townhousesImage, otherPropertiesImage],
        [apartmentsImage, carousel4, luxuryHome],
        [villasImage, apartmentsImage, carousel1],
        [penthouseImage, carousel2, propertyImg],
        [otherPropertiesImage, carousel3, luxuryHome],
        [luxuryHome, villasImage, carousel4],
      ],
      slugs: [
        "luxury-villa-with-pool",
        "garden-villa",
        "independent-villa-with-pool",
        "family-villa",
      ],
      locations: UAE_LOCATIONS,
    }),
  },
  properties: {
    key: "properties",
    path: "/buy/properties",
    breadcrumb: "Buy properties",
    eyebrow: "Buy Properties",
    heading: "Properties",
    heroTitle: "Explore UAE's Full Property Market In One Place",
    heroDescription:
      "Apartments, villas, townhouses, and penthouses, all under one roof. Discover a property that matches your goals, whichever type you're looking for.",
    metaTitle: "Buy Properties | Noor and Hoor",
    metaDescription:
      "Apartments, villas, townhouses, and penthouses, all under one roof. Discover a property that matches your goals, whichever type you're looking for.",
    ctaHeading: "Ready to Explore the UAE's Full Property Market?",
    ctaDescription:
      "Search apartments, villas, townhouses, and more, and talk to our team to get started.",
    trustSignals: trustSignals([
      ["15%+", "Average Portfolio ROI"],
      ["1000+", "Properties Listed"],
      ["98%", "Client Satisfaction Rate"],
    ]),
    filterPrefix: "prop",
    propertyTypes: ["Apartment", "Villa", "Townhouse", "Penthouse", "Commercial"],
    homes: buildHomes({
      titles: [
        "Premium Property",
        "Investment Property",
        "Waterfront Property",
        "City Property",
      ],
      imageSets: [
        [otherPropertiesImage, carousel1, propertyImg],
        [carousel2, apartmentsImage, luxuryHome],
        [carousel3, villasImage, otherPropertiesImage],
        [townhousesImage, carousel4, luxuryHome],
        [penthouseImage, apartmentsImage, carousel1],
        [villasImage, carousel2, propertyImg],
        [otherPropertiesImage, carousel3, luxuryHome],
        [luxuryHome, otherPropertiesImage, carousel4],
      ],
      slugs: [
        "premium-property",
        "investment-property",
        "waterfront-property",
        "city-property",
      ],
      locations: UAE_LOCATIONS,
    }),
  },
};

export const HOMES_PER_PAGE = 9;
export const TOTAL_PAGES = 3;

export function getCategory(key) {
  return BUY_CATEGORIES[key];
}

export { SHARED_IMAGES };
