import SectionTitle from "@/components/shared/titles/SectionTitle";
import Container from "@/components/shared/container/Container";
import { fadeInAnimation } from "@/utils/animationVariants";
import * as motion from "motion/react-client";
import { InteractiveZonesBlockDynamic } from "./interactiveZonesBlock/InteractiveZonesBlock";

export default function InteractiveZones() {
  return (
    <section id="interactive-zones" className="py-25 scroll-mt-[30px]">
      <Container>
        <div className="mb-22 md:mb-26 lg:mb-20 flex flex-col lg:items-center lg:flex-row gap-4.5 lg:gap-8">
          <SectionTitle>Інтерактивні зони</SectionTitle>
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
            className="text-[16px] leading-[120%] font-light lg:max-w-[296px]"
          >
            Деревина, вода, пісок, <br className="hidden lg:block" /> рослини -
            тут про природу, гармонію, заземлення та спокій.
          </motion.p>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInAnimation({
            x: 40,
            scale: 0.95,
            delay: 0.8,
          })}
        >
          <InteractiveZonesBlockDynamic />
        </motion.div>
      </Container>
    </section>
  );
}
