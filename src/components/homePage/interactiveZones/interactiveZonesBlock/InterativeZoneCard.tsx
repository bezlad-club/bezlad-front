"use client";

import clsx from "clsx";
import Image from "next/image";
import React from "react";
import StarIcon from "@/components/shared/icons/StarIcon";
import DashedArrow from "@/components/shared/icons/DashedArrow";
import AnimatedAnimal from "@/components/shared/animatedAnimal/AnimatedAnimal";
import { Noodle, Noodle2 } from "@/components/shared/icons/Noodle";
import type { Direction, PictureSize } from "../interactiveZonesData";
import { useScreenWidth } from "@/hooks/useScreenWidth";
import { BREAKPOINT_DESKTOP } from "./slidesLayouts";

export interface InterativeZonesCardProps {
    title: string;
    image: string;
    direction?: Direction;
    desktopDirection?: Direction;
    pictureSize?: PictureSize;
}

// Common style constants to avoid duplication
const COMMON_CARD_BASE =
    "w-full sm:w-full md:w-[350px] h-[117px] sm:h-[145px] md:h-[165px]";
const COMMON_CARD_ROUNDED =
    "rounded-[14px] sm:rounded-[16px] md:rounded-[18px]";
const COMMON_CARD_PADDING = "px-4 py-3 sm:px-5 sm:py-4 md:p-5";
const COMMON_TEXT_STYLE =
    "text-base sm:text-lg md:text-[24px] font-azbuka leading-[120%] uppercase";
const COMMON_TEXT_BOTTOM = "bottom-3 sm:bottom-4 md:bottom-5";
const YELLOW_GRADIENT_BG =
    "linear-gradient(164.01deg, var(--color-yellow-gradient-start) 7%, var(--color-yellow-gradient-end) 59.69%)";

export const GlassCard = React.memo(
    ({
        title,
        image,
        direction = "right",
        desktopDirection,
    }: InterativeZonesCardProps) => {
        const screenWidth = useScreenWidth();
        const isDesktop = screenWidth >= BREAKPOINT_DESKTOP;
        const effectiveDirection =
            isDesktop && desktopDirection ? desktopDirection : direction;

        const directionVariant = {
            left: {
                //fountain zone
                imageSize: { width: 224, height: 214 },
                imageClassName:
                    "md:w-[272px] md:h-[260px] object-cover absolute top-[-75px] md:top-[-91px] right-[-57px] md:right-[-97px] xl:left-[175px]",
                textClassName: `${COMMON_TEXT_BOTTOM} z-1 items-start lg:max-w-[146px]`,
            },
            right: {
                // kinetic sand
                imageSize: { width: 198, height: 189.2 },
                imageClassName:
                    "md:w-[272px] md:h-[260px] top-[-54px] md:top-[-91px] left-[-59px] md:left-[175px]",
                textClassName:
                    "bottom-3 right-4 sm:right-5 sm:bottom-4 md:right-auto md:bottom-5 z-1 items-end lg:max-w-[146px]",
            },
        };

        const variant = directionVariant[effectiveDirection];
        return (
            <div
                role="article"
                aria-label={`Interactive zone: ${title}`}
                style={{
                    backgroundImage:
                        "linear-gradient(129.84deg, #000000 27.26%, #FFFFFF 97.59%)",
                    backdropFilter: "blur(38px)",
                    boxShadow: "0px 4px 12px 0px #FFFFFF1F inset",
                }}
                className={clsx(
                    "p-px overflow-hidden",
                    COMMON_CARD_BASE,
                    "lg:w-[330px] lg:h-[165px] xl:w-[386px] xl:h-[189px]",
                    COMMON_CARD_ROUNDED
                )}
            >
                <div
                    className={clsx(
                        "w-full h-full relative bg-white",
                        COMMON_CARD_PADDING,
                        "overflow-hidden",
                        COMMON_CARD_ROUNDED
                    )}
                >
                    <div
                        className={clsx(
                            "absolute flex flex-col gap-0.5 xl:gap-[9px] items-end md:items-start md:max-w-[146px]",
                            variant.textClassName
                        )}
                    >
                        <StarIcon className="text-purple w-[35px] h-[35px]" />
                        <p className={COMMON_TEXT_STYLE}>{title}</p>
                    </div>
                    <Image
                        src={image}
                        alt={title}
                        width={variant.imageSize.width}
                        height={variant.imageSize.height}
                        loading="lazy"
                        className={clsx(
                            "object-cover absolute",
                            variant.imageClassName
                        )}
                    />
                </div>
            </div>
        );
    }
);
GlassCard.displayName = "GlassCard";

export const PurpleBlobCard = React.memo(
    ({ title, image }: InterativeZonesCardProps) => {
        return (
            <div
                role="article"
                aria-label={`Interactive zone: ${title}`}
                className={clsx(
                    "relative overflow-hidden",
                    COMMON_CARD_BASE,
                    "lg:w-[235px] lg:h-[350px] xl:w-[285px] xl:h-[409px] bg-purple",
                    COMMON_CARD_ROUNDED,
                    COMMON_CARD_PADDING
                )}
            >
                <div className={clsx("absolute", COMMON_TEXT_BOTTOM, "z-2")}>
                    <p className={clsx(COMMON_TEXT_STYLE, "text-white")}>
                        {title}
                    </p>
                </div>
                <div className="w-[207.5px] h-[198px] md:w-[207.5px] md:h-[198px] lg:w-[280px] lg:h-[270px] xl:w-[404px] xl:h-[386px] absolute z-2 top-[-65px] md:top-[-75px] lg:top-[-60px] right-[-78.5px] md:right-[-40.5px] lg:left-[11px] xl:left-[11px]">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        loading="lazy"
                        className="object-cover"
                    />
                </div>
                <div className="w-[153.74px] h-[60.2px] md:hidden lg:block xl:block lg:w-[220px] xl:w-[309px] z-1 lg:h-[85px] xl:h-[121px] text-purple absolute top-[70px] left-[5px] lg:top-[280px] xl:top-[322px] lg:left-[-12px] pointer-events-none">
                    <div className="bg-purple blur-[10.8466px] w-full h-full" />
                </div>
                <Image
                    src="/images/interactiveZone/blobsHorizontal.svg"
                    alt="blobs horizontal"
                    fill
                    className="absolute inset-0 pointer-events-none lg:hidden"
                />
                <Image
                    src="/images/interactiveZone/blobsVertical.svg"
                    alt="blobs vertical"
                    fill
                    className="absolute inset-0 pointer-events-none lg:block hidden"
                />
            </div>
        );
    }
);
PurpleBlobCard.displayName = "PurpleBlobCard";

export const YellowElipseCard = React.memo(
    ({ title, image }: InterativeZonesCardProps) => {
        return (
            <div
                className="relative overflow-visible"
                style={{
                    width: "100%",
                    minWidth: 0,
                }}
            >
                <div
                    role="article"
                    aria-label={`Interactive zone: ${title}`}
                    className={clsx(
                        "relative",
                        COMMON_CARD_BASE,
                        "lg:w-[330px] lg:h-[165px] xl:w-[489px] xl:h-[189px] bg-yellow",
                        COMMON_CARD_ROUNDED,
                        COMMON_CARD_PADDING,
                        "overflow-hidden"
                    )}
                >
                    <div className={clsx("absolute", COMMON_TEXT_BOTTOM)}>
                        <p
                            className={clsx(
                                COMMON_TEXT_STYLE,
                                "max-w-[103px] md:max-w-[154px]"
                            )}
                        >
                            {title}
                        </p>
                    </div>
                    <div className="z-1 w-[263px] h-[225.7px] xl:w-[263px] xl:h-[225.7px] absolute top-[-93px] right-[-88px] xl:top-[-57px] xl:left-[226px] pointer-events-none">
                        <div className="bg-yellow-light blur-[40.6624px] w-full h-full" />
                    </div>
                </div>
                <AnimatedAnimal
                    svgPath={image}
                    className="z-2 w-[162.7px] h-[196.6px] md:w-[226.8px] md:h-auto lg:w-[226.8px] lg:h-auto xl:w-[286.8px] xl:h-[360.5px] absolute top-[-80px] sm:top-[-80px] md:top-[-110px] lg:top-[-110px] xl:top-[-190px] right-[-1px] sm:right-[23px] md:right-[-7px] lg:left-[130px] xl:left-[215px] pointer-events-none"
                    maxPupilMovement={3}
                />
            </div>
        );
    }
);
YellowElipseCard.displayName = "YellowElipseCard";

export const PurpleNoiseCard = React.memo(
    ({ title, image }: InterativeZonesCardProps) => {
        return (
            <div
                role="article"
                aria-label={`Interactive zone: ${title}`}
                className={clsx(
                    "overflow-hidden relative",
                    COMMON_CARD_BASE,
                    "lg:w-[330px] lg:h-[165px] xl:w-[489px] xl:h-[189px] bg-purple",
                    COMMON_CARD_ROUNDED,
                    COMMON_CARD_PADDING
                )}
            >
                <div className={clsx("absolute", COMMON_TEXT_BOTTOM, "z-3")}>
                    <p className={clsx(COMMON_TEXT_STYLE, "text-white")}>
                        {title}
                    </p>
                </div>
                <div className="absolute w-[219px] h-[209px] md:w-[323px] md:h-[308.6px] lg:w-[323px] lg:h-[308px] z-1 top-[-62px] sm:top-[-36px] md:top-[-57px] lg:top-[-100px] right-[-33px] sm:right-[-35px] md:right-[-179px] lg:left-[150px] xl:left-[206px]">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        loading="lazy"
                        className="object-cover"
                    />
                </div>
                <Image
                    src="/images/interactiveZone/noise.webp"
                    alt="noise"
                    fill
                    className="absolute inset-0  pointer-events-none object-cover"
                />
            </div>
        );
    }
);
PurpleNoiseCard.displayName = "PurpleNoiseCard";

export const GrayCard = React.memo(
    ({ title, image, pictureSize = "big" }: InterativeZonesCardProps) => {
        const picVariant = {
            big: {
                //cafe
                width: 243,
                height: 232,
                imageClassName:
                    "w-[243px] h-[232px] md:w-[323px] md:h-[308.6px] lg:w-[230px] lg:h-[219.933px] top-[-93px] md:top-[-133px] lg:top-[-50px] right-[-46px] sm:right-[-23px] md:right-[-88px] lg:left-[200px] xl:left-[115px]",
                cardClassName: "xl:w-[386px] xl:h-[201px] lg:w-[360px]",
                textClassName: "",
            },
            small: {
                //small sandbox
                width: 158,
                height: 152,
                imageClassName:
                    "w-[158px] h-[152px] md:w-[323px] md:h-[308.6px] lg:w-[180px] lg:h-[173px] xl:w-[349px] xl:h-[288px] top-[-14px] md:top-[-143px] lg:top-[-60px] xl:top-[-128px] right-[-32px] sm:right-[-3px] md:right-[-158px] lg:left-[-60px] xl:left-[-184.5px]",
                cardClassName:
                    "xl:w-[234.5px] xl:h-[201px] lg:w-[215px] lg:h-[165px]",
                textClassName: "lg:right-5 max-w-[135px]",
            },
        };
        return (
            <div
                role="article"
                aria-label={`Interactive zone: ${title}`}
                className={clsx(
                    "relative overflow-hidden",
                    COMMON_CARD_BASE,
                    "lg:h-[165px] bg-gray-dark",
                    COMMON_CARD_ROUNDED,
                    COMMON_CARD_PADDING,
                    picVariant[pictureSize].cardClassName
                )}
            >
                <div
                    className={clsx(
                        "absolute",
                        COMMON_TEXT_BOTTOM,
                        "z-1",
                        picVariant[pictureSize].textClassName
                    )}
                >
                    <p
                        className={clsx(
                            COMMON_TEXT_STYLE,
                            "text-white lg:max-w-[198px] xl:max-w-[198px] lg:text-right"
                        )}
                    >
                        {title}
                    </p>
                </div>
                <div
                    className={clsx(
                        "absolute rounded-full overflow-hidden",
                        picVariant[pictureSize].imageClassName
                    )}
                >
                    <Image
                        src={image}
                        alt={title}
                        width={picVariant[pictureSize].width}
                        height={picVariant[pictureSize].height}
                        loading="lazy"
                        className={clsx(
                            pictureSize === "small"
                                ? "xl:left-[100px] object-cover w-[158px] h-[152px] md:w-[323px] md:h-[308.6px] lg:w-[180px] lg:h-auto xl:w-[349px] xl:h-[288px]"
                                : "object-contain w-[243px] h-[232px] md:w-[323px] md:h-[308.6px] lg:w-[230px] lg:h-auto",
                            "absolute"
                        )}
                    />
                </div>
            </div>
        );
    }
);
GrayCard.displayName = "GrayCard";

export const BlackCard = React.memo(
    ({
        title,
        image,
        direction = "left",
        desktopDirection,
    }: InterativeZonesCardProps) => {
        const screenWidth = useScreenWidth();
        const isDesktop = screenWidth >= BREAKPOINT_DESKTOP;
        const effectiveDirection =
            isDesktop && desktopDirection ? desktopDirection : direction;

        const directionVariant = {
            left: {
                //lego
                imageSize: { width: 190, height: 181 },
                imageClassName:
                    "md:w-[230px] md:h-auto lg:w-[180px] lg:h-auto xl:w-[323px] xl:h-[308.6px] object-cover absolute top-[-16px] md:top-[-26.3px] lg:top-[-20px] xl:top-[-13px] right-[-8px] md:right-[-70px] lg:left-[60px] xl:left-[185px]",
                arrowClassName:
                    "top-[-17px] left-[-8.97px] z-10 rotate-[-165deg]",
                textClassName: `${COMMON_TEXT_BOTTOM} z-1`,
                cardClassName:
                    "xl:w-[386px] xl:h-[201px] lg:w-[215px] lg:h-[165px]",
            },
            right: {
                //engineer
                imageSize: { width: 170, height: 162 },
                imageClassName:
                    "md:w-[272px] md:h-[260px] lg:w-[230px] lg:h-auto xl:w-[323px] xl:h-[308.6px] object-cover absolute top-[-26px] md:top-[-91px] lg:top-[-20px] xl:top-[-26.3px] left-[-32px] md:right-[-97px] lg:left-[150px] xl:left-[190px]",
                arrowClassName:
                    "w-fit top-[-4px] right-[26px] z-10 rotate-[-32deg] lg:top-[-17px] lg:left-[-8.97px] lg:rotate-[-165deg]",
                textClassName:
                    "bottom-3 right-4 md:right-5 md:bottom-5 lg:right-auto z-1 max-w-[129px] text-right lg:text-left",
                cardClassName:
                    "lg:w-[305px] lg:h-[165px] xl:w-[488px] xl:h-[201px] ",
            },
        };

        const variant = directionVariant[effectiveDirection];
        return (
            <div
                role="article"
                aria-label={`Interactive zone: ${title}`}
                className={clsx(
                    "relative overflow-hidden",
                    COMMON_CARD_BASE,
                    "lg:h-[165px] bg-black",
                    COMMON_CARD_ROUNDED,
                    COMMON_CARD_PADDING,
                    variant.cardClassName
                )}
            >
                <div className={clsx("absolute", variant.textClassName)}>
                    <p className={clsx(COMMON_TEXT_STYLE, "text-white")}>
                        {title}
                    </p>
                </div>
                <Image
                    src={image}
                    alt={title}
                    width={variant.imageSize.width}
                    height={variant.imageSize.height}
                    loading="lazy"
                    className={clsx("object-cover", variant.imageClassName)}
                />
                <div className={clsx("absolute", variant.arrowClassName)}>
                    <DashedArrow className="w-28 xl:w-50 h-auto text-gray-dark" />
                </div>
            </div>
        );
    }
);
BlackCard.displayName = "BlackCard";

export const NoodleCard = React.memo(
    ({ title, image }: InterativeZonesCardProps) => {
        return (
            <div
                role="article"
                aria-label={`Interactive zone: ${title}`}
                style={{
                    background: YELLOW_GRADIENT_BG,
                }}
                className={clsx(
                    "relative overflow-hidden",
                    COMMON_CARD_BASE,
                    "lg:w-[235px] lg:h-[350px] xl:w-[285px] xl:h-[409px]",
                    COMMON_CARD_ROUNDED,
                    COMMON_CARD_PADDING
                )}
            >
                <div className="absolute bottom-3 right-4 sm:right-5 sm:bottom-4 md:right-5 md:bottom-5 xl:bottom-8 z-1">
                    <p className={COMMON_TEXT_STYLE}>{title}</p>
                </div>

                <div className="w-[202px] h-[193px] z-2 md:w-[252px] md:h-[237px] lg:w-[280px] lg:h-[270px] xl:w-[404px] xl:h-[386px] absolute top-[-41px] md:top-[-75px] lg:top-[-60px] left-[-62px] md:left-[-38px] lg:left-[-30px] xl:left-[-139px]">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        loading="lazy"
                        className="object-cover"
                    />
                </div>
                <Noodle2
                    preserveAspectRatio="none"
                    className="lg:hidden z-1 absolute w-[238px] h-auto top-0 right-0 text-yellow-detail"
                />
                <Noodle
                    preserveAspectRatio="none"
                    className="hidden lg:block absolute w-[336.7px] h-auto -bottom-5 right-0 text-yellow-detail"
                />
                <div className="absolute hidden lg:block w-[309px] h-[121px] top-[324px] left-[78px]">
                    <div className="bg-yellow-light blur-[21.8px] w-full h-full" />
                </div>
            </div>
        );
    }
);
NoodleCard.displayName = "NoodleCard";

export const PlaceholderCard = React.memo(
    ({ title, image }: InterativeZonesCardProps) => {
        return (
            <div
                className={clsx(
                    "overflow-visible relative",
                    COMMON_CARD_ROUNDED,
                    "flex items-center justify-center",
                    COMMON_CARD_BASE,
                    "lg:w-[330px] lg:h-[165px] xl:w-[386px] xl:h-[189px]"
                )}
            >
                <p className="sr-only">And more...</p>

                <Image
                    src="/images/interactiveZone/placeholder.svg"
                    alt="Placeholder"
                    width={104}
                    height={164}
                    className="w-[104px] h-[164px] md:h-[204px] md:w-auto object-contain z-10 absolute top-[-31px] left-1/2 -translate-x-1/2"
                />
            </div>
        );
    }
);
PlaceholderCard.displayName = "PlaceholderCard";

export const YellowBlobCard = React.memo(
    ({ title, image }: InterativeZonesCardProps) => {
        return (
            <div
                role="article"
                aria-label={`Interactive zone: ${title}`}
                style={{
                    background: YELLOW_GRADIENT_BG,
                }}
                className={clsx(
                    "relative overflow-hidden",
                    COMMON_CARD_BASE,
                    "lg:w-[215px] lg:h-[165px] xl:w-[234.5px] xl:h-[201px]",
                    COMMON_CARD_ROUNDED,
                    COMMON_CARD_PADDING
                )}
            >
                <div className={clsx("absolute", COMMON_TEXT_BOTTOM, "z-3")}>
                    <p className={clsx(COMMON_TEXT_STYLE, "max-w-[135px]")}>
                        {title}
                    </p>
                </div>
                <div className="z-2 absolute w-[158px] h-[152px] sm:w-[349px] sm:h-[288px] lg:w-[180px] lg:h-[173px] xl:w-[349px] xl:h-[288px] top-[-14px] md:top-[-143px] lg:top-[-60px] xl:top-[-128px] right-[-32px] md:right-[-164px] lg:left-[60px] xl:left-[70px] rounded-full overflow-hidden">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        loading="lazy"
                        className="object-cover"
                    />
                </div>
                <div className="w-[255px] h-[100px] md:hidden lg:block xl:block lg:w-[180px] xl:w-[255px] z-1 lg:h-[60px] xl:h-[100px] text-purple absolute top-[43px] left-[-72px] lg:top-[113px] lg:left-[-40px] xl:left-[-51px] pointer-events-none">
                    <div
                        className="blur-[10.8466px] w-full h-full"
                        style={{
                            background: YELLOW_GRADIENT_BG,
                        }}
                    />
                </div>
                <Image
                    src="/images/interactiveZone/yellowBlobs.svg"
                    alt="yellow blob"
                    fill
                    className="absolute inset-0 pointer-events-none "
                />
            </div>
        );
    }
);
YellowBlobCard.displayName = "YellowBlobCard";
