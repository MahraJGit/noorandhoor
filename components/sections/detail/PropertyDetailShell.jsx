"use client";

import Link from "next/link";
import DetailHeader from "@/components/sections/detail/DetailHeader";
import DetailGallery from "@/components/sections/detail/DetailGallery";
import DetailAbout from "@/components/sections/detail/DetailAbout";
import DetailAboutRent from "@/components/sections/detail/DetailAboutRent";
import DetailFeatures from "@/components/sections/detail/DetailFeatures";
import DetailProjectSpecs from "@/components/sections/detail/DetailProjectSpecs";
import DetailUnitsAvailability from "@/components/sections/detail/DetailUnitsAvailability";
import DetailDevelopers from "@/components/sections/detail/DetailDevelopers";
import DetailRelated from "@/components/sections/detail/DetailRelated";
import FaqSection from "@/components/common/FaqSection";
import TeamCard from "@/components/ui/TeamCard";
import { TEAM_MEMBERS } from "@/components/sections/home/OurTeam";
import DetailAgentContact from "@/components/sections/detail/DetailAgentContact";
import DetailAgentContactRent from "@/components/sections/detail/DetailAgentContactRent";
import PropertyJourneyCta from "@/components/sections/property/PropertyJourneyCta";
import OffPlanListedDate from "@/components/sections/offplan/OffPlanListedDate";
import OffPlanPropertyFeatures from "@/components/sections/offplan/OffPlanPropertyFeatures";
import OffPlanPaymentPlan from "@/components/sections/offplan/OffPlanPaymentPlan";
import useAdminProperties from "@/hooks/useAdminProperties";
import {
  adminToDetailProperty,
  findAdminProperty,
  isPublicProperty,
  relatedListingHomes,
} from "@/lib/admin/propertyPublic";
import { formatDisplayDate } from "@/lib/admin/utils";
import { buildMapExternalUrl } from "@/lib/propertyMap";

function SalesOfficeSection() {
  return (
    <section className="px-4 pb-8 pt-0 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-8 pl-1 sm:mb-10 lg:pl-0">
          <h2 className="text-left text-2xl font-semibold tracking-[0.02em] text-[#e3b76d] sm:text-3xl lg:text-[2rem]">
            Sales Office
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {TEAM_MEMBERS.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}

function detailJourneyCta(property, variant, heading) {
  const mapHref = buildMapExternalUrl({
    lat: property.map?.lat,
    lng: property.map?.lng,
    label: property.map?.label,
    location: property.location,
  });

  return (
    <PropertyJourneyCta
      variant={variant}
      heading={heading}
      primaryLabel="Contact Agent"
      primaryHref="/contact#contact-form"
      secondaryLabel="View Location on map"
      secondaryHref={mapHref}
      secondaryExternal
    />
  );
}

export default function PropertyDetailShell({
  variant = "buy",
  slug,
  market,
  header,
  relatedHeading,
  relatedEyebrow,
  offPlanCategoryLabel,
}) {
  const { properties, isReady } = useAdminProperties();
  const matched =
    isReady && slug ? findAdminProperty(properties, slug, market) : null;
  const admin = matched && isPublicProperty(matched) ? matched : null;
  const property = admin ? adminToDetailProperty(admin) : null;
  const related = admin ? relatedListingHomes(properties, admin) : [];

  if (!isReady) {
    return <div className="min-h-[70vh] w-full bg-[#111111]" />;
  }

  if (!property) {
    return (
      <div className="flex min-h-[70vh] w-full flex-col items-center justify-center gap-4 bg-[#111111] px-6 text-center text-white">
        <p className="text-lg">This property is not available.</p>
        <Link
          href={header?.breadcrumbHref || "/buy/properties"}
          className="text-sm text-[#eec876] underline-offset-4 hover:underline"
        >
          Back to listings
        </Link>
      </div>
    );
  }

  if (variant === "off-plan") {
    return (
      <div className="relative w-full overflow-x-clip bg-[#111111] text-white">
        <DetailHeader property={property} {...header} />
        <DetailGallery images={property.gallery} />
        <OffPlanListedDate
          date={
            property.listedAt
              ? formatDisplayDate(property.listedAt)
              : "27 June 2026"
          }
        />
        <DetailProjectSpecs property={property} />
        <DetailUnitsAvailability unitGroups={property.unitGroups} />
        <OffPlanPaymentPlan
          key={`${property.id || property.slug || "property"}:${property.price}`}
          defaultPrice={property.price}
          downPercent={property.paymentDownPercent}
          installments={property.paymentInstallments}
          startDate={property.paymentStartDate}
        />
        <OffPlanPropertyFeatures
          categoryLabel={offPlanCategoryLabel}
          property={property}
        />
        <DetailFeatures
          amenities={property.amenities}
          features={property.features}
        />
        <DetailDevelopers developers={property.developers} />
        <DetailRelated
          basePath={header.breadcrumbHref}
          properties={related}
          heading={relatedHeading || "Explore Similar Offplan Properties"}
        />
        {detailJourneyCta(
          property,
          "offplan",
          "Ready to Start Your Holiday Property Journey?",
        )}
      </div>
    );
  }

  if (variant === "buy") {
    return (
      <div className="relative w-full overflow-x-clip bg-[#111111] text-white">
        <DetailHeader property={property} {...header} />
        <DetailGallery images={property.gallery} />
        <DetailAbout property={property} />
        <DetailProjectSpecs property={property} />
        <DetailUnitsAvailability unitGroups={property.unitGroups} />
        <DetailFeatures
          amenities={property.amenities}
          features={property.features}
        />
        <DetailDevelopers developers={property.developers} />
        <SalesOfficeSection />
        <DetailRelated
          basePath={header.breadcrumbHref}
          properties={related}
        />
        <FaqSection variant="detail" />
        <DetailAgentContact />
        {detailJourneyCta(property, "buy")}
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-x-clip bg-[#111111] text-white">
      <DetailHeader property={property} {...header} />
      <DetailGallery images={property.gallery} />
      <DetailAboutRent property={property} />
      <DetailProjectSpecs property={property} />
      <DetailUnitsAvailability unitGroups={property.unitGroups} />
      <DetailFeatures
        amenities={property.amenities}
        features={property.features}
      />
      <DetailDevelopers developers={property.developers} />
      <SalesOfficeSection />
      <DetailRelated
        basePath={header.breadcrumbHref}
        eyebrow={relatedEyebrow || "Related Properties"}
        heading={relatedHeading}
        properties={related}
      />
      <FaqSection variant="detail" />
      <DetailAgentContactRent />
      {detailJourneyCta(property, "detail")}
    </div>
  );
}
