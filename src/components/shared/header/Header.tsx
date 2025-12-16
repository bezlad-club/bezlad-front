"use client";
import { useState } from "react";
import Container from "../container/Container";
import Navigation from "./navigation/Navigation";
import clsx from "clsx";
import { useScroll, useMotionValueEvent } from "motion/react";
import MainButton from "../buttons/MainButton";
import Logo from "../icons/Logo";
import StarIcon from "../icons/StarIcon";
import CartIcon from "../icons/CartIcon";
import Link from "next/link";
import BurgerButton from "./burgerMenu/BurgerButton";
import BurgerMenu from "./burgerMenu/BurgerMenu";
import { motion } from "motion/react";
import { headerVariants } from "@/utils/animationVariants";
import CartModal from "../cart/CartModal";
import OrderModal from "../orderModal/OrderModal";
import { useCart } from "@/hooks/useCart";

export default function Header() {
  const { scrollY } = useScroll();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isHeaderMenuOpened, setIsHeaderMenuOpened] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const { cart, removeItem, updateQuantity, clearCart } = useCart();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrollPosition(latest);
  });

  const handleCheckout = () => {
    setIsCartModalOpen(false);
    setIsOrderModalOpen(true);
  };

  return (
    <motion.header
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.1 }}
      variants={headerVariants}
      className={clsx(
        "fixed left-0 right-0 z-50 py-2 transition-top duration-300 ease-in-out rounded-full top-[25px]"
      )}
    >
      <div
        className={`absolute left-2 right-2 -z-10 inset-0 rounded-full ${
          scrollPosition > 50
            ? "bg-white/25 shadow-[inset_0px_4px_12.6px_rgba(255,255,255,0.25)] backdrop-blur-[38px]"
            : ""
        }`}
      />
      <Container className="w-full pr-[19px]">
        <div className="flex items-center justify-between">
          <Link href="/" className="outline-none">
            <Logo className="w-[55px] h-[51px] lg:w-[71.4px] lg:h-[65.69px]" />
          </Link>
          <div className="flex items-center lg:gap-6 space-between gap-4.5">
            <Navigation className="hidden lg:block" />
            <StarIcon className="hidden lg:block text-black" />

            <button
              onClick={() => setIsCartModalOpen(true)}
              className="relative outline-none transition-transform duration-200 hover:scale-110 active:scale-95 cursor-pointer"
              aria-label="Відкрити корзину"
            >
              <CartIcon className="text-black" itemCount={cart.totalItems} />
            </button>

            <Link href="/#price-list">
              <MainButton
                className="w-[175px] h-[43px] lg:w-[219px] lg:h-13.5 text-[10px] leading-[120%] lg:text-[12px]"
                variant="outline"
              >
                Забронювати відвідування
              </MainButton>
            </Link>

            <BurgerButton setIsHeaderMenuOpened={setIsHeaderMenuOpened} />
            <BurgerMenu
              isHeaderMenuOpened={isHeaderMenuOpened}
              setIsHeaderMenuOpened={setIsHeaderMenuOpened}
            />
          </div>
        </div>
      </Container>

      <CartModal
        isModalShown={isCartModalOpen}
        setIsModalShown={setIsCartModalOpen}
        items={cart.items}
        totalAmount={cart.totalAmount}
        totalItems={cart.totalItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={handleCheckout}
      />
      <OrderModal
        isModalShown={isOrderModalOpen}
        setIsModalShown={setIsOrderModalOpen}
        cartItems={cart.items}
        totalAmount={cart.totalAmount}
        onClearCart={clearCart}
      />
    </motion.header>
  );
}
