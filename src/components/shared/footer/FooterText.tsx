import { motion } from "motion/react";
import { fadeInAnimation } from "@/utils/animationVariants";
import { useScreenWidth } from "@/hooks/useScreenWidth";
import AnimatedAnimal from "../animatedAnimal/AnimatedAnimal";

interface FooterTextProps {
  className?: string;
}

export default function FooterText({ className }: FooterTextProps) {
  const width = useScreenWidth();

  const getVariants = () => {
    return width >= 1024
      ? fadeInAnimation({ delay: 0.8, x: -20 })
      : fadeInAnimation({ delay: 0.8, y: 20 });
  };

  return (
    <div
      className={`pointer-events-none absolute bottom-2 -right-10.5 sm:-bottom-2.5 sm:-right-9 lg:-bottom-17.5 lg:right-none lg:-left-[29px] z-1 lg:-z-10 ${className}`}
    >
      <div className="footer-block-rotate">
        <motion.div
          variants={getVariants()}
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.1 }}
          style={{ transformOrigin: "bottom right" }}
        >
          <p className="text-[147.567px] lg:text-[288.557px] leading-[120%] uppercase font-azbuka">
            Безлад
          </p>
          <motion.div
            variants={
              width >= 1024
                ? fadeInAnimation({ delay: 1, x: -20 })
                : fadeInAnimation({ delay: 1, y: 20 })
            }
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.1 }}
            className="absolute bottom-[42px] left-[223.58px] w-[121px] h-[144px] lg:w-[193.6px] lg:h-[234px] lg:left-[434px] lg:bottom-[70px]"
          >
            <AnimatedAnimal
              svgPath="/images/animals/animalSmall.svg"
              className="w-[121px] h-[144px] lg:w-[193.6px] lg:h-[234px]"
              maxPupilMovement={3}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
