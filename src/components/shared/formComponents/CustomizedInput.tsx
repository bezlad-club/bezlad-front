import {
  Field,
  ErrorMessage,
  useFormikContext,
  FieldInputProps,
  FieldMetaProps,
} from "formik";
import { IMaskInput } from "react-imask";
import { useId } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface Values {
  [fieldName: string]: string;
}

interface CustomizedInputProps {
  fieldName: string;
  label: string;
  as?: string;
  labelClassName?: string;
  fieldClassName?: string;
  inputType?: string;
  mask?: string;
}

export default function CustomizedInput({
  fieldName,
  label,
  as,
  labelClassName = "",
  fieldClassName = "",
  inputType = "text",
  mask = "+38 (000) 000-00-00",
}: CustomizedInputProps) {
  const { setFieldValue } = useFormikContext<Values>();
  const inputId = useId();

  return (
    <label
      htmlFor={inputId}
      className={`relative flex flex-col w-full ${labelClassName}`}
    >
      <span className="mb-1 lg:mb-3 text-[12px] lg:text-[16px] font-normal leading-[120%]">
        {label}
      </span>
      <div className="relative w-full">
        <Field name={fieldName} as={as}>
          {({
            field,
            meta,
          }: {
            field: FieldInputProps<string>;
            meta: FieldMetaProps<string>;
          }) => {
            const commonProps = {
              id: inputId,
              className: twMerge(
                clsx(
                  `relative flex items-center w-full h-[50px] lg:h-[60px] px-4 py-[15px] lg:py-[19px] text-[14px] lg:text-[16px] font-normal leading-[120%] border-1 rounded-[16px] lg:rounded-[20px] outline-none resize-none transition duration-300 ease-out ${
                    meta.touched && meta.error
                      ? "border-red-500"
                      : "border-black"
                  }`,
                  fieldClassName
                )
              ),
            };

            if (inputType === "tel") {
              return (
                <IMaskInput
                  {...field}
                  {...commonProps}
                  mask={mask}
                  lazy={false}
                  autoComplete="on"
                  type="tel"
                  onAccept={(value: string) => {
                    setFieldValue(fieldName, value || "");
                  }}
                />
              );
            }

            if ((as = "textarea")) {
              return <textarea {...field} {...commonProps} autoComplete="on" />;
            }

            return (
              <input
                {...field}
                {...commonProps}
                type={inputType}
                autoComplete="on"
              />
            );
          }}
        </Field>
      </div>

      <ErrorMessage
        name={fieldName}
        component="p"
        className="absolute bottom-[-12px] right-2 text-[9px] font-normal leading-none text-red-500 text-right"
      />
    </label>
  );
}
