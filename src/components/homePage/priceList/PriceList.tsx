"use client";

import Container from "@/components/shared/container/Container";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import PriceListImages from "./PriceListImages";
import { headerVariants } from "@/utils/animationVariants";
import { motion } from "motion/react";
import { fadeInAnimation } from "@/utils/animationVariants";
import StarIcon from "@/components/shared/icons/StarIcon";
import PriceListBlock from "./priceListBlock/PriceListBlock";
import { Service } from "@/types/service";

export default function PriceList({ services }: { services: Service[] }) {
  if (!services || !Array.isArray(services) || services.length === 0) {
    return null;
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.1 }}
      variants={headerVariants}
      id="price-list"
      className="relative mb-25 lg:mb-[132px] max-w-7xl mx-auto pt-10 pb-18.5 lg:pt-11 md:pb-[43px] scroll-mt-[85px] bg-purple rounded-4xl overflow-hidden"
    >
      <PriceListImages />
      <Container className="relative">
        <div className="lg:flex lg:flex-row-reverse lg:items-center lg:justify-between mb-19 lg:mb-[81px]">
          <SectionTitle className="text-white flex items-center gap-4 mb-6 lg:gap-7 lg:mb-0">
            <motion.span
              initial="hidden"
              whileInView="visible"
              exit="exit"
              viewport={{ once: true, amount: 0.8 }}
              variants={fadeInAnimation({
                x: 20,
                delay: 0.2,
                scale: 0.9,
              })}
              className="w-[47px] h-[47px] flex items-center justify-center"
            >
              <StarIcon className="w-[37px] h-[37px]" />
            </motion.span>
            Ціни
          </SectionTitle>
          <motion.p
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.1 }}
            variants={fadeInAnimation({ y: 30, delay: 0.4 })}
            className="text-white text-base leading-[120%] lg:max-w-[277px]"
          >
            Ми прагнемо, щоб якісний розвиток і спокійна атмосфера були
            доступними кожній дитині. Оберіть формат, який підходить вашій
            родині.
          </motion.p>
        </div>
        <PriceListBlock services={services} />
      </Container>
    </motion.section>
  );
}
