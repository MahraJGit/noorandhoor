import DeveloperCard from "@/components/sections/developers/DeveloperCard";

export default function DetailDevelopers({ developers = [] }) {
  const list = Array.isArray(developers)
    ? developers.filter((item) => item?.id && item?.developerName)
    : [];

  if (!list.length) return null;

  return (
    <section className="px-4 pb-8 pt-0 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-8 pl-1 sm:mb-10 lg:pl-0">
          <h2 className="text-left text-2xl font-semibold tracking-[0.02em] text-[#e3b76d] sm:text-3xl lg:text-[2rem]">
            Developers
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {list.map((developer) => (
            <DeveloperCard key={developer.id} developer={developer} />
          ))}
        </div>
      </div>
    </section>
  );
}
