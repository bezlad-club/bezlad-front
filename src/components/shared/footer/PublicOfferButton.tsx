"use client";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";
import Link from "next/link";

interface PublicOfferButtonProps {
  className?: string;
}

export default function PublicOfferButton({
  className,
}: PublicOfferButtonProps) {
  return (
    <>
      <motion.div
        variants={fadeInAnimation({ delay: 0.8, y: 20 })}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className={`w-[162px] lg:w-[148px] ${className}`}
      >
        <Link
          href="/public-offer"
          className="block cursor-pointer w-[162px] lg:w-[148px] lg:mr-[54px] text-[14px] leading-[114.28%] font-semibold text-purple text-left uppercase xl:hover:brightness-150 transition-brightness duration-300"
        >
          Публічна оферта
        </Link>
      </motion.div>
    </>
  );
}
