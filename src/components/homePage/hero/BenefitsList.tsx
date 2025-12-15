"use client";
import { motion } from "motion/react";
import { listVariants } from "@/utils/animationVariants";
import BenefitItem from "./BenefitItem";

const benefitsList = [
  {
    value: "10+",
    description: "інтерактивних зон",
  },
  {
    value: "100+",
    description: "варіантів гри",
  },
  {
    value: "100%",
    description: "задоволених клієнтів",
  },
];

export default function BenefitsList() {
  return (
    <motion.ul
      key="benefits"
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.2 }}
      variants={listVariants({ staggerChildren: 0.3, delayChildren: 0.4 })}
      className="hidden lg:flex relative z-10 flex-col mb-[7px] gap-5"
    >
      {benefitsList.map((benefit, idx) => (
        <BenefitItem key={idx} benefit={benefit} />
      ))}
    </motion.ul>
  );
}
