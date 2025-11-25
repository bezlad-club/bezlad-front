import { Dispatch, SetStateAction } from "react";
import Modal from "../modals/Modal";
import AnimatedAnimal from "../animatedAnimal/AnimatedAnimal";
import Image from "next/image";

interface NotificationPopUpProps {
  title: string;
  description: string;
  isPopUpShown: boolean;
  setIsPopUpShown: Dispatch<SetStateAction<boolean>>;
}

export default function NotificationPopUp({
  title,
  description,
  isPopUpShown,
  setIsPopUpShown,
}: NotificationPopUpProps) {
  return (
    <Modal
      isModalShown={isPopUpShown}
      setIsModalShown={setIsPopUpShown}
      className="overflow-hidden"
    >
      <div className="relative flex flex-col justify-center items-center w-full py-10">
        <h3 className="mb-4 font-azbuka text-[28px] lg:text-[36px] font-normal leading-[120%] text-center uppercase">
          {title}
        </h3>
        <p className="mb-[281px] text-[14px] font-normal leading-[120%] text-center">
          {description}
        </p>
        <div className="absolute left-[calc(50%-262px)] lg:left-[-93px] bottom-[-30px] lg:bottom-[-62px] w-[311px] h-[284px] lg:w-[353px] lg:h-[321px]">
          <AnimatedAnimal
            svgPath="/images/animals/animal.svg"
            className="w-[311px] h-[284px] lg:w-[353px] lg:h-[321px]"
            maxPupilMovement={3}
          />
        </div>
        <div className="absolute z-10 left-[calc(50%-73px)] lg:left-[196px] bottom-[-30px] lg:bottom-[-57px] w-[120px] h-[159px] lg:w-[160px] lg:h-[213px]">
          <AnimatedAnimal
            svgPath="/images/animals/animalYellowSmall.svg"
            className="w-[120px] h-auto lg:w-[160px] lg:h-[213px]"
            maxPupilMovement={3}
          />
        </div>
        <div className="absolute left-[calc(50%+31px)] lg:left-[285px] bottom-[-43px] lg:bottom-[-108px] w-[183px] lg:w-[269px] h-auto aspect-259/359">
          <Image
            src="/images/notifications/bucket.svg"
            width="269"
            height="388"
            className="w-[183px] lg:w-[258px] h-auto"
            alt="bucket"
          />
        </div>
      </div>
    </Modal>
  );
}
