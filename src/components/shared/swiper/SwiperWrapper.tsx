"use client";
import { SwiperClass } from "swiper/react";
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import clsx from "clsx";
import { Children, useEffect, useCallback, useState, useRef } from "react";
import { NavigationOptions, SwiperOptions } from "swiper/types";
import dynamic from "next/dynamic";
import { Keyboard, Navigation } from "swiper/modules";
import CircledArrowIcon from "../icons/CircledArrowIcon";

interface SwiperWrapperProps {
    children: React.ReactNode;
    slidesPerView?: number | "auto";
    pagination?: boolean;
    navigation?: boolean;
    loop?: boolean;
    breakpoints?: SwiperOptions["breakpoints"];
    overflowVisible?: boolean;
    spaceBetween?: number;
    slidesPerGroup?: number;
    controllsVariant?: 'black' | 'purple';
}

const controllsVariants = {
    black : 'bg-black disabled:bg-white disabled:shadow-[0_0_0_1.5px_#000000_inset] text-white disabled:text-black',
    purple: 'bg-white disabled:bg-purple/40 disabled:border-purple/40 disabled:shadow-[0_0_0_1.5px_#ffffff_inset] text-purple disabled:text-white',
    }

export const SwiperWrapper = dynamic(
    async () => {
        const [{ Swiper }] = await Promise.all([import("swiper/react")]);

        const Component = ({
            children,
            slidesPerView = "auto",
            pagination = false,
            navigation = false,
            loop = false,
            breakpoints,
            overflowVisible = false,
            spaceBetween = 20,
            slidesPerGroup = 1,
            controllsVariant = 'purple',
        }: SwiperWrapperProps) => {
            const swiperInstanceRef = useRef<SwiperClass | null>(null);
            const [activeIndex, setActiveIndex] = useState(0);
            const slidesCount = Children.count(children);

            const prevRef = useRef<HTMLButtonElement>(null);
            const nextRef = useRef<HTMLButtonElement>(null);

            const [isBeginning, setIsBeginning] = useState(true);
            const [isEnd, setIsEnd] = useState(false);

            const [isLocked, setIsLocked] = useState(false);

            // Handle slide change for custom pagination
            const handleSlideChange = useCallback((swiper: SwiperClass) => {
                setActiveIndex(swiper.realIndex ?? swiper.activeIndex);
            }, []);

            useEffect(() => {
                const swiperInstance = swiperInstanceRef.current;
                if (swiperInstance && pagination) {
                    swiperInstance.on("slideChange", handleSlideChange);

                    return () => {
                        swiperInstance.off("slideChange", handleSlideChange);
                    };
                }
            }, [pagination, handleSlideChange]);

            const goToSlide = (index: number) => {
                swiperInstanceRef.current?.slideTo(index);
            };

            // Прив'язуємо кнопки навігації після рендеру
            useEffect(() => {
                const swiperInstance = swiperInstanceRef.current;
                if (
                    swiperInstance &&
                    navigation &&
                    prevRef.current &&
                    nextRef.current
                ) {
                    // Initialize navigation if not already set
                    if (!swiperInstance.params.navigation) {
                        swiperInstance.params.navigation = {};
                    }

                    // Type guard ensures navigation is NavigationOptions, not boolean
                    const navigationParams = swiperInstance.params
                        .navigation as NavigationOptions;
                    navigationParams.prevEl = prevRef.current;
                    navigationParams.nextEl = nextRef.current;
                    swiperInstance.navigation.destroy();
                    swiperInstance.navigation.init();
                    swiperInstance.navigation.update();

                    // початковий стан кнопок (у loop режимі завжди активні)
                    if (!loop) {
                        setIsBeginning(swiperInstance.isBeginning);
                        setIsEnd(swiperInstance.isEnd);
                    } else {
                        setIsBeginning(false);
                        setIsEnd(false);
                    }

                    // оновлюємо стан кнопок при зміні слайду (інакше у loop не блокуємо)
                    const handleSlideChange = () => {
                        if (!loop) {
                            setIsBeginning(swiperInstance.isBeginning);
                            setIsEnd(swiperInstance.isEnd);
                        }
                    };

                    swiperInstance.on("slideChange", handleSlideChange);

                    return () => {
                        swiperInstance.off("slideChange", handleSlideChange);
                    };
                }
            }, [loop, navigation]);

            // ефективні значення дизейблу для кнопок
            const disablePrev = loop ? false : isBeginning;
            const disableNext = loop ? false : isEnd;

            // Check if swiper is locked and update the state
            useEffect(() => {
                const swiper = swiperInstanceRef.current;
                if (!swiper) return;

                const updateLockState = () => {
                    setIsLocked(swiper.isLocked);
                };

                swiper.on("resize", updateLockState);
                swiper.on("update", updateLockState);
                swiper.on("slideChange", updateLockState);

                return () => {
                    swiper.off("resize", updateLockState);
                    swiper.off("update", updateLockState);
                    swiper.off("slideChange", updateLockState);
                };
            }, []);

            return (
                <>
                    <Swiper
                        onSwiper={swiper => {
                            swiperInstanceRef.current = swiper;
                            setIsLocked(swiper.isLocked);
                        }}
                        slidesPerView={slidesPerView}
                        slidesPerGroup={slidesPerGroup}
                        breakpoints={breakpoints}
                        spaceBetween={spaceBetween}
                        speed={1000}
                        loop={loop}
                        watchSlidesProgress={true}
                        className={clsx(
                            overflowVisible ? "overflow-visible!" : ""
                        )}
                        wrapperClass={clsx(navigation ? "pb-20" : "")}
                        modules={[Keyboard, Navigation]}
                        keyboard={{
                            enabled: true,
                        }}
                    >
                        {pagination && slidesCount > 0 && (
                            <div className="flex items-center justify-center gap-2 md:gap-3 lg:gap-4.5 mt-6 lg:mt-[26px]">
                                {Array.from({ length: slidesCount }).map(
                                    (_, index) => {
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => goToSlide(index)}
                                                className={clsx(
                                                    "transition duration-300 cursor-pointer rounded-full shrink-0 border-2 border-white w-4 h-4 lg:w-5 lg:h-5",
                                                    activeIndex === index
                                                        ? "bg-purple shadow-[0_0_0_1px_#7c48cc]"
                                                        : "bg-gray-dark shadow-[0_0_0_1px_#5a5a5a]"
                                                )}
                                                aria-label={`Go to slide ${index + 1}`}
                                            ></button>
                                        );
                                    }
                                )}
                            </div>
                        )}
                        {navigation && !isLocked && (
                            <div className="overflow-visible absolute z-10 bottom-1 left-1/2 -translate-x-1/2 w-fit flex items-center justify-center gap-[35px]">
                                <button
                                    ref={prevRef}
                                    disabled={disablePrev}
                                    className={`shrink-0 enabled:cursor-pointer w-[50px] h-[50px] rounded-full flex items-center justify-center pointer-events-auto transition-filter 
          duration-300 xl:enabled:hover:brightness-[1.25] ${controllsVariants[controllsVariant]}`}
                                >
                                    <CircledArrowIcon className="w-[28px] h-[28px]" />
                                </button>
                                <button
                                    ref={nextRef}
                                    disabled={disableNext}
                                    className={`shrink-0 enabled:cursor-pointer w-[50px] h-[50px] rounded-full flex items-center justify-center pointer-events-auto transition-filter 
          duration-300 xl:enabled:hover:brightness-[1.25] ${controllsVariants[controllsVariant]}`}
                                >
                                    <CircledArrowIcon className="w-[28px] h-[28px] rotate-180" />
                                </button>
                            </div>
                        )}
                        {children}
                    </Swiper>
                </>
            );
        };

        Component.displayName = "SwiperWrapper";
        return Component;
    },
    {
        ssr: false,
    }
);
