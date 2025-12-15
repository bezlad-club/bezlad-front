import { ReactNode } from "react";
import { motion } from "motion/react";
import { fadeInAnimation } from "@/utils/animationVariants";
import { twMerge } from "tailwind-merge";

interface SectionTitleProps {
  children?: ReactNode;
  animationDirection?: "left" | "right";
  className?: string;
}

export default function SectionTitle({
  children,
  animationDirection = "right",
  className = "",
}: SectionTitleProps) {
  return (
    <motion.h2
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.8 }}
      variants={fadeInAnimation({
        x: animationDirection === "right" ? -30 : 30,
        scale: 0.9,
      })}
      className={twMerge(
        `font-azbuka text-[32px] lg:text-[64px] font-normal leading-[120%] uppercase`,
        className
      )}
    >
      {children}
    </motion.h2>
  );
}
