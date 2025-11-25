import clsx from "clsx";
import { twMerge } from "tailwind-merge";

interface LoaderProps {
  className?: string;
}

export default function Loader({ className = "" }: LoaderProps) {
  return (
    <div
      className={twMerge(
        clsx(`w-full h-[220px] lg:h-[350px] flex items-center justify-center`),
        className
      )}
    >
      <div className="loader"></div>
    </div>
  );
}
