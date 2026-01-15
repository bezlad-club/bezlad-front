"use client";
import PriceListCard from "./PriceListCard";
import { Service } from "@/types/service";
import { SwiperWrapper } from "@/components/shared/swiper/SwiperWrapper";
import { SwiperSlide } from "swiper/react";
import { useScreenWidth } from "@/hooks/useScreenWidth";
import { motion } from "motion/react";
import { listVariants, listItemVariants } from "@/utils/animationVariants";
import AnimatedArrow from "@/components/shared/animatedArrow/AnimatedArrow";
import SpecialCard from "./SpecialCard";
import dynamic from "next/dynamic";
import { useRef, useState, useCallback } from "react";
import CartModal from "@/components/shared/cart/CartModal";
import OrderModal from "@/components/shared/orderModal/OrderModal";
import { useCart } from "@/hooks/useCart";
import { AppliedPromo } from "@/types/promoCode";

function PriceListBlock({ services }: { services: Service[] }) {
  const screenWidth = useScreenWidth();
  const [isCartModalShown, setIsCartModalShown] = useState(false);
  const [isOrderModalShown, setIsOrderModalShown] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<AppliedPromo | null>(null);

  const {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  } = useCart();

  const isMobileView = screenWidth < 640;

  const sectionRef = useRef<HTMLDivElement | null>(null);

  // TODO: Remove this after testing and add it to the services array in Sanity
  const newService: Service = {
    title: "Додатковий супроводжувач",
    price: "350",
    description: "Додатковий супроводжувач для вашої дитини",
  };

  const allServices = [...services, newService];

  const handleOpenCart = () => {
    setIsCartModalShown(true);
  };

  const handleCheckout = useCallback((promo?: AppliedPromo | null) => {
    const promoToUse = promo || null;
    setAppliedPromo(promoToUse);
    setIsCartModalShown(false);
    setIsOrderModalShown(true);
  }, []);

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
          <ul className="flex flex-col flex-wrap items-center gap-5 w-full">
            {allServices.map((service, index) => (
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
                  onAddToCart={addItem}
                  onOpenCart={handleOpenCart}
                  isInCart={isInCart(service.title)}
                  cartQuantity={getItemQuantity(service.title)}
                />
              </motion.li>
            ))}
          </ul>
        </motion.div>
        <SpecialCard />
        <CartModal
          isModalShown={isCartModalShown}
          setIsModalShown={setIsCartModalShown}
          items={cart.items}
          totalAmount={cart.totalAmount}
          totalItems={cart.totalItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onCheckout={handleCheckout}
          appliedPromo={appliedPromo}
          onPromoChange={setAppliedPromo}
        />
        <OrderModal
          isModalShown={isOrderModalShown}
          setIsModalShown={setIsOrderModalShown}
          cartItems={cart.items}
          totalAmount={cart.totalAmount}
          appliedPromo={appliedPromo}
          onClearCart={clearCart}
        />
      </>
    );
  }

  return (
    <>
      <div className="relative z-2 w-full flex flex-col gap-5">
        <AnimatedArrow className="text-white absolute top-[-144px] left-[45%] w-[295px] h-auto scale-y-[-1] rotate-[-8deg]" />
        <div className="w-full">
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
                slidesPerView: 4,
                spaceBetween: 20,
              },
            }}
            slidesPerView={1}
            slidesPerGroup={1}
            spaceBetween={20}
            navigation={true}
          >
            {allServices.map((service, index) => (
              <SwiperSlide key={index}>
                <PriceListCard
                  {...service}
                  onAddToCart={addItem}
                  onOpenCart={handleOpenCart}
                  isInCart={isInCart(service.title)}
                  cartQuantity={getItemQuantity(service.title)}
                />
              </SwiperSlide>
            ))}
          </SwiperWrapper>
        </div>
        <div className="w-full mt-5">
          <SpecialCard />
        </div>
      </div>
      <CartModal
        isModalShown={isCartModalShown}
        setIsModalShown={setIsCartModalShown}
        items={cart.items}
        totalAmount={cart.totalAmount}
        totalItems={cart.totalItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
        appliedPromo={appliedPromo}
        onPromoChange={setAppliedPromo}
      />
      <OrderModal
        isModalShown={isOrderModalShown}
        setIsModalShown={setIsOrderModalShown}
        cartItems={cart.items}
        totalAmount={cart.totalAmount}
        appliedPromo={appliedPromo}
        onClearCart={clearCart}
      />
    </>
  );
}

export default dynamic(() => Promise.resolve(PriceListBlock), {
  ssr: false,
});
