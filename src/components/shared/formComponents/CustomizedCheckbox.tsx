import { Field, ErrorMessage, FieldInputProps, FieldMetaProps } from "formik";
import { useId } from "react";

interface CustomizedCheckboxProps {
  fieldName: string;
  label: string | React.ReactNode;
  className?: string;
}

export default function CustomizedCheckbox({
  fieldName,
  label,
  className = "",
}: CustomizedCheckboxProps) {
  const inputId = useId();

  return (
    <div className={`relative flex flex-col w-full ${className}`}>
      <label
        htmlFor={inputId}
        className="flex items-start gap-2 cursor-pointer"
      >
        <Field name={fieldName}>
          {({
            field,
            meta,
          }: {
            field: FieldInputProps<boolean>;
            meta: FieldMetaProps<boolean>;
          }) => (
            <input
              name={field.name}
              onBlur={field.onBlur}
              onChange={field.onChange}
              id={inputId}
              type="checkbox"
              checked={field.value}
              className={`mt-1 w-4 h-4 lg:w-5 lg:h-5 rounded border-black cursor-pointer accent-purple transition duration-300 ease-out ${
                meta.touched && meta.error ? "border-red-500" : "border-black"
              }`}
            />
          )}
        </Field>
        <span className="text-[12px] lg:text-[14px] font-normal leading-[140%]">
          {label}
        </span>
      </label>

      <ErrorMessage
        name={fieldName}
        component="p"
        className="mt-1 ml-6 text-[9px] lg:text-[10px] font-normal leading-none text-red-500"
      />
    </div>
  );
}
