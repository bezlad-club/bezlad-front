import { fadeInAnimation } from "@/utils/animationVariants";
import Image from "next/image";
import { motion } from "motion/react";

export default function AdvantagesImages() {
  return (
    <div className="absolute left-0 bottom-0 w-full h-full">
      <div className="absolute inset-0 z-10 pointer-events-none ">
        <Image
          src="/images/ctaContactUs/noise.webp"
          fill
          alt="noise"
          className="object-cover opacity-40"
        />
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInAnimation({ x: 20, delay: 0.5, scale: 0.95 })}
        className="w-[465.37px] h-[592.66px] absolute left-[-177px] top-[36px] lg:left-[-234px] lg:top-[-94.5px] pointer-events-none rotate-51 opacity-86"
      >
        <Image
          src="/images/advantages/flowersGray.webp"
          fill
          alt="flowersGray"
          className="object-cover"
        />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInAnimation({ x: -20, delay: 0.7, scale: 0.95 })}
        className="lg:hidden w-[341.88px] h-[435.4px] absolute right-[-151px] bottom-[-230px] pointer-events-none rotate-29"
      >
        <Image
          src="/images/advantages/flowersMob.webp"
          fill
          alt="flowersMob"
          className="object-cover"
        />
      </motion.div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInAnimation({ x: -20, delay: 0.7, scale: 0.95 })}
        className="hidden z-2 lg:block w-[680px] h-[866px] absolute right-[-39px] bottom-[-445px] pointer-events-none rotate-29"
      >
        <Image
          src="/images/advantages/flowersDesk.webp"
          fill
          alt="flowersDesk"
          className="object-cover"
        />
      </motion.div>
    </div>
  );
}
