import InstagramIcon from "../icons/InstagramIcon";
import {
  INSTAGRAM_URL,
  FACEBOOK_URL,
  TELEGRAM_URL,
} from "@/constants/constants";
import { fadeInAnimation } from "@/utils/animationVariants";
import { motion } from "motion/react";
import { twMerge } from "tailwind-merge";
import FacebookIcon from "../icons/FacebookIcon";
import TelegramIcon from "../icons/TelegramIcon";

interface SocialsGroupProps {
  className?: string;
}

export default function SocialsGroup({ className }: SocialsGroupProps) {
  return (
    <ul className={twMerge("flex items-center gap-6", className)}>
      <motion.li
        variants={fadeInAnimation({ delay: 0.5 })}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="w-9 h-9 flex items-center justify-center "
      >
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer nofollow"
          aria-label="instagram"
          className=" xl:hover:opacity-80 transition-opacity duration-300"
        >
          <InstagramIcon className="text-purple w-8 h-8" />
        </a>
      </motion.li>
      <motion.li
        variants={fadeInAnimation({ delay: 0.6 })}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="w-9 h-9 flex items-center justify-center "
      >
        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer nofollow"
          aria-label="facebook"
          className=" xl:hover:opacity-80 transition-opacity duration-300"
        >
          <FacebookIcon className="text-purple w-[27px] h-[27px]" />
        </a>
      </motion.li>
      <motion.li
        variants={fadeInAnimation({ delay: 0.7 })}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="w-9 h-9 flex items-center justify-center "
      >
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer nofollow"
          aria-label="telegram"
          className=" xl:hover:opacity-80 transition-opacity duration-300"
        >
          <TelegramIcon className="text-purple w-7.5 h-7.5" />
        </a>
      </motion.li>
    </ul>
  );
}
