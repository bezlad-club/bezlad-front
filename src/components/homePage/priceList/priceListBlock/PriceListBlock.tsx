"use client";
import PriceListCard from "./PriceListCard";
import { Service } from "@/types/service";
import { SwiperWrapper } from "@/components/shared/swiper/SwiperWrapper";
import { SwiperSlide } from "swiper/react";
import { useScreenWidth } from "@/hooks/useScreenWidth";
import { motion } from "framer-motion";
import { listVariants, listItemVariants } from "@/utils/animationVariants";
import AnimatedArrow from "@/components/shared/animatedArrow/AnimatedArrow";
import SpecialCard from "./SpecialCard";
import dynamic from "next/dynamic";
import Pagination from "@/components/shared/pagination/Pagination";
import { useRef, useState } from "react";
import OrderModal from "@/components/shared/orderModal/OrderModal";

function PriceListBlock({ services }: { services: Service[] }) {
  const screenWidth = useScreenWidth();
  const [isOrderModalShown, setIsOrderModalShown] = useState(false);
  const [selectedPaymentUrl, setSelectedPaymentUrl] = useState<
    string | undefined
  >(undefined);

  const isMobileView = screenWidth < 640;

  const itemsPerPage = 3;

  const sectionRef = useRef<HTMLDivElement | null>(null);

  if (isMobileView) {
    return (
      <>
        <motion.div
          ref={sectionRef}
          initial="hidden"
          whileInView="visible"
          exit="exit"
          viewport={{ once: true, amount: 0.05 }}
          variants={listVariants({
            staggerChildren: 0.3,
            delayChildren: 0.2,
          })}
          className="relative z-2 w-full flex flex-col items-center gap-5 mb-[75px] mx-auto"
        >
          <AnimatedArrow className="md:hidden text-white absolute w-[195px] h-auto scale-y-[-1] left-1/2 translate-x-[57px] rotate-[-8deg] top-[-73px]" />
          <Pagination
            items={services}
            useItemsPerPage={() => itemsPerPage}
            scrollTargetRef={sectionRef}
            renderItems={(currentItems) => (
              <ul className="flex flex-col flex-wrap items-center gap-5 w-full">
                {currentItems.map((service, index) => (
                  <motion.li
                    initial="hidden"
                    whileInView="visible"
                    exit="exit"
                    viewport={{ once: true, amount: 0.1 }}
                    variants={listItemVariants}
                    key={`${service?.title}-${index}`}
                    className="w-full h-auto"
                  >
                    <PriceListCard
                      {...service}
                      onBookClick={(paymentUrl) => {
                        setSelectedPaymentUrl(paymentUrl);
                        setIsOrderModalShown(true);
                      }}
                    />
                  </motion.li>
                ))}
              </ul>
            )}
          />
        </motion.div>
        <SpecialCard />
        <OrderModal
          isModalShown={isOrderModalShown}
          setIsModalShown={setIsOrderModalShown}
          paymentUrl={selectedPaymentUrl}
        />
      </>
    );
  }

  return (
    <>
      <motion.div
        initial="hidden"
        whileInView="visible"
        exit="exit"
        viewport={{ once: true, amount: 0.1 }}
        variants={listItemVariants}
        className="relative z-2 w-full flex items-start justify-between gap-5"
      >
        <AnimatedArrow className="text-white absolute top-[-144px] left-[45%] w-[295px] h-auto scale-y-[-1] rotate-[-8deg]" />
        <SwiperWrapper
          breakpoints={{
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            1280: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
          slidesPerView="auto"
          slidesPerGroup={1}
          spaceBetween={20}
          navigation={true}
        >
          {services.map((service, index) => (
            <SwiperSlide key={index}>
              <PriceListCard
                {...service}
                onBookClick={(paymentUrl) => {
                  setSelectedPaymentUrl(paymentUrl);
                  setIsOrderModalShown(true);
                }}
              />
            </SwiperSlide>
          ))}
        </SwiperWrapper>
        <SpecialCard />
      </motion.div>
      <OrderModal
        isModalShown={isOrderModalShown}
        setIsModalShown={setIsOrderModalShown}
        paymentUrl={selectedPaymentUrl}
      />
    </>
  );
}

export default dynamic(() => Promise.resolve(PriceListBlock), {
  ssr: false,
});
