"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { headerVariants } from "@/utils/animationVariants";
import PhoneIcon from "../icons/PhoneIcon";
import TelegramIcon from "../icons/TelegramIcon";
import { PHONE, TELEGRAM_URL } from "@/constants/constants";

export default function CallButton() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Закриваємо меню при кліку поза межами
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.1 }}
      variants={headerVariants}
      ref={containerRef}
      className="fixed z-40 bottom-34 lg:bottom-14 right-6
      sm:right-[calc(max(0px,(100vw-640px)/2)+1.5rem)]
      md:right-[calc(max(0px,(100vw-48rem)/2)+1.5rem)]
      lg:right-[calc(max(0px,(100vw-64rem)/2)+2rem)]
      xl:right-[calc(max(0px,(100vw-80rem)/2)+2rem)]
      flex flex-col items-center gap-3"
    >
      {/* Синя кнопка (Telegram) - зверху */}
      <a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={`block transition duration-300 ease-in-out will-change-transform delay-100 ${isOpen ? "opacity-100 scale-100 translate-y-0 translate-x-0 pointer-events-auto" : "opacity-0 scale-70 translate-y-2 -translate-x-5 pointer-events-none"}`}
      >
        <button
          type="button"
          aria-label="telegram button"
          onClick={() => {
            setIsOpen(false);
          }}
          className={`group flex items-center justify-center cursor-pointer size-11 lg:size-14 rounded-full 
      bg-blue-400 xl:hover:brightness-110 active:scale-95 transition duration-300 ease-in-out will-change-transform
     `}
        >
          <div className="absolute inset-0 -z-10 rounded-full xl:group-hover:translate-y-1 xl:group-hover:bg-blue-400/60 blur-md transition duration-300 ease-in-out" />
          <TelegramIcon className="size-6 lg:size-8 text-white" />
        </button>
      </a>

      {/* Фіолетова кнопка - посередині */}
      <a
        href={`tel:${PHONE}`}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className={`block transition duration-300 ease-in-out will-change-transform ${isOpen ? "opacity-100 scale-100 translate-y-0 translate-x-0 pointer-events-auto" : "opacity-0 scale-70 translate-y-2 -translate-x-5 pointer-events-none"}`}
      >
        <button
          type="button"
          aria-label="call button"
          onClick={() => {
            setIsOpen(false);
          }}
          className={`group flex items-center justify-center cursor-pointer size-11 lg:size-14 rounded-full 
      bg-purple xl:hover:brightness-110 active:scale-95 transition duration-300 ease-in-out will-change-transform
      `}
        >
          <div className="absolute inset-0 -z-10 rounded-full xl:group-hover:translate-y-1 xl:group-hover:bg-purple/60 blur-md transition duration-300 ease-in-out" />
          <PhoneIcon className="size-6 lg:size-8 text-white" />
        </button>
      </a>

      {/* Чорна головна кнопка - внизу */}
      <button
        type="button"
        aria-label="toggle call buttons"
        onClick={toggleMenu}
        className="group relative flex items-center justify-center cursor-pointer size-[52px] lg:size-[68px] rounded-full 
      bg-black xl:hover:brightness-125 xl:hover:-translate-y-1 active:scale-95 transition duration-300 ease-in-out will-change-transform"
      >
        <div className="absolute inset-0 -z-10 rounded-full xl:group-hover:translate-y-1 xl:group-hover:bg-black/50 blur-md transition duration-300 ease-in-out" />
        <PhoneIcon className="size-7 lg:size-9 text-white" />
      </button>
    </motion.div>
  );
}
