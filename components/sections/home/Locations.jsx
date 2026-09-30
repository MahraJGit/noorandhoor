"use client";

import CardMarquee from "@/components/ui/CardMarquee";
import LocationCard from "@/components/ui/LocationCard";
import location1 from "@/public/images/landingpage/dubai.png";
import location2 from "@/public/images/landingpage/AbuDhabi.png";
import location3 from "@/public/images/landingpage/Sharjah.png";
import location4 from "@/public/images/landingpage/Ajman.png";
import location5 from "@/public/images/landingpage/UmmAlQuwain.jpg";
import location6 from "@/public/images/landingpage/RasAlKhaimah.jpg";
import location7 from "@/public/images/landingpage/Fujairah.jpg";

const LOCATIONS = [
  { image: location1, name: "Dubai", propertyCount: 24 },
  { image: location2, name: "Abu Dhabi", propertyCount: 13 },
  { image: location3, name: "Sharjah", propertyCount: 18 },
  { image: location4, name: "Ajman", propertyCount: 9 },
  { image: location5, name: "Umm Al Quwain", propertyCount: 6 },
  { image: location6, name: "Ras Al Khaimah", propertyCount: 11 },
  { image: location7, name: "Fujairah", propertyCount: 7 },
];

export default function Locations() {
  return (
    <section className="section-container">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="section-sub-heading mb-4 md:mb-0">Prime Locations</h3>
          <h2 className="text-gold-gradient max-w-[540px]">
            Best Places to Invest in UAE
          </h2>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="bg-[#B3813D] h-[3px] w-16 lg:h-20 lg:w-[4px]" />
          <p className="max-w-[450px] text-sm md:text-base font-medium">
            Discover top-performing UAE locations offering strong ROI, modern
            living, and secure real estate investment opportunities for buyers
            and investors.
          </p>
        </div>
      </div>

      <div className="mt-8 lg:mt-12">
        <CardMarquee duration={48}>
          {LOCATIONS.map((location) => (
            <LocationCard
              key={location.name}
              image={location.image}
              name={location.name}
              propertyCount={location.propertyCount}
            />
          ))}
        </CardMarquee>
      </div>
    </section>
  );
}
