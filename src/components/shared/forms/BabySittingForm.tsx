"use client";
import { Form, Formik, FormikHelpers } from "formik";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";

import CustomizedInput from "../formComponents/CustomizedInput";
import MainButton from "../buttons/MainButton";
import { useBabySittingFormValidation } from "@/schemas/babysittingFormValidation";

export interface ValuesBabySittingFormType {
  name: string;
  phone: string;
  date: string;
  message: string;
}

interface BabySittingFormProps {
  setIsError: Dispatch<SetStateAction<boolean>>;
  setIsNotificationShown: Dispatch<SetStateAction<boolean>>;
  setIsModalShown?: Dispatch<SetStateAction<boolean>>;
  className?: string;
}

export default function BabySittingForm({
  setIsError,
  setIsNotificationShown,
  setIsModalShown,
  className = "",
}: BabySittingFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const initialValues = {
    name: "",
    phone: "",
    date: "",
    message: "",
  };

  const validationSchema = useBabySittingFormValidation();

  const submitForm = async (
    values: ValuesBabySittingFormType,
    formikHelpers: FormikHelpers<ValuesBabySittingFormType>
  ) => {
    const { resetForm } = formikHelpers;
    const data =
      `<b>Заявка "Форма бронювання послуг няні"</b>\n` +
      `<b>Ім'я:</b> ${values.name.trim()}\n` +
      `<b>Телефон:</b> ${values.phone.trim().replace(/(?!^)\D/g, "")}\n` +
      `<b>Дата та час супроводу:</b> ${values.date.trim()}\n` +
      `<b>Повідомлення:</b> ${values.message.trim()}\n`;
    try {
      setIsError(false);
      setIsLoading(true);

      await axios({
        method: "post",
        url: "/api/telegram",
        data,
        headers: {
          "Content-Type": "application/json",
        },
      });
      resetForm();
      if (setIsModalShown) {
        setIsModalShown(false);
      }
      setIsNotificationShown(true);
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
            <CustomizedInput fieldName="date" label="Дата та час супроводу" />
            <CustomizedInput
              fieldName="message"
              label="Повідомлення"
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
            Відправити
          </MainButton>
        </Form>
      )}
    </Formik>
  );
}
