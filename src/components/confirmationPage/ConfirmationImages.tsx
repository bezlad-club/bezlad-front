import Image from "next/image";
import { motion } from "motion/react";
import { fadeInAnimation } from "@/utils/animationVariants";
import AnimatedAnimal from "../shared/animatedAnimal/AnimatedAnimal";

export default function ConfirmationImages() {
  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.01 }}
        variants={fadeInAnimation({})}
        style={{
          borderRadius: "50%",
        }}
        className="absolute -z-10 left-[calc(50%-693px)] lg:left-[calc(50%-812px)] bottom-[-923px] lg:bottom-[-781px] 
            w-[1283px] h-[1019px] rounded-full 
          bg-[linear-gradient(164deg,#F6FF3A_7%,#F9FF8A_59.69%)]"
      >
        <Image
          src="/images/hero/dashedLine.svg"
          alt="dashed line"
          width="533"
          height="303"
          className="absolute top-[19px] lg:top-[149px] left-[410px] lg:right-[73px] w-[533px] h-auto rotate-[14.38deg] lg:rotate-[42deg]"
        />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.01 }}
        variants={fadeInAnimation({})}
        className="hidden lg:block absolute -z-10 right-[calc(50%-785px)] bottom-[-288px] 
              w-[570px] h-[467px] overflow-hidden"
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
          y: 50,
          x: 50,
          scale: 0.95,

          duration: 1.4,
        })}
        className="hidden lg:block absolute z-10 right-[calc(50%-477px)] bottom-[35px] w-[160px] h-[213px]"
      >
        <AnimatedAnimal
          svgPath="/images/animals/animalYellowSmall.svg"
          className="h-auto w-[160px]"
          maxPupilMovement={3}
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
        })}
        className="absolute z-10 bottom-[30px] lg:bottom-[121px] left-[calc(50%-272px)] lg:left-[calc(50%-335px)] pointer-events-none"
      >
        <AnimatedAnimal
          svgPath="/images/animals/animal.svg"
          className="w-[315px] lg:w-[350px] h-auto"
          maxPupilMovement={6}
          fetchPriority="high"
        />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInAnimation({
          x: 20,
          scale: 0.95,
          delay: 0.4,
        })}
        className="hidden lg:block absolute z-20 bottom-[54px] left-[calc(50%-54px)] pointer-events-none"
      >
        <Image
          src="/images/confirmation/stars.svg"
          alt="stars"
          width="116"
          height="134"
          className="w-[116px] h-auto"
        />
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInAnimation({
          x: 20,
          scale: 0.95,
          delay: 0.4,
        })}
        className="absolute z-10 bottom-[56px] lg:bottom-[91px] right-[calc(50%-215px)] lg:right-[calc(50%-298px)]  pointer-events-none"
      >
        <Image
          src="/images/notifications/bucket.svg"
          alt="bucket"
          width="269"
          height="388"
          className="w-[193px] lg:w-[258px] h-auto"
        />
      </motion.div>
    </>
  );
}
