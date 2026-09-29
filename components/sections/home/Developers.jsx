import developer1 from "@/public/images/landingpage/developer1.png";
import developer2 from "@/public/images/landingpage/developer2.png";
import developer3 from "@/public/images/landingpage/developer3.png";
import developer4 from "@/public/images/landingpage/developer4.png";
import developer5 from "@/public/images/landingpage/developer5.png";
import developer6 from "@/public/images/landingpage/developer6.png";
import developer7 from "@/public/images/landingpage/developer7.png";
import developer8 from "@/public/images/landingpage/developer8.png";
import Image from "next/image";

const DEVELOPERS = [
  { image: developer1, name: "Developer 1" },
  { image: developer2, name: "Developer 2" },
  { image: developer3, name: "Developer 3" },
  { image: developer4, name: "Developer 4" },
  { image: developer5, name: "Developer 5" },
  { image: developer6, name: "Developer 6" },
  { image: developer7, name: "Developer 7" },
  { image: developer8, name: "Developer 8" },
];

export default function Developers() {
  const logos = [...DEVELOPERS, ...DEVELOPERS];

  return (
    <section className="section-container">
      <div className="mb-12 flex flex-col items-center gap-4">
        <h3 className="section-sub-heading">Our Developers</h3>
        <h2 className="text-gold-gradient text-center">Developers working with us</h2>
        <div className="mb-1 h-[4px] w-25 bg-[#B3813D]" />
      </div>

      <div className="developer-marquee">
        <div className="developer-marquee-track">
          {logos.map((developer, index) => (
            <div
              key={`${developer.name}-${index}`}
              className="developer-marquee-logo"
              aria-hidden={index >= DEVELOPERS.length}
            >
              <Image
                src={developer.image}
                alt={index >= DEVELOPERS.length ? "" : developer.name}
                fill
                sizes="160px"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
