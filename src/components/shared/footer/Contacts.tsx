import {
  ADDRESS,
  ADDRESS_URL,
  EMAIL,
  PHONE,
  SCHEDULE,
} from "@/constants/constants";
import { contactsPhoneRegex } from "@/regex/regex";
import { fadeInAnimation, listVariants } from "@/utils/animationVariants";
import { motion } from "motion/react";

interface ContactsProps {
  className?: string;
}

export default function Contacts({ className }: ContactsProps) {
  return (
    <motion.address
      variants={listVariants({ delayChildren: 0.4 })}
      initial="hidden"
      whileInView="visible"
      exit="exit"
      viewport={{ once: true, amount: 0.1 }}
      className={`not-italic lg:w-[566px] ${className}`}
    >
      <div className="sm:h-[147px] flex flex-col sm:flex-row sm:justify-between lg:h-auto sm:w-[374px] lg:w-full">
        <div className="lg:flex lg:mr-[54px]">
          <motion.div
            variants={fadeInAnimation({ delay: 0.2, y: 20 })}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.1 }}
            className="mb-8 sm:mb-[27px] lg:mb-0 lg:mr-[54px]"
          >
            <h3 className="text-[14px] leading-[150%] font-light mb-[3px]">
              Графік роботи
            </h3>
            <p className="text-[16px] leading-[118.75%] uppercase font-semibold mb-px">
              {SCHEDULE[0]}
            </p>
            <p className="text-[12px] leading-[116.67%] uppercase font-semibold">
              {SCHEDULE[1]}
            </p>
          </motion.div>
          <motion.div
            variants={fadeInAnimation({ delay: 0.4, y: 20 })}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.1 }}
            className="mb-8 sm:mb-0"
          >
            <h3 className="text-[14px] leading-[150%] font-light mb-[3px]">
              Наша адреса
            </h3>
            <a
              href={ADDRESS_URL}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-[12px] leading-[150%] uppercase font-semibold max-w-[162px] whitespace-pre-line xl:hover:text-purple transition-colors duration-300"
            >
              {ADDRESS}
            </a>
          </motion.div>
        </div>
        <div className="">
          <motion.div
            variants={fadeInAnimation({ delay: 0.6, y: 20 })}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.1 }}
            className="mb-[27px] sm:mb-[33px]"
          >
            <h3 className="text-[14px] leading-[114.29%] font-light mb-3">
              Зателефонуйте:
            </h3>
            <a
              href={`tel:${PHONE}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-[16px] leading-[118.75%] uppercase font-semibold xl:hover:text-purple transition-colors duration-300"
            >
              {PHONE.replace(contactsPhoneRegex, "+38 $1 $2 $3 $4")}
            </a>
          </motion.div>
          <motion.div
            variants={fadeInAnimation({ delay: 0.8, y: 20 })}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.1 }}
            className="lg:ml-auto"
          >
            <h3 className="text-[14px] leading-[114.29%] font-light mb-3">
              Або напишіть нам:
            </h3>
            <a
              href={`mailto:${EMAIL}`}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-[16px] sm:text-[12px] lg:text-[16px] leading-[118.75%] uppercase font-bold xl:hover:text-purple transition-colors duration-300"
            >
              {EMAIL}
            </a>
          </motion.div>
        </div>
      </div>
    </motion.address>
  );
}
