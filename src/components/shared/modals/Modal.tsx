import { Dispatch, ReactNode, SetStateAction } from "react";
import { twMerge } from "tailwind-merge";

import IconButton from "../buttons/IconButton";
import CrossIcon from "../icons/CrossIcon";

interface ModalProps {
  isModalShown: boolean;
  setIsModalShown: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  className?: string;
}

export default function Modal({
  isModalShown,
  setIsModalShown,
  children,
  className = "bg-white lg:bg-gray",
}: ModalProps) {
  return (
    <div
      className={twMerge(
        `${
          isModalShown
            ? " -translate-y-[calc(50dvh-50%)] opacity-100 scale-100"
            : "pointer-events-none opacity-0 scale-90"
        } fixed left-1/2 bottom-0 transform -translate-x-1/2 flex transition duration-600 ease-out z-70 w-[82%] max-w-[470px] lg:max-w-[568px] max-h-dvh
      px-5 lg:px-[45px] pt-11 pb-8 lg:py-14 rounded-[16px] lg:rounded-[20px] shadow-md bg-white lg:bg-gray`,
        className
      )}
    >
      <IconButton
        handleClick={() => setIsModalShown(false)}
        className="absolute top-4 lg:top-5 right-4 lg:right-5 w-8 h-8 z-30"
      >
        {<CrossIcon className="w-8 h-8" />}
      </IconButton>

      {children}
    </div>
  );
}
