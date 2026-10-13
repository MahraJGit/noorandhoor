import PropertyHero from "@/components/common/PropertyHero";
import InfoPage from "@/components/ui/InfoPage";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Privacy Policy | Noor & Hoor Properties",
  description:
    "Read the Noor & Hoor Properties privacy policy and learn how we handle personal information.",
  path: "/privacy-policy",
});

const sections = [
  {
    title: "What We Collect",
    paragraphs: [
      "Personal details reach us in a few ways, like through general enquiries, listing requests, scheduled viewings, form submissions, or when you sign up for updates.",
    ],
    items: [
      "Basic contact details, including your name, email, and phone number.",
      "Property criteria, budget range, preferred area, and enquiry specifics.",
      "Info your device shares automatically, such as IP address, browser, and device type.",
      "ID documents, like your passport or Emirates ID, when a transaction requires it (If applicable).",
      "Anything else you decide to pass along during your interactions with us.",
    ],
  },
  {
    title: "How We Use Your Information",
    items: [
      "Answering your questions and requests through phone, email, or WhatsApp.",
      "Recommending listings and opportunities that match your needs.",
      "Arranging property tours, phone calls, and scheduled meetings.",
      "Improving our website, communication, and overall client experience.",
      "Following applicable laws, regulations, and security requirements.",
    ],
  },
  {
    title: "Who We Share It With",
    paragraphs: [
      "Certain details may pass to relevant parties, developers, landlords, property owners, vendors, or advisers, but only where it's necessary to complete something you've asked for. Disclosure may also occur if a court or authority legally requires it.",
      "Selling your personal data is something we never do. We protect it the same way we'd want ours protected.",
    ],
  },
  {
    title: "If Our Business Changes",
    paragraphs: [
      "If Noor & Hoor Properties is ever acquired, merged, or restructured, your personal data may be transferred as part of that process. We'll ensure it continues to be handled in line with this policy.",
    ],
  },
  {
    title: "Cookies and Analytics",
    paragraphs: [
      "Small tracking files and cookies help our site run smoothly, remember your settings, and give us insight into how the platform is used. Browser settings let you adjust or block these, though certain site features may stop working properly.",
    ],
  },
  {
    title: "Data Retention and Security",
    paragraphs: [
      "We keep different types of information for different lengths of time, based on why we collected it:",
    ],
    items: [
      "General enquiries: Retained for up to 3 years from your last contact with us.",
      "Completed transaction records: Retained for up to 7 years, in line with legal recordkeeping requirements.",
      "Marketing preferences: Retained until you unsubscribe or ask us to stop.",
    ],
    paragraphsAfter: [
      "While we apply sensible technical and organizational protections, it's worth noting that no digital system can promise complete, unbreakable security.",
    ],
  },
  {
    title: "Your Choices and Rights",
    paragraphs: [
      'Where the law allows, you\'re entitled to request a copy of your data, correct inaccuracies, have information erased, limit how it\'s processed, or unsubscribe from marketing altogether. To unsubscribe from marketing emails, use the "unsubscribe" link in any email we send, or contact us directly using the details below. We may first confirm your identity to process such a request.',
    ],
  },
  {
    title: "Children's Privacy",
    paragraphs: [
      "Our services are not directed to individuals under 18. We do not knowingly collect personal information from minors. If we become aware that we've collected such information, we will delete it promptly.",
    ],
  },
  {
    title: "Third-Party Websites",
    paragraphs: [
      "Our website may contain links to third-party websites, including developer or partner sites. This Privacy Policy does not apply to those websites, and we encourage you to review their own privacy policies before sharing information with them.",
    ],
  },
  {
    title: "Contact Us",
    paragraphs: [
      "For privacy related questions or requests, reach us at Admin@noorandhoorproperties.com or call +971 52 693 8886.",
      'This policy may change periodically. If we make material changes, we\'ll update the "Last updated" date below and, where appropriate, notify you by email. The most current version will always appear on this page. Last updated: 15 August 2026.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <PropertyHero
        variant="privacy"
        description="This page explains how Noor & Hoor Properties collects, uses, and protects your personal data and the choices you have when it comes to your information. By using this website or submitting your information to us, you agree to the practices described below. Noor & Hoor Properties acts as the controller of your personal data for all purposes described in this policy."
      />
      <InfoPage
        withHero
        sections={sections}
      />
    </>
  );
}
