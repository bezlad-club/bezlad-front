import Image from "next/image";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";

export default function FaqImages() {
  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInAnimation({ delay: 1, scale: 0.95 })}
        className="absolute top-[195px] lg:top-[99px] right-[calc(50%-521px)] lg:right-[calc(50%-864px)] w-[619px] lg:w-[907px] h-auto aspect-907/712"
      >
        <Image
          src="/images/faq/flowersRight.webp"
          alt="flowers"
          width="907"
          height="712"
          className="w-[619px] lg:w-[907px] h-auto"
        />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInAnimation({ delay: 1, scale: 0.95 })}
        className="absolute top-[160px] lg:top-[-120px] left-[calc(50%-730px)] lg:left-[calc(50%-1255px)] w-[950px] lg:w-[993px] h-auto aspect-993/826 rotate-13 lg:rotate-0"
      >
        <Image
          src="/images/faq/flowersTopLeft.webp"
          alt="flowers"
          width="993"
          height="826"
          className="w-[950px] lg:w-[993px] h-auto"
        />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInAnimation({ delay: 1, scale: 0.95 })}
        className="hidden lg:block absolute bottom-[-585px] left-[calc(50%-1012px)] w-[1143px] h-auto aspect-1143/1074"
      >
        <Image
          src="/images/faq/flowersBottomLeft.webp"
          alt="flowers"
          width="1143"
          height="1074"
          className="w-[1143px] h-auto"
        />
      </motion.div>
    </>
  );
}
