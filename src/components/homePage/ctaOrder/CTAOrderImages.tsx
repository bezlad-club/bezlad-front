import Image from "next/image";

export default function CTAOrderImages() {
  return (
    <>
      <div className="absolute z-10 inset-0 left-0 top-0 pointer-events-none">
        <Image
          src="/images/ctaOrder/noise.webp"
          alt="noise"
          fill
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 lg:w-[649px] lg:h-[649px] left-0 lg:left-[calc(50%-712px)] xl:left-[calc(50%-762px)] top-0 lg:top-[-22px] pointer-events-none h-full w-full">
        <Image
          src="/images/ctaOrder/pattern.webp"
          alt="pattern"
          fill
          className="object-cover"
        />
      </div>

      <div className="lg:hidden absolute z-8 top-[-27px] left-[-95px] w-[475px] h-[323px] rounded-full bg-purple-ultra-light supports-backdrop-filter:blur-[72.65px]" />

      <div className="hidden lg:block absolute z-8 top-[-83px] lg:left-[calc(50%-177px)] xl:left-[calc(50%-237px)] w-[288px] h-[726px] rounded-full bg-purple-ultra-light supports-backdrop-filter:blur-[44.59px]" />

      <div className="hidden lg:block absolute z-8 bottom-[-104px] left-[calc(50%-847px)] w-[1092px] h-[291px] rounded-full bg-purple-ultra-light supports-backdrop-filter:blur-[72.65px]" />

      <div
        className="absolute z-15 left-[calc(50%-253px)] lg:left-[calc(50%-796px)] xl:left-[calc(50%-856px)] bottom-[-49px] lg:bottom-[-68px] pointer-events-none w-[607px] 
      lg:w-[931px] h-auto aspect-607/429 rotate-[-4.35deg] lg:rotate-0"
      >
        <Image
          src="/images/ctaOrder/momWithBoy.webp"
          alt="mom with boy"
          width={607}
          height={429}
          className="w-[607px] lg:w-[931px] h-auto object-cover"
        />
      </div>
      <div className="absolute z-14 lg:z-5 left-[calc(50%-273px)] lg:left-auto lg:right-[calc(50%-686px)] bottom-[-18px] lg:bottom-[-34px] pointer-events-none w-[283px] lg:w-[394px] h-auto aspect-394/480">
        <Image
          src="/images/ctaOrder/bucket.svg"
          alt="bucket"
          width="394"
          height="480"
          className="w-[283px] lg:w-[394px] h-auto object-cover"
        />
      </div>
    </>
  );
}
