import * as yup from "yup";
import { formPhoneRegex, nameRegex, emailRegex } from "../regex/regex";

export const useOrderFormValidation = () => {
  const orderFormValidationSchema = yup.object().shape({
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

    email: yup.string().matches(emailRegex, "Введіть валідний email"),

    message: yup
      .string()
      .min(2, "Повинно містити від 2 до 400 символів")
      .max(400, "Повинно містити від 2 до 400 символів"),

    termsAccepted: yup
      .boolean()
      .oneOf([true], "Необхідно погодитись з умовами договору оферти")
      .required("Необхідно погодитись з умовами договору оферти"),
  });

  return orderFormValidationSchema;
};
