"use client";

import { motion, useInView } from "motion/react";
import { useId, useRef } from "react";

interface AnimatedArrowProps {
  className?: string;
  delay?: number;
}

export default function AnimatedArrow({
  className = "",
  delay = 0,
}: AnimatedArrowProps) {
  const id = useId();
  const mainMaskId = `reveal-main-${id}`;
  const tipMaskId = `reveal-tip-${id}`;
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <svg
      ref={ref}
      width="209"
      height="117"
      viewBox="0 0 209 117"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Маска для основної пунктирної лінії */}
        <mask id={mainMaskId} suppressHydrationWarning>
          <motion.path
            d="M193.566 1.74452C193.64 1.80388 196.57 6.98274 201.151 17.85C205.863 29.0262 203.478 39.0504 201.829 46.9547C199.344 58.8641 192.71 67.9275 188.392 73.0171C184.157 78.009 178.279 81.8113 172.14 85.3865C165.934 89.0004 158.757 91.0761 149.816 93.0433C137.264 95.805 126.27 95.3927 119.689 93.9741C112.926 92.5161 107.049 87.9937 100.962 82.9393C93.8561 77.0393 88.6506 68.3729 84.0357 60.3801C76.0593 46.5654 77.8474 34.9256 79.1176 32.7416C83.4642 25.2682 101.872 28.1652 110.624 30.4875C120.562 33.1245 124.307 44.5553 127.296 52.3798C130.478 60.7073 128.734 70.8515 124.626 81.2114C120.498 91.6214 111.545 98.0259 103.005 103.818C98.2995 107.01 92.359 108.686 84.0102 110.638C70.4476 113.808 57.583 113.258 49.6659 111.982C35.3502 109.675 25.8548 99.239 17.5268 89.6635C15.7524 87.1965 14.3029 84.8225 12.6152 81.172C10.9274 77.5215 9.04539 72.6665 7.10631 67.6644"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              isInView
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{ duration: 1.2, ease: "easeInOut", delay }}
          />
        </mask>

        {/* Маска для наконечника */}
        <mask id={tipMaskId} suppressHydrationWarning>
          <motion.path
            d="M5.0204 91.1002C4.68329 85.9517 4.34618 80.8031 4.01743 75.7823C3.68868 70.7614 3.37851 66.0243 3.34156 63.8571C3.30462 61.6899 3.5503 62.2362 10.6839 65.9913C17.8174 69.7463 31.8314 76.6935 46.2701 83.8513"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            /* Головне: приховати початкову точку */
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              isInView
                ? { pathLength: 1, opacity: 1 }
                : { pathLength: 0, opacity: 0 }
            }
            transition={{
              duration: 0.6,
              ease: "easeInOut",
              delay: delay + 1, // після основної лінії
            }}
          />
        </mask>
      </defs>

      {/* Пунктирна основна лінія */}
      <path
        d="M193.566 1.74452C193.64 1.80388 196.57 6.98274 201.151 17.85C205.863 29.0262 203.478 39.0504 201.829 46.9547C199.344 58.8641 192.71 67.9275 188.392 73.0171C184.157 78.009 178.279 81.8113 172.14 85.3865C165.934 89.0004 158.757 91.0761 149.816 93.0433C137.264 95.805 126.27 95.3927 119.689 93.9741C112.926 92.5161 107.049 87.9937 100.962 82.9393C93.8561 77.0393 88.6506 68.3729 84.0357 60.3801C76.0593 46.5654 77.8474 34.9256 79.1176 32.7416C83.4642 25.2682 101.872 28.1652 110.624 30.4875C120.562 33.1245 124.307 44.5553 127.296 52.3798C130.478 60.7073 128.734 70.8515 124.626 81.2114C120.498 91.6214 111.545 98.0259 103.005 103.818C98.2995 107.01 92.359 108.686 84.0102 110.638C70.4476 113.808 57.583 113.258 49.6659 111.982C35.3502 109.675 25.8548 99.239 17.5268 89.6635C15.7524 87.1965 14.3029 84.8225 12.6152 81.172C10.9274 77.5215 9.04539 72.6665 7.10631 67.6644"
        stroke={"currentColor"}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="7 7"
        mask={`url(#${mainMaskId})`}
        suppressHydrationWarning
      />

      {/* Наконечник стрілки */}
      <path
        d="M5.0204 91.1002C4.68329 85.9517 4.34618 80.8031 4.01743 75.7823C3.68868 70.7614 3.37851 66.0243 3.34156 63.8571C3.30462 61.6899 3.5503 62.2362 10.6839 65.9913C17.8174 69.7463 31.8314 76.6935 46.2701 83.8513"
        stroke={"currentColor"}
        strokeWidth="3.5"
        strokeLinecap="round"
        mask={`url(#${tipMaskId})`}
        suppressHydrationWarning
      />
    </svg>
  );
}
