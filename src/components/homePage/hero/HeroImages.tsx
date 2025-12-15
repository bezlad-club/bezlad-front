import AnimatedAnimal from "@/components/shared/animatedAnimal/AnimatedAnimal";
import AnimatedArrow from "@/components/shared/animatedArrow/AnimatedArrow";
import Image from "next/image";
import { motion } from "motion/react";
import { fadeInAnimation } from "@/utils/animationVariants";

export default function HeroImages() {
  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.01 }}
        variants={fadeInAnimation({ opacity: 0.01 })}
        className="absolute -z-10 left-[calc(50%-325px)] lg:left-auto lg:right-[calc(50%-785px)] bottom-[-363px] lg:bottom-[-507px] 
        w-[746px] lg:w-[999px] h-[758px] lg:h-[1029px] rounded-full 
      bg-[linear-gradient(164deg,#F6FF3A_7%,#F9FF8A_59.69%)]"
      >
        <Image
          src="/images/hero/dashedLine.svg"
          alt="dashed line"
          width="533"
          height="303"
          priority
          className="absolute top-[247px] lg:top-[323px] right-[125px] lg:right-[73px] rotate-[-5deg] w-[333px] lg:w-[533px] h-auto"
        />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.01 }}
        variants={fadeInAnimation({ opacity: 0.01 })}
        className="hidden lg:block absolute -z-10 left-[calc(50%-725px)] bottom-[-277px] 
        w-[535px] h-[439px] overflow-hidden"
        style={{
          borderRadius: "50%",
        }}
      >
        <div
          className="w-full h-full bg-[linear-gradient(164deg,#642DBA_7%,#B791FF_59.69%)]"
          style={{
            borderRadius: "50%",
          }}
        />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInAnimation({
          x: -20,
          scale: 0.95,
          delay: 0.4,
          opacity: 0.01,
        })}
        className="absolute top-[257px] lg:top-[397px] xl:top-[289px] right-[calc(50%-338px)] lg:right-[calc(50%-272px)] xl:right-[calc(50%-402px)]"
      >
        <AnimatedAnimal
          svgPath="/images/animals/animal.svg"
          className="w-[393px] xl:w-[532px] h-[355px] xl:h-[486px]"
          maxPupilMovement={6}
          fetchPriority="high"
        />
        <AnimatedArrow
          delay={0.4}
          className="absolute -z-10 top-[156px] xl:top-[220px] left-[-64px] lg:left-[-80px] xl:left-[-170px] w-[135px] lg:w-[218px] xl:w-[288px] h-auto rotate-[-65deg] lg:rotate-[-5deg] scale-y-[-1] lg:scale-y-[1]"
        />
      </motion.div>
    </>
  );
}
