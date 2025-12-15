"use client";

import { useState, Dispatch, SetStateAction } from "react";

import CloseButton from "./CloseButton";
import Navigation from "../navigation/Navigation";
import ContactUsHeader from "./ContactUsHeader";
import Image from "next/image";
import AnimatedArrow from "../../animatedArrow/AnimatedArrow";
import { motion } from "motion/react";
import { fadeInAnimation } from "@/utils/animationVariants";
import ContactUsModal from "../../contactUsModal/ContactUsModal";

interface BurgerMenuMobTabProps {
  isHeaderMenuOpened: boolean;
  setIsHeaderMenuOpened: Dispatch<SetStateAction<boolean>>;
}

export default function BurgerMenu({
  isHeaderMenuOpened,
  setIsHeaderMenuOpened,
}: BurgerMenuMobTabProps) {
  const [isModalShown, setIsModalShown] = useState(false);

  return (
    <>
      <div
        className={`${
          isHeaderMenuOpened
            ? "translate-x-0 opacity-100 no-doc-scroll"
            : "translate-x-full opacity-0"
        } fixed top-0 left-0 right-0 z-[60] w-full h-dvh tab:w-[514px] tab:left-auto bg-white 
      transition duration-600 overflow-hidden`}
      >
        <div className="h-full overflow-y-auto">
          <div className="relative container flex flex-col items-center max-w-full py-14 px-[60px] xl:px-[98px]">
            <div className="z-10">
              <CloseButton setIsHeaderMenuOpened={setIsHeaderMenuOpened} />
              <ContactUsHeader
                setIsHeaderMenuOpened={setIsHeaderMenuOpened}
                onButtonClick={() => {
                  setIsHeaderMenuOpened(false);
                  setIsModalShown(true);
                }}
              />
              <Navigation
                className="block w-full mx-auto max-w-[240px]"
                variant="burger"
                setIsHeaderMenuOpened={setIsHeaderMenuOpened}
              />
            </div>
          </div>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInAnimation({ delay: 0.2 })}
          className="absolute w-[552.57px] h-[475.75px] -bottom-[114px] left-1/2 -translate-x-1/2 pointer-events-none"
        >
          <Image
            src="/images/mobileMenu/leaves.svg"
            alt="leaves"
            width={552.57}
            height={475.75}
            className="object-cover"
          />
          <AnimatedArrow className="w-[237.43px] h-[133.81px] absolute bottom-[130px] left-1/2 translate-x-[calc(-50%+75px)] text-black scale-y-[-1] rotate-110" />
        </motion.div>
      </div>
      <ContactUsModal
        isModalShown={isModalShown}
        setIsModalShown={setIsModalShown}
      />
    </>
  );
}
