import Image from "next/image";

function watermarkClassName(name) {
  const length = String(name || "").trim().length;
  if (length > 20) return "text-[1.35rem] sm:text-2xl";
  if (length > 14) return "text-2xl sm:text-3xl";
  if (length > 9) return "text-3xl sm:text-4xl";
  return "text-4xl sm:text-[2.75rem]";
}

export default function DeveloperCard({ developer }) {
  const {
    developerName,
    title,
    name,
    image,
    pointOne = "Active Master Communities",
    pointTwo = "Delivery Record (29,930)",
    pointThree = "Starting Price",
  } = developer;
  const displayName = developerName || name;

  return (
    <article className="relative flex min-h-[479px] w-full flex-col items-center justify-end overflow-hidden rounded-[12px] border border-[rgba(212,175,55,0.6)] px-4 py-6">
      {image ? (
        <Image
          src={image}
          alt=""
          fill
          sizes="351px"
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-[#25231f]" />
      )}
      <div className="absolute inset-0 bg-black/60" />
      {displayName ? (
        <div className="pointer-events-none absolute inset-x-0 top-[8%] bottom-[46%] z-10 flex items-center justify-center px-5">
          <p
            className={`w-full max-w-full text-center font-normal uppercase leading-[1.05] text-white [overflow-wrap:anywhere] [text-shadow:0_2px_5px_rgba(0,0,0,1),0_0_18px_rgba(0,0,0,0.9)] ${watermarkClassName(displayName)}`}
          >
            {displayName}
          </p>
        </div>
      ) : null}

      <div className="relative z-10 flex w-full flex-col items-start gap-3">
        <h3 className="w-full text-left text-base font-semibold text-[#E9C349]">
          {title || name}
        </h3>
        <div className="h-px w-full border-t-2 border-[#E9C349]" />
        <ul className="flex w-full flex-col gap-0 text-base font-semibold capitalize leading-8 text-[#F5F5F5]">
          <li className="flex items-center gap-1.5">
            <span className="text-[#E9C349]" aria-hidden>
              •
            </span>
            {pointOne}
          </li>
          <li className="flex items-center gap-1.5">
            <span className="text-[#E9C349]" aria-hidden>
              •
            </span>
            {pointTwo}
          </li>
          <li className="flex items-center gap-1.5">
            <span className="text-[#E9C349]" aria-hidden>
              •
            </span>
            {pointThree}
          </li>
        </ul>
      </div>
    </article>
  );
}
