import { breakWords } from "@/utils/breakWords";
import Image from "next/image";
import { motion } from "motion/react";
import { fadeInAnimation } from "@/utils/animationVariants";

export default function SpecialCard() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeInAnimation({ y: 20, delay: 0.6 })}
      className="relative w-full sm:w-[285px] h-full flex flex-col items-center justify-center shrink-0 mx-auto md:mx-0"
    >
      <div className="relative z-2 w-full h-full bg-white rounded-[15px] px-5 pb-5 pt-5.5 overflow-hidden">
        <h3 className="font-azbuka text-[20px] leading-[120%] uppercase flex flex-col mb-[19px]">
          {breakWords("Спеціальні пропозиції").map((word, index) => (
            <span key={index}>{word}</span>
          ))}
        </h3>
        <div className="absolute top-[-7px] right-[-15px] sm:right-[-42px] pointer-events-none">
          <Image
            src="/images/priceList/specialCard.webp"
            alt="Special Card"
            width={231}
            height={154}
          />
          <div className="hidden sm:block absolute w-[203px] h-[133px] right-[-65px] top-[80px] bg-white blur-[18.05px]" />
        </div>
        <ul className="text-[14px] xs:text-[16px] leading-[120%] flex flex-col gap-2 sm:gap-2.5 relative z-3">
          <li className="relative h-[73px] flex items-center bg-yellow rounded-[12px] px-3 lg:px-4">
            <p className="flex items-center gap-3.5 z-1 tracking-[-0.02em]">
              <span className="w-3.5 h-3.5 bg-black rounded-full shrink-0" />
              Пільговий вхід для дітей військовослужбовців
            </p>
            <Image
              src="/images/priceList/starsBg.svg"
              alt="Stars"
              fill
              className="absolute inset-0 object-cover"
            />
          </li>
          <li className="flex items-center gap-3.5 text-white h-[43px] bg-purple-light rounded-[12px] tracking-[-0.02em] px-3 sm:px-4">
            <span className="w-3.5 h-3.5 bg-white rounded-full shrink-0" />
            Знижки для груп від 10 дітей
          </li>
          <li className="flex items-center gap-3.5 text-white h-[74px] sm:h-[91px] bg-gray-dark rounded-[12px] tracking-[-0.02em] px-3 lg:px-4">
            <span className="w-3.5 h-3.5 bg-white rounded-full shrink-0" />
            Вигідні умови для святкування Днів Народження
          </li>
        </ul>
      </div>
      <div className="w-[78%] sm:w-[244px] h-[332px] bg-purple-light rounded-[15px] absolute bottom-[calc(100%/2-8px)] left-[calc(100%/2-4px)] -translate-x-1/2 translate-y-1/2 z-1 rotate-[10.77deg] md:left-0 md:bottom-[10px] md:translate-x-0 md:translate-y-0 md:origin-bottom-left" />
    </motion.div>
  );
}
