import Image from "next/image";
import { CircleCheck } from "lucide-react";
import starIcon from "@/public/images/buy/hero/star.svg";
import securityIcon from "@/public/images/buy/hero/security.png";
import googleLogo from "@/public/svgs/googlelogo.svg";
import Button from "@/components/ui/Button";
import HeroFilters from "@/components/common/HeroFilters";
import HeroBackgroundCarousel, {
  HeroCarouselDots,
} from "@/components/ui/HeroBackgroundCarousel";
import { CONTACT_INFO } from "@/components/sections/contact/contactData";
import { buildPropertyFilterFields } from "@/lib/listingFilters";
import {
  INVESTMENT_GUIDE_DOWNLOAD_NAME,
  INVESTMENT_GUIDE_PDF,
} from "@/lib/siteAssets";

const STANDARD_TRUST_SIGNALS = [
  { icon: starIcon, lines: ["Rated 4.95 by", "Global Investors"] },
  { icon: securityIcon, lines: ["150+ Partners", "Registered"] },
  { icon: googleLogo, lines: ["Over AED 120+", "transacted"] },
];

const DEFAULT_ACTIONS = [
  {
    label: "Investment Guide",
    variant: "primary",
    href: INVESTMENT_GUIDE_PDF,
    download: INVESTMENT_GUIDE_DOWNLOAD_NAME,
  },
];

const HOME_FEATURES = [
  "Serving UAE Clients",
  "Home & Business Experts",
  "Trusted Property Guides",
];

const PROPERTY_FILTER_VARIANTS = new Set([
  "home",
  "buy",
  "rent",
  "sell",
  "offplan",
]);

const PRESETS = {
  home: {
    title: "Explore Your Dream Property in UAE",
    description:
      "Your trusted UAE real estate firm offers expert guidance for property buying, selling, and investment.",
    features: HOME_FEATURES,
    trustSignals: [
      { icon: starIcon, lines: ["25+", "Trusted Developer Partners"] },
      { icon: securityIcon, lines: ["800+", "Keys Handed Over"] },
      { icon: googleLogo, lines: ["90%", "Repeat & Referral Clients"] },
    ],
  },
  buy: {
    title: "Build Your Future on the UAE's Prime Real Estate",
    description:
      "Discover, compare, and secure premium UAE properties that support your lifestyle and long term investment goals.",
    trustSignals: [
      { icon: starIcon, lines: ["1000+", "Premium Properties"] },
      { icon: securityIcon, lines: ["Trusted Developer", "Network"] },
      { icon: googleLogo, lines: ["Smart Investment", "Opportunities"] },
    ],
  },
  rent: {
    title: "Your Trusted Partner for Renting Property in UAE",
    description:
      "We connect you with verified landlords and quality rentals across the UAE, making renting simple and stress-free.",
    trustSignals: [
      { icon: starIcon, lines: ["900+", "Verified Rental Properties"] },
      { icon: securityIcon, lines: ["Prime Locations", "Across the UAE"] },
      { icon: googleLogo, lines: ["Complete", "Rental Support"] },
    ],
  },
  sell: {
    title: "Turn Your UAE Property Into Your Next Smart Move",
    description:
      "A trusted network of serious buyers, expert pricing insight, and a seamless process from listing to sale.",
    trustSignals: [
      { icon: starIcon, lines: ["30", "Days to Sell"] },
      { icon: securityIcon, lines: ["400+", "Properties Sold"] },
      { icon: googleLogo, lines: ["95%", "Seller Satisfaction Rate"] },
    ],
  },
  offplan: {
    title: "Discover Off-Plan Opportunities in UAE",
    description:
      "Buy directly from trusted developers, secure flexible payment plans, and invest in tomorrow's most popular locations before they're built.",
    trustSignals: [
      { icon: starIcon, lines: ["50+", "Off-Plan Projects Available"] },
      { icon: securityIcon, lines: ["1–8 Years", "Flexible Payment Plans"] },
      { icon: googleLogo, lines: ["15%", "Average Booking Deposit"] },
    ],
  },
  developers: {
    title: "Discover the Names Behind the UAE's Most Iconic Developments",
    description:
      "Meet the trusted developers building landmark communities, luxury residences, and the UAE's highest value opportunities.",
    trustSignals: [
      { icon: starIcon, lines: ["75+", "Trusted Developers"] },
      { icon: securityIcon, lines: ["150+", "Iconic Projects Delivered"] },
      { icon: googleLogo, lines: ["20+", "Years of Development Expertise"] },
    ],
  },
  contact: {
    title: "Get in touch with our experts",
    description:
      "Have questions about buying, selling, renting, or investing in Dubai? Talk to our experts for reliable guidance and support tailored to your needs.",
    actions: [
      {
        label: "Send a Message",
        variant: "primary",
        href: CONTACT_INFO.whatsappHref,
      },
      {
        label: "Call Our Team",
        variant: "outline",
        href: CONTACT_INFO.phoneHref,
      },
    ],
    trustSignals: [
      { icon: starIcon, lines: ["UAE-Wide", "Property Expertise"] },
      { icon: securityIcon, lines: ["500+", "Successful Transactions"] },
      { icon: googleLogo, lines: ["1,000+", "Properties Handled"] },
    ],
  },
  about: {
    title: "About Us",
    description:
      "Noor & Hoor Properties opens doors across the UAE, pairing sharp market insight with honest, personal guidance on every property journey.",
    trustSignals: [
      { icon: starIcon, lines: ["10+", "Years Combined Team Experience"] },
      { icon: securityIcon, lines: ["500+", "Properties Successfully Listed"] },
      { icon: googleLogo, lines: ["25+", "Verified Developer Partnerships"] },
    ],
  },
  blog: {
    title: "Blogs & Insights That Keep You Ahead",
    description:
      "Stay ahead with the latest market trends, buying tips, and neighbourhood guides from Noor & Hoor Properties.",
    actions: [
      {
        label: "Explore All Articles",
        variant: "primary",
        href: "#blog-listings",
      },
    ],
    trustSignals: [
      { icon: starIcon, lines: ["50+", "Neighbourhoods Covered"] },
      { icon: securityIcon, lines: ["Weekly", "New Market Updates"] },
      { icon: googleLogo, lines: ["10K+", "Monthly Readers"] },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    description: "",
    actions: [],
    trustSignals: [],
    showDots: false,
  },
  terms: {
    title: "Terms & Conditions",
    description: "",
    actions: [],
    trustSignals: [],
    showDots: false,
  },
};

function TrustSignals({ signals }) {
  if (!signals.length) return null;

  return (
    <div className="grid w-full max-w-3xl grid-cols-1 gap-3 min-[480px]:grid-cols-3 sm:gap-6">
      {signals.map(({ icon, lines }) => (
        <div key={lines.join("-")} className="flex items-center justify-center gap-2">
          <Image
            src={icon}
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 shrink-0 object-contain"
          />
          <p className="text-left text-xs font-semibold leading-5 text-[#f5f5f5] sm:text-sm">
            {lines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function PropertyHero({
  variant = "buy",
  title,
  description,
  filterPrefix,
  listingPath,
  fields,
  actions,
  trustSignals,
}) {
  const preset = PRESETS[variant] || PRESETS.buy;
  const resolvedFields =
    fields ||
    (PROPERTY_FILTER_VARIANTS.has(variant) ? buildPropertyFilterFields() : []);
  const resolvedActions =
    actions !== undefined
      ? actions
      : preset.actions !== undefined
        ? preset.actions
        : DEFAULT_ACTIONS;
  const resolvedTrustSignals =
    "trustSignals" in preset
      ? preset.trustSignals ?? []
      : trustSignals ?? STANDARD_TRUST_SIGNALS;

  return (
    <section className="relative isolate z-20 w-full overflow-x-clip">
      <HeroBackgroundCarousel overlayClassName="bg-black/60">
        <div className="relative flex min-h-svh w-full flex-col items-center justify-center gap-5 px-4 pt-28 pb-10 text-center sm:gap-7 sm:px-6 sm:pt-32 lg:gap-8 lg:px-10">
          <h1 className="text-gold-gradient max-w-[1140px] text-[clamp(2.25rem,7vw,5.125rem)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
            {title || preset.title}
          </h1>

          {preset.features?.length ? (
            <div className="flex max-w-4xl flex-wrap items-center justify-center gap-3 sm:gap-5">
              {preset.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2">
                  <CircleCheck className="h-5 w-5 shrink-0 text-[#ba8a44]" />
                  <p className="text-xs sm:text-sm lg:text-base">{feature}</p>
                </div>
              ))}
            </div>
          ) : null}

          <p className="max-w-[860px] text-sm leading-relaxed text-[#f5f5f5] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] sm:text-base md:text-lg lg:text-xl">
            {description || preset.description}
          </p>

          {resolvedFields.length > 0 ? (
            <HeroFilters
              prefix={filterPrefix || variant}
              variant={variant}
              listingPath={listingPath}
              fields={resolvedFields}
            />
          ) : null}

          {resolvedActions.length ? (
            <div className="flex w-full max-w-[350px] flex-col gap-3 sm:flex-row sm:justify-center sm:gap-5">
              {resolvedActions.map((action) => (
                <Button
                  key={action.label}
                  variant={action.variant}
                  href={action.href}
                  download={action.download}
                  className="h-14 w-full rounded-xl text-xs text-nowrap tracking-[1.3px] sm:flex-1 sm:text-sm"
                >
                  {action.label}
                </Button>
              ))}
            </div>
          ) : null}

          <TrustSignals signals={resolvedTrustSignals} />
          {preset.showDots !== false && <HeroCarouselDots />}
        </div>
      </HeroBackgroundCarousel>
    </section>
  );
}
