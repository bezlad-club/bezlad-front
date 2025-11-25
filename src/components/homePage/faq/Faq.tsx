import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";
import Container from "@/components/shared/container/Container";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import FaqList from "./FaqList";
import FaqImages from "./FaqImages";

export default function Faq() {
  return (
    <section
      id="faq"
      className="pt-25 lg:pt-[140px] pb-25 lg:pb-[132px] scroll-mt-[85px]"
    >
      <Container className="relative">
        <FaqImages />
        <div className="flex flex-col gap-6 lg:flex-row-reverse lg:justify-between lg:items-center mb-9 lg:mb-[43px]">
          <SectionTitle
            animationDirection="left"
            className="text-[24px] lg:text-[53px] font-normal leading-[120%] lg:text-right"
          >
            Відповіді на Ваші запитання
          </SectionTitle>
          <motion.p
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.8 }}
            variants={fadeInAnimation({
              x: -30,
              scale: 0.9,
            })}
            className="max-w-[297px]"
          >
            Ми розуміємо, що перед першим візитом у батьків може бути безліч
            питань — від того, як усе організовано, до того, чи сподобається
            дитині.
          </motion.p>
        </div>
        <FaqList />
      </Container>
    </section>
  );
}
