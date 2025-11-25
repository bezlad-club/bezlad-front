"use client";
import { useState } from "react";
import StarIcon from "@/components/shared/icons/StarIcon";

interface FaqItemProps {
  faqItem: { question: string; answer: string };
  idx: number;
}

export default function FaqItem({ faqItem }: FaqItemProps) {
  const [isShownMore, setIsShownMore] = useState(false);
  const toggleShowMore = () => setIsShownMore(!isShownMore);

  const { question, answer } = faqItem;

  return (
    <li onClick={toggleShowMore} className={`relative group cursor-pointer`}>
      <div
        className={`relative flex items-center gap-6 justify-between px-5 lg:px-8 py-5.5 lg:py-6.5
            rounded-full bg-white/6 shadow-[inset_0px_4px_12px_rgba(255,255,255,0.06)] backdrop-blur-[38px] xl:group-hover:bg-purple-ultra-light 
            transition-colors duration-700 ease-in-out will-change-transform `}
      >
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "linear-gradient(129.84deg, #000000 27.26%, #FFFFFF 97.59%)",
            padding: "1px",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
        <h3 className={`text-[14px] lg:text-[20px] font-normal leading-[120%]`}>
          {question}
        </h3>
        <StarIcon
          className={`size-5 lg:size-8 shrink-0 text-purple transition duration-300 ease-in-out will-change-transform ${
            isShownMore ? "rotate-45" : "rotate-0"
          }`}
        />
      </div>
      <div
        className={`relative overflow-hidden transition-[max-height,opacity] duration-700 will-change-transform mt-1 backdrop-blur-[38px] rounded-[40px] ${
          isShownMore
            ? "max-h-[800px] ease-in opacity-100"
            : "max-h-0 ease-out opacity-0"
        }`}
      >
        <div
          className={`relative px-5 lg:px-8 py-5.5 lg:py-6.5 text-[12px] lg:text-[16px] font-light leading-[120%] text-black
            bg-white/6 shadow-[inset_0px_4px_12px_rgba(255,255,255,0.06)] rounded-[40px]`}
        >
          {answer}
          <div
            className="absolute inset-0 rounded-[40px] pointer-events-none px-5 lg:px-8 py-5.5 lg:py-6.5"
            style={{
              background:
                "linear-gradient(129.84deg, #000000 27.26%, #FFFFFF 97.59%)",
              padding: "0.8px",
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
        </div>
      </div>
    </li>
  );
}
