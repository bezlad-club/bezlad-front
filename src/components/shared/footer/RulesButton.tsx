import { useState } from "react";
import RulesPopup from "./RulesPopup";
import Backdrop from "../backdrop/Backdrop";
import { motion } from "motion/react";
import { fadeInAnimation } from "@/utils/animationVariants";

interface RulesButtonProps {
  className?: string;
}

export default function RulesButton({ className }: RulesButtonProps) {
  const [isRulesPopupShown, setIsRulesPopupShown] = useState(false);

  return (
    <>
      <motion.div
        variants={fadeInAnimation({ delay: 0.4, y: 20 })}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className={`w-[162px] lg:w-[148px] ${className}`}
      >
        <motion.button
          onClick={() => setIsRulesPopupShown(true)}
          type="button"
          className="cursor-pointer w-[162px] lg:w-[148px] lg:mr-[54px] text-[16px] leading-[118.75%] font-semibold text-purple text-left uppercase xl:hover:brightness-150 transition-brightness duration-300"
        >
          Правила відвідування пісочниці
        </motion.button>
      </motion.div>
      <RulesPopup
        isRulesPopupShown={isRulesPopupShown}
        setIsRulesPopupShown={setIsRulesPopupShown}
      />
      <Backdrop
        isVisible={isRulesPopupShown}
        onClick={() => setIsRulesPopupShown(false)}
      />
    </>
  );
}
