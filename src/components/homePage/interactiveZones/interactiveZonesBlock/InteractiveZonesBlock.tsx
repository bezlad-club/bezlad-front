"use client";
import { useMemo } from "react";
import { SwiperSlide } from "swiper/react";
import {
    interactiveZonesData,
    InteractiveZoneItem,
} from "../interactiveZonesData";
import {
    BREAKPOINT_TABLET,
    BREAKPOINT_DESKTOP,
    TABLET_CARDS_STYLES,
    MOBILE_CARDS_STYLES,
} from "./slidesLayouts";
import { SwiperWrapper } from "@/components/shared/swiper/SwiperWrapper";
import { useScreenWidth } from "@/hooks/useScreenWidth";
import { renderCard } from "./cardMapper";
import { getSlides, DesktopSlideLayout } from "./helpers";
import dynamic from "next/dynamic";

function InteractiveZonesBlock() {
    const screenWidth = useScreenWidth();

    const breakpoint: "desktop" | "tablet" | "mobile" =
        screenWidth >= BREAKPOINT_DESKTOP
            ? "desktop"
            : screenWidth >= BREAKPOINT_TABLET
              ? "tablet"
              : "mobile";

    const slides = useMemo(
        () =>
            getSlides(
                breakpoint,
                interactiveZonesData.sort((a, b) => a.id - b.id)
            ),
        [breakpoint]
    );

    const renderSlides = useMemo(() => {
        if (breakpoint === "desktop") {
            return (slides as DesktopSlideLayout[]).map(
                (slide, slideIndex) => (
                    <SwiperSlide key={breakpoint + "-" + slideIndex}>
                        {({ isVisible }) => (
                            <div
                                className={`grid gap-4 grid-cols-1 lg:grid-rows-[auto_auto] ${
                                    slide.isVerticalOnLeft
                                        ? "lg:grid-cols-[285px_1fr]"
                                        : "lg:grid-cols-[1fr_285px]"
                                }`}
                                style={{
                                    opacity: isVisible ? 1 : 0,
                                    transition: "opacity 0.3s ease-in-out",
                                }}
                            >
                                {slide.isVerticalOnLeft ? (
                                    <>
                                        {/* Vertical Card on Left */}
                                        <div className="lg:row-span-2 w-full">
                                            {renderCard(slide.verticalCard)}
                                        </div>
                                        {/* Top Row */}
                                        <div className="flex gap-5 w-full">
                                            {slide.topRow.map((item) => (
                                                <div key={item.id} className="w-full">
                                                    {renderCard(item)}
                                                </div>
                                            ))}
                                        </div>
                                        {/* Bottom Row */}
                                        <div className="flex gap-5 w-full">
                                            {slide.bottomRow.map((item) => (
                                                <div key={item.id} className="w-full">
                                                    {renderCard(item)}
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* Top Row */}
                                        <div className="flex gap-5 w-full">
                                            {slide.topRow.map((item) => (
                                                <div key={item.id} className="w-full">
                                                    {renderCard(item)}
                                                </div>
                                            ))}
                                        </div>
                                        {/* Bottom Row */}
                                        <div className="flex gap-5 w-full">
                                            {slide.bottomRow.map((item) => (
                                                <div key={item.id} className="w-full">
                                                    {renderCard(item)}
                                                </div>
                                            ))}
                                        </div>
                                      
                                        {/* Vertical Card on Right */}
                                        <div className="lg:row-span-2 lg:col-start-2 lg:row-start-1 w-full">
                                            {renderCard(slide.verticalCard)}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </SwiperSlide>
                )
            );
        } else {
            return (slides as InteractiveZoneItem[][]).map(
                (slide, slideIndex) => (
                    <SwiperSlide key={breakpoint + "-" + slideIndex}>
                        {({ isVisible }) => (
                            <div
                                className={
                                    breakpoint === "tablet"
                                        ? TABLET_CARDS_STYLES
                                        : MOBILE_CARDS_STYLES
                                }
                                style={{
                                    opacity: isVisible ? 1 : 0,
                                    transition: "opacity 0.3s ease-in-out",
                                }}
                            >
                                {slide.map((item: InteractiveZoneItem) => (
                                    <div
                                        key={
                                            breakpoint +
                                            "-" +
                                            slideIndex +
                                            "-" +
                                            item.id
                                        }
                                    >
                                        {renderCard(item)}
                                    </div>
                                ))}
                            </div>
                        )}
                    </SwiperSlide>
                )
            );
        }
    }, [slides, breakpoint]);

    return (
        <SwiperWrapper
            pagination={breakpoint !== 'desktop'}
            navigation={breakpoint === 'desktop'}
            overflowVisible={true}
            spaceBetween={30}
            controllsVariant='black'
        >
            {renderSlides}
        </SwiperWrapper>
    );
}

export default InteractiveZonesBlock;

export const InteractiveZonesBlockDynamic = dynamic(
    () => Promise.resolve(InteractiveZonesBlock),
    {
        ssr: false,
    }
);
