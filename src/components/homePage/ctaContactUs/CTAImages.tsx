import StarIcon from "@/components/shared/icons/StarIcon";
import Image from "next/image";
import { motion } from "motion/react";
import { fadeInAnimation } from "@/utils/animationVariants";

export default function CTAImages() {
  return (
    <>
      <StarIcon className="absolute -left-11 -top-12 lg:-top-10 text-white size-25 lg:size-27" />
      <StarIcon className="absolute left-5 top-4 lg:left-6 lg:top-6 text-white size-10 lg:size-14" />
      <div className="absolute inset-0 left-0 bottom-0 pointer-events-none">
        <Image
          src="/images/ctaContactUs/noise.webp"
          fill
          alt="noise"
          className="object-cover"
        />
      </div>
      <div className="absolute left-0 md:left-auto md:right-0 bottom-0 w-full h-[279px] md:h-full md:w-[45%] lg:w-[35%] xl:w-[604px] rounded-2xl">
        <Image
          src="/images/ctaContactUs/boy.webp"
          fill
          alt="boy"
          className="relative z-5 object-cover rounded-2xl"
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInAnimation({ delay: 1, scale: 0.95 })}
          className="absolute md:hidden -top-9 right-[-22px]"
        >
          <Image
            src="/images/ctaContactUs/leavesYellow.svg"
            alt="leaves"
            width="179"
            height="139"
          />
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeInAnimation({ delay: 1, scale: 0.95 })}
          className="absolute z-7 md:hidden -top-[107px] right-[-69px]"
        >
          <Image
            src="/images/ctaContactUs/leavesWhite.svg"
            alt="leaves"
            width="179"
            height="139"
          />
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.8 }}
          variants={fadeInAnimation({ delay: 1, scale: 0.95 })}
          className="absolute z-7 md:bottom-0 md:-left-5 lg:left-[-138px]"
        >
          <Image
            src="/images/ctaContactUs/leavesDesk.svg"
            alt="leaves"
            width="261"
            height="290"
            className="hidden md:block w-[180px] lg:w-[261px] h-auto object-cover"
          />
        </motion.div>
      </div>
    </>
  );
}
