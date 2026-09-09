"use client";
import { Form, Formik } from "formik";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";

import { useOrderFormValidation } from "@/schemas/orderFormValidation";

import CustomizedInput from "../formComponents/CustomizedInput";
import CustomizedCheckbox from "../formComponents/CustomizedCheckbox";
import MainButton from "../buttons/MainButton";
import { CartItem } from "@/types/cart";
import { AppliedPromo } from "@/types/promoCode";
import { isSlottedCartItem, getCartItemAmount, roundToCoins } from "@/utils/cartUtils";
import { formatDateShortUk } from "@/utils/dateUtils";
import Link from "next/link";

export interface ValuesOrderFormType {
  name: string;
  phone: string;
  email: string;
  message: string;
  termsAccepted: boolean;
}

interface OrderFormProps {
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  setIsModalShown?: Dispatch<SetStateAction<boolean>>;
  setErrorMessage?: (message: string | null) => void;
  className?: string;
  cartItems?: CartItem[];
  appliedPromo?: AppliedPromo | null;
  onClearCart?: () => void;
}

const getServerErrorMessage = (error: unknown): string | null => {
  if (axios.isAxiosError(error)) {
    const data: unknown = error.response?.data;
    if (data && typeof data === "object" && "error" in data) {
      const message = (data as { error?: unknown }).error;
      if (typeof message === "string" && message.length > 0) {
        return message;
      }
    }
  }
  return null;
};

export default function OrderForm({
  setIsError,
  setIsNotificationShown,
  setIsModalShown,
  setErrorMessage,
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
    termsAccepted: false,
  };

  const validationSchema = useOrderFormValidation();

  const submitForm = async (values: ValuesOrderFormType) => {
    try {
      setIsError(false);
      setErrorMessage?.(null);
      setIsLoading(true);

      if (cartItems.length > 0) {
        const slottedItems = cartItems.filter(isSlottedCartItem);

        const telegramData =
          `<b>Заявка "Форма бронювання відвідування"</b>\n` +
          `<b>Ім'я:</b> ${values.name.trim()}\n` +
          `<b>Телефон:</b> ${values.phone.trim().replace(/(?!^)\D/g, "")}\n` +
          `<b>Email:</b> ${values.email.trim()}\n` +
          `<b>Побажання:</b> ${values.message.trim()}\n` +
          (slottedItems.length > 0
            ? `<b>Квитки за слотами:</b>\n${slottedItems
                .map(
                  (item) =>
                    `${item.title} — ${formatDateShortUk(
                      item.date
                    )} ${item.startTime} - ${
                      item.endTime
                    } — Діти: ${item.childrenQty ?? 0} × ${item.price} грн, Дорослі: ${
                      item.adultsQty ?? 0
                    } × ${item.adultPrice ?? 0} грн — Разом: ${roundToCoins(
                      getCartItemAmount(item)
                    )} грн`
                )
                .join("\n")}\n`
            : "");

        await axios({
          method: "post",
          url: "/api/telegram",
          data: telegramData,
          headers: {
            "Content-Type": "application/json",
          },
        });

        const purchaseItems = cartItems.map((item) =>
          isSlottedCartItem(item)
            ? {
                id: item.id,
                slotId: item.slotId,
                date: item.date,
                childrenQty: item.childrenQty ?? 0,
                adultsQty: item.adultsQty ?? 0,
              }
            : { id: item.id, quantity: item.quantity }
        );

        const paymentResponse = await axios.post(
          "/api/way-for-pay/purchase",
          {
            cartItems: purchaseItems,
            clientInfo: {
              name: values.name,
              phone: values.phone,
              email: values.email,
            },
            promo: appliedPromo?.code,
          }
        );

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
      setErrorMessage?.(getServerErrorMessage(error));
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
      {({ dirty, isValid, values }) => (
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
          <CustomizedCheckbox
            fieldName="termsAccepted"
            label={
              <>
                Підтверджую, що ознайомився/ознайомилась та погоджуюся з умовами{" "}
                <Link
                  href="/public-offer"
                  target="_blank"
                  className="text-purple underline hover:text-purple/80 transition-colors"
                >
                  договору оферти
                </Link>
                .
              </>
            }
            className="mb-4 lg:mb-[26px]"
          />
          <MainButton
            type="submit"
            disabled={!(dirty && isValid && values.termsAccepted) || isLoading}
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
