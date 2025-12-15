"use client";

import Link from "next/link";
import Container from "../shared/container/Container";
import MainButton from "../shared/buttons/MainButton";
import ConfirmationImages from "./ConfirmationImages";
import { motion } from "motion/react";
import { fadeInAnimation } from "@/utils/animationVariants";

export default function Confirmation() {
  return (
    <section className="">
      <Container className="relative pt-[173px] lg:pt-48 pb-[347px] lg:pb-[432px]">
        <ConfirmationImages />
        <motion.h1
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.8 }}
          variants={fadeInAnimation({
            x: 50,
            y: -50,
            scale: 0.93,
          })}
          className="mb-4 font-azbuka text-[28px] lg:text-[36px] font-normal leading-[120%] uppercase text-center"
        >
          Дякуємо за бронювання!
        </motion.h1>
        <motion.p
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.8 }}
          variants={fadeInAnimation({
            y: 20,
            x: -20,
            scale: 0.95,
            delay: 0.4,
          })}
          className="max-w-[352px] mx-auto mb-6 text-[14px] font-normal leading-[120%] text-center"
        >
          Ми отримали вашу оплату. Чекаємо на вас у робочі години простору.
        </motion.p>
        <motion.div
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.8 }}
          variants={fadeInAnimation({
            scale: 0.95,
            delay: 0.8,
          })}
        >
          <Link href="/" className="block max-w-[346px] mx-auto">
            <MainButton className="h-[66px]">на головну</MainButton>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
}
