import * as yup from "yup";
import { formPhoneRegex, nameRegex } from "../regex/regex";

export const useContactUsFormValidation = () => {
  const contactUsFormValidationSchema = yup.object().shape({
    name: yup
      .string()
      .min(2, "Повинно містити від 2 до 30 символів")
      .max(30, "Повинно містити від 2 до 30 символів")
      .matches(nameRegex, "Допустимі літери та дефіс, апостроф, лапки")
      .required("Дане поле є обов'язковим до заповнення"),

    phone: yup
      .string()
      .matches(formPhoneRegex, "Вкажіть правильний номер телефону")
      .test(
        "first-digit-after-38",
        "Після +38 має бути цифра 0",
        (value) => !!value && value.startsWith("+38 (0")
      )
      .required("Дане поле є обов'язковим до заповнення"),

    message: yup
      .string()
      .min(2, "Повинно містити від 2 до 400 символів")
      .max(400, "Повинно містити від 2 до 400 символів"),
  });

  return contactUsFormValidationSchema;
};
