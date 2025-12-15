"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { fadeInAnimation, headerVariants } from "@/utils/animationVariants";
import MainButton from "@/components/shared/buttons/MainButton";
import Container from "@/components/shared/container/Container";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import CTAImages from "./CTAImages";
import AnimatedArrow from "../../shared/animatedArrow/AnimatedArrow";
import ContactUsModal from "../../shared/contactUsModal/ContactUsModal";

export default function CTAContactUs() {
  const [isModalShown, setIsModalShown] = useState(false);

  return (
    <>
      <motion.section
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.1 }}
        variants={headerVariants}
        className="relative max-w-7xl mx-auto bg-purple-ultra-light rounded-4xl overflow-hidden"
      >
        <CTAImages />
        <Container className="relative z-10 pt-[58px] md:pt-[74px] pb-5 md:pb-[87px]">
          <AnimatedArrow
            key="mobile-arrow"
            className="md:hidden absolute -top-4 right-2.5 w-32 h-auto rotate-[-130deg]"
          />
          <SectionTitle className="mb-7 md:max-w-[350px] lg:max-w-[594px]">
            Дозвольте дитині грати природно вже сьогодні
          </SectionTitle>
          <motion.p
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.8 }}
            variants={fadeInAnimation({ y: 30, delay: 0.4 })}
            className="md:max-w-[290px] lg:max-w-[348px] mb-[260px] md:mb-12 text-[14px] lg:text-[16px] font-normal leading-[120%]"
          >
            «Безлад» — простір, де дитина досліджує, грає і розвивається серед
            природи, а батьки насолоджуються спокоєм. Зробіть перший крок до
            гармонійного дитинства вже зараз!
          </motion.p>
          <div className="relative">
            <motion.div
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: true, amount: 0.1 }}
              variants={fadeInAnimation({ scale: 0.9, delay: 0.8 })}
            >
              <MainButton
                className="h-[54px] xs:max-w-[301px] xs:mx-auto md:mx-0 text-[12px] font-normal leading-[120%]"
                onClick={() => setIsModalShown(true)}
              >
                Зв’язатися з нами
              </MainButton>
            </motion.div>
            <AnimatedArrow
              delay={1}
              key="desktop-arrow"
              className="hidden md:block absolute left-[244px] bottom-[-63px] w-[120px] lg:w-[209px] h-auto"
            />
          </div>
        </Container>
      </motion.section>
      <ContactUsModal
        isModalShown={isModalShown}
        setIsModalShown={setIsModalShown}
      />
    </>
  );
}
