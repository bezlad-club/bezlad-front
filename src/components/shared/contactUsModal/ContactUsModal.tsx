"use client";
import { useState, Dispatch, SetStateAction } from "react";
import Modal from "../modals/Modal";
import Backdrop from "../backdrop/Backdrop";
import NotificationPopUp from "../notifications/NotificationPopUp";
import ContactUsForm from "@/components/shared/forms/ContactUsForm";

interface ContactUsModalProps {
  isModalShown: boolean;
  setIsModalShown: Dispatch<SetStateAction<boolean>>;
}

export default function ContactUsModal({
  isModalShown,
  setIsModalShown,
}: ContactUsModalProps) {
  const [isNotificationShown, setIsNotificationShown] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <>
      <Modal
        isModalShown={isModalShown}
        setIsModalShown={setIsModalShown}
        className="pb-5 lg:pb-[22px] pr-2 lg:pr-8"
      >
        <div
          className="flex-1 pr-3 overflow-y-auto scrollbar scrollbar-w-[3px] lg:scrollbar-w-[4px] scrollbar-thumb-rounded-full 
              scrollbar-track-rounded-full scrollbar-thumb-purple scrollbar-track-purple/10"
        >
          <h2 className="mb-4 font-azbuka text-[24px] lg:text-[35px] font-normal leading-[120%] text-center uppercase">
            Маєте питання чи хочете дізнатися більше про наш простір?
          </h2>
          <p className="mb-7 lg:mb-4 text-[14px] font-normal leading-[120%] text-center">
            Заповніть форму — і ми зв’яжемось із вами найближчим часом.
          </p>
          <ContactUsForm
            setIsError={setIsError}
            setIsNotificationShown={setIsNotificationShown}
            setIsModalShown={setIsModalShown}
          />
        </div>
      </Modal>
      <NotificationPopUp
        title={
          isError ? "На жаль, щось пішло не так" : "Ваше повідомлення надіслано"
        }
        description={
          isError
            ? "Спробуйте відправити форму пізніше або зателефонуйте нам."
            : "Ми отримали ваше повідомлення і зв’яжемось із вами найближчим часом."
        }
        isPopUpShown={isNotificationShown}
        setIsPopUpShown={setIsNotificationShown}
      />
      <Backdrop
        isVisible={isModalShown || isNotificationShown}
        onClick={() => {
          setIsModalShown(false);
          setIsNotificationShown(false);
        }}
      />
    </>
  );
}
