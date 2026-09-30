"use client";

import CardMarquee from "@/components/ui/CardMarquee";
import LocationCard from "@/components/ui/LocationCard";
import dubai from "@/public/images/landingpage/dubai.png";
import abuDhabi from "@/public/images/landingpage/AbuDhabi.png";
import sharjah from "@/public/images/landingpage/Sharjah.png";
import ajman from "@/public/images/landingpage/Ajman.png";

const LOCATIONS = [
  { image: dubai, name: "Dubai Marina", subtitle: "The Vibrant Water Fall" },
  { image: abuDhabi, name: "Downtown Dubai", subtitle: "Iconic Living" },
  { image: sharjah, name: "Palm Jumeirah", subtitle: "Island Luxury" },
  { image: ajman, name: "Ajman", subtitle: "Coastal Living" },
];

export default function PrimeLocations() {
  return (
    <section className="section-full py-12 sm:py-14 lg:py-16">
      <div className="section-inner">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-[632px]">
            <h3 className="section-sub-heading mb-4">Prime Locations</h3>
            <h2 className="text-gold-gradient max-w-[516px]">
              About Dubai&apos;s Premier Areas
            </h2>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="h-[3px] w-16 bg-gradient-to-r from-[#eec876] to-[#b3813d] lg:h-20 lg:w-[3px]" />
            <p className="max-w-[457px] text-sm font-medium leading-[26px] text-[#f5f5f5] md:text-base">
              Find your dream neighborhood and explore it with your home
              purchase advisor. We are here to help you find the perfect home
              for you.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <CardMarquee duration={36}>
            {LOCATIONS.map((location) => (
              <LocationCard
                key={location.name}
                image={location.image}
                name={location.name}
                subtitle={location.subtitle}
              />
            ))}
          </CardMarquee>
        </div>
      </div>
    </section>
  );
}
