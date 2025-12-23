"use client";
import { Form, Formik } from "formik";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";

import { useOrderFormValidation } from "@/schemas/orderFormValidation";

import CustomizedInput from "../formComponents/CustomizedInput";
import MainButton from "../buttons/MainButton";
import { CartItem } from "@/types/cart";
import { AppliedPromo } from "@/types/promoCode";

export interface ValuesOrderFormType {
  name: string;
  phone: string;
  email: string;
  message: string;
}

interface OrderFormProps {
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  setIsModalShown?: Dispatch<SetStateAction<boolean>>;
  className?: string;
  cartItems?: CartItem[];
  appliedPromo?: AppliedPromo | null;
  onClearCart?: () => void;
}

export default function OrderForm({
  setIsError,
  setIsNotificationShown,
  setIsModalShown,
  className = "",
  cartItems = [],
  appliedPromo,
}: OrderFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    name: "",
    phone: "",
    email: "",
    message: "",
  };

  const validationSchema = useOrderFormValidation();

  const submitForm = async (
    values: ValuesOrderFormType,
  ) => {

    try {
      setIsError(false);
      setIsLoading(true);

      if (cartItems.length > 0) {
        const telegramData =
          `<b>Заявка "Форма бронювання відвідування"</b>\n` +
          `<b>Ім'я:</b> ${values.name.trim()}\n` +
          `<b>Телефон:</b> ${values.phone.trim().replace(/(?!^)\D/g, "")}\n` +
          `<b>Email:</b> ${values.email.trim()}\n` +
          `<b>Побажання:</b> ${values.message.trim()}\n`;

        await axios({
          method: "post",
          url: "/api/telegram",
          data: telegramData,
          headers: {
            "Content-Type": "application/json",
          },
        });

        const paymentResponse = await axios.post("/api/way-for-pay/purchase", {
          cartItems: cartItems.map((item) => ({
            _id: item._id,
            quantity: item.quantity,
          })),
          clientInfo: {
            name: values.name,
            phone: values.phone,
            email: values.email,
          },
          promo: appliedPromo?.code,
        });

        const { url } = paymentResponse.data;
        if (url) {
          window.location.href = url;
        } else {
          console.error("No payment URL returned");
          setIsError(true);
        }

        // Do not reset or clear cart immediately, let the redirect happen
        // resetForm();
        return;
      }
    } catch (error) {
      setIsError(true);
      if (setIsModalShown) {
        setIsModalShown(false);
      }
      setIsNotificationShown(true);
      return error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={submitForm}
      validationSchema={validationSchema}
    >
      {({ dirty, isValid }) => (
        <Form className={`${className}`}>
          <div className="flex flex-col w-full gap-y-3 lg:gap-y-3.5 mb-4 lg:mb-[26px]">
            <CustomizedInput fieldName="name" label="Імʼя" />
            <CustomizedInput
              fieldName="phone"
              label="Телефон"
              inputType="tel"
            />
            <CustomizedInput
              fieldName="email"
              label="Email"
              inputType="email"
            />
            <CustomizedInput
              fieldName="message"
              label="Побажання"
              as="textarea"
              fieldClassName="h-[83px] lg:h-[110px]"
            />
          </div>
          <MainButton
            type="submit"
            disabled={!(dirty && isValid) || isLoading}
            isLoading={isLoading}
            loadingText="Надсилання..."
            className="h-14 px-5 lg:px-5 text-[14px] lg:text-[16px]"
          >
            ПЕРЕЙТИ ДО ОПЛАТИ
          </MainButton>
        </Form>
      )}
    </Formik>
  );
}
