import { Dispatch, SetStateAction } from "react";

import MainButton from "../../buttons/MainButton";

interface ContactUsHeaderProps {
  setIsHeaderMenuOpened: Dispatch<SetStateAction<boolean>>;
  onButtonClick?: () => void;
}

export default function ContactUsHeader({
  setIsHeaderMenuOpened,
  onButtonClick,
}: ContactUsHeaderProps) {
  return (
    <div className="max-w-[240px] mb-14 mx-auto">
      <h2 className="mb-4 font-azbuka text-[24px] leading-[120%] uppercase text-center">
        Хочете дізнатися більше про наш простір?
      </h2>
      <p className="mb-8 font-azbuka text-[16px] leading-[120%] text-center">
        Залиште свої дані, та менеджер зв&apos;яжеться з вами вже прямо зараз
      </p>
      <MainButton
        variant="outline"
        className="w-[240px] h-[43px] text-[10px] leading-[120%]"
        onClick={onButtonClick || (() => setIsHeaderMenuOpened(false))}
      >
        Зв&apos;язатися з нами
      </MainButton>
    </div>
  );
}
