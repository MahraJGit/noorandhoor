import { Building2, Handshake, KeyRound } from "lucide-react";
import PropertyHero from "@/components/common/PropertyHero";
import Button from "@/components/ui/Button";
import { CONTACT_FORM_HREF } from "@/components/sections/contact/contactData";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "About Us | Noor & Hoor Properties",
  description:
    "Trusted UAE real estate experts helping buyers, sellers, and investors find the right residential, commercial, and off-plan properties.",
  path: "/about-us",
});

const values = [
  {
    icon: Handshake,
    title: "Proven Results",
    description:
      "Years of successful deals across Dubai's top communities and off-plan launches.",
  },
  {
    icon: Building2,
    title: "Smart Guidance",
    description:
      "Practical advice helps you identify opportunities that fit your property goals.",
  },
  {
    icon: KeyRound,
    title: "Smooth Process",
    description:
      "From property selection to paperwork, we make the process smooth, simple, and easy.",
  },
];

export default function AboutUsPage() {
  return (
    <>
      <PropertyHero variant="about" />
      <section className="section-container">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-2xl border border-white/10 bg-[#171717] p-6 sm:p-7 transition-colors hover:border-[#ba8a44]/50"
              >
                <Icon className="h-8 w-8 text-[#ba8a44]" strokeWidth={1.4} />
                <h2 className="!font-accent mt-6 text-xl text-white">{title}</h2>
                <p className="mt-3 text-sm leading-7 text-white/65">{description}</p>
              </article>
            ))}
          </div>

          <div className="mt-12 grid gap-10 border-y border-[#ba8a44]/30 py-12 md:grid-cols-2 md:gap-16 sm:mt-16 sm:py-16">
            <div>
              <h2 className="text-gold-gradient text-3xl sm:text-4xl">Our Mission</h2>
              <p className="mt-5 text-sm leading-7 text-white/75 sm:text-base">
                We help clients navigate the UAE property market with clarity and
                confidence. Our goal is to deliver honest guidance and real value,
                from first inquiry to final handover.
              </p>
            </div>
            <div>
              <h2 className="text-gold-gradient text-3xl sm:text-4xl">Our Approach</h2>
              <p className="mt-5 text-sm leading-7 text-white/75 sm:text-base">
                Every client&apos;s goals come first. We combine deep market knowledge
                with personal attention to guide decisions that meet immediate needs
                and long term investment goals.
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl bg-[#171717] px-6 py-10 text-center sm:mt-16 sm:px-10">
            <h2 className="text-gold-gradient text-3xl sm:text-4xl">
              Let&apos;s Find Your Next Property
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70">
              Share your goals with us, and we&apos;ll guide you toward the right fit.
            </p>
            <Button href={CONTACT_FORM_HREF} className="mt-7 px-7 py-3 text-sm">
              Contact Our Team
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
