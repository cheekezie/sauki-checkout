import bannerSymbol from "../../assets/banner-symbol.svg";

const DashboardBanner = () => {
  return (
    <div className="bg-primary rounded-2xl p-8 relative overflow-hidden">
      {/* Background Symbol - SVG Image */}
      <div className="absolute right-0 top-0 bottom-0 opacity-30 flex items-center">
        <img
          src={bannerSymbol}
          alt="Banner Symbol"
          className="h-full w-auto object-contain"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-secondary mb-4">
          Administrator Dashboard
        </h1>
        <p className="text-lg text-secondary/90 leading-relaxed">
          Lorem ipsum dolor sit amet consectetur. Etiam vehicula posuere quam
          orci suspendisse.
        </p>
      </div>
    </div>
  );
};

export default DashboardBanner;
