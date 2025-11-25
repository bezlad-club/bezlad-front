import InstagramIcon from "../icons/InstagramIcon";
import { INSTAGRAM_URL } from "@/constants/constants";
import { fadeInAnimation } from "@/utils/animationVariants";
import * as motion from "motion/react-client";
import { twMerge } from "tailwind-merge";

interface SocialsGroupProps {
  className?: string;
}

export default function SocialsGroup({ className }: SocialsGroupProps) {
  return (
    <motion.ul
      variants={fadeInAnimation({ delay: 0.4 })}
      initial="hidden"
      className={twMerge("flex items-center gap-6", className)}
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.1 }}
    >
      <li className="w-9 h-9 flex items-center justify-center xl:hover:opacity-80 transition-opacity duration-300">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer nofollow"
          aria-label="instagram"
        >
          <InstagramIcon className="text-purple w-8 h-8" />
        </a>
      </li>
    </motion.ul>
  );
}
