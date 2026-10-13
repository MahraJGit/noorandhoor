import PropertyHero from "@/components/common/PropertyHero";
import InfoPage from "@/components/ui/InfoPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Terms & Conditions | Noor & Hoor Properties",
  description:
    "Review the terms and conditions for using the Noor & Hoor Properties website and services.",
  path: "/terms-and-conditions",
});

const sections = [
  {
    title: "Eligibility",
    paragraphs: [
      "You must be at least 18 years old to use this website or submit an enquiry to us. By using this site, you confirm that you meet this requirement.",
    ],
  },
  {
    title: "Your Acceptance of These Terms",
    paragraphs: [
      "Continuing to browse this site means you're on board with everything below, if not, it's best to step away. This platform is meant for lawful use only, and any attempt to disrupt, hack, or interfere with it is off limits.",
    ],
  },
  {
    title: "About Our Listings",
    paragraphs: [
      "Pricing, square footage, availability, payment structures, photos, and descriptions are shared as general reference points. Since much of this comes from owners, landlords, developers, or outside sources, it can change without warning.",
      "We do our best to keep everything current, but always double-check the important details yourself before signing anything or sending money. Nothing published here should be treated as legal, tax, or financial advice, or as an official property valuation.",
    ],
  },
  {
    title: "Enquiries and Transactions",
    paragraphs: [
      "Reaching out to us doesn't hold a property for you or create any formal commitment. Every deal is subject to availability, identity checks, compliance review, signed paperwork, and terms both parties agree to directly.",
    ],
  },
  {
    title: "Prohibited Uses",
    paragraphs: ["You agree not to use this website to:"],
    items: [
      "Break any applicable law or regulation.",
      "Submit false, misleading, or fraudulent information.",
      "Scrape, mine, or extract data from the site using automated tools.",
      "Upload viruses, malware, or any code intended to disrupt the site.",
      "Attempt to gain unauthorized access to any part of the site or its systems.",
      "Harass, impersonate, or misrepresent your identity to us or others.",
    ],
    paragraphsAfter: [
      "We reserve the right to suspend or terminate access for anyone who violates these terms.",
    ],
  },
  {
    title: "Content Rights & Usage",
    paragraphs: [
      "The look, branding, wording, and visuals on this website either belong to Noor & Hoor Properties or are used with proper permission. Feel free to view or print material for your own personal use, anything beyond that, like copying, sharing, editing, or commercial use, needs our written sign-off first.",
    ],
  },
  {
    title: "Third Party Links",
    paragraphs: [
      "Occasionally you'll spot links to other websites while browsing here, added purely for your convenience. We have no control over, and take no responsibility for, what happens on those external sites.",
    ],
  },
  {
    title: "Service Availability",
    paragraphs: [
      "We aim to keep this website running smoothly but don't guarantee it will always be available, uninterrupted, or error free. We may update, suspend, or modify the site or its content at any time, including for maintenance, without prior notice.",
    ],
  },
  {
    title: "Limitation of Liability",
    paragraphs: [
      "To whatever extent the law allows, Noor & Hoor Properties isn't liable for indirect or secondary losses connected to using or relying on this site. That said, nothing here overrides liability that can't legally be waived.",
    ],
  },
  {
    title: "Compensation",
    paragraphs: [
      "You agree to protect Noor & Hoor Properties from any claims or demands resulting from your misuse of this website or violation of these Terms.",
    ],
  },
  {
    title: "Governing Law",
    paragraphs: [
      "This website and your use of it fall under UAE law, and any legal disputes will be handled through the courts of Dubai.",
    ],
  },
  {
    title: "Severability",
    paragraphs: [
      "If any part of these Terms is found invalid or unenforceable, that part will be removed or limited to the minimum extent necessary, and the rest of the Terms will remain in full effect.",
    ],
  },
  {
    title: "Policy Updates",
    paragraphs: [
      "We may revise this page from time to time to reflect updates to our site, services, or legal requirements. Any changes take effect the moment they're published here. Last updated: 15 August 2026.",
    ],
  },
  {
    title: "Get In Touch",
    paragraphs: [
      "Got a question about these terms? Email us at Admin@noorandhoorproperties.com or give us a call at +971 52 693 8886, we're happy to walk you through it.",
    ],
  },
];

export default function TermsAndConditionsPage() {
  return (
    <>
      <PropertyHero 
        variant="terms" 
        description="This page outlines the rules for browsing Noor & Hoor Properties online and using the property details we share here. By accessing or using this website, you confirm that you meet the eligibility requirements below and agree to be bound by these Terms."
      />
      <InfoPage
        withHero
        sections={sections}
      />
    </>
  );
}
