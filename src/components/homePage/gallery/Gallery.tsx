import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";
import Container from "@/components/shared/container/Container";
import SectionTitle from "@/components/shared/titles/SectionTitle";
import { GalleryImages } from "@/types/gallery";
import Image from "next/image";
import { urlForSanityImage } from "@/utils/getUrlForSanityImage";
import AnimatedArrow from "@/components/shared/animatedArrow/AnimatedArrow";

interface GalleryProps {
    gallery: GalleryImages;
}

export default function Gallery({ gallery }: GalleryProps) {
    if (!gallery) return null;

    const { photo1, photo2, photo3, photo4, photo5 } = gallery;

    return (
        <section
            id="gallery"
            className="pt-25 lg:pt-[131px] pb-25 lg:pb-[125px] scroll-mt-[85px] relative z-20"
        >
            <Container className="relative">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    exit="exit"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeInAnimation({ delay: 0.6, scale: 0.95 })}
                    className="hidden lg:block absolute -z-20 top-[-300px] right-[calc(50%-530px)]"
                >
                    <Image
                        src="/images/gallery/flowers.webp"
                        alt="flowers"
                        width={908}
                        height={959}
                        className="object-cover"
                    />
                </motion.div>

                <div className="lg:flex justify-between">
                    <SectionTitle className="lg:max-w-[553px] mb-[34px] lg:mb-[38px]">
                        Атмосфера, яку хочеться відчути
                    </SectionTitle>
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        exit="exit"
                        viewport={{ once: true, amount: 0.3 }}
                        variants={fadeInAnimation({
                            delay: 0.4,
                            scale: 0.95,
                            x: 30,
                        })}
                        className="hidden lg:block relative w-[360px] xl:w-[590px] h-[154px] rounded-[16px]"
                    >
                        <Image
                            src={urlForSanityImage(photo1).fit("crop").url()}
                            alt="photo1"
                            fill
                            className="object-cover rounded-[16px]"
                        />
                        <div className="absolute -z-10 top-0 left-2 w-[calc(100%)] h-[154px] rounded-[16px] bg-purple overflow-hidden rotate-[3.67deg]" />
                    </motion.div>
                </div>

                <div className="relative flex flex-col md:flex-row gap-3.5 md:gap-5 w-full">
                    <div className="absolute z-10 top-[-20px] md:top-auto md:bottom-0 left-[-66px] md:left-auto md:right-[-119px] xl:right-[-59px] w-[143px] h-auto rotate-[154deg] md:rotate-[-16.98deg]">
                        <AnimatedArrow className="w-[143px] h-auto" />
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        exit="exit"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={fadeInAnimation({
                            delay: 0.2,
                            scale: 0.95,
                            y: 30,
                        })}
                        className="relative w-full md:w-[calc(42%-13.33px)] h-[275px] md:h-[451px] rounded-[10px] md:rounded-[16px] overflow-hidden shrink-0"
                    >
                        <Image
                            src={urlForSanityImage(photo2).fit("crop").url()}
                            alt="photo1"
                            fill
                            className="object-cover"
                        />
                        <span className="absolute z-10 top-3 md:top-5 right-6.5 md:right-5 rounded-full size-5 md:size-8 bg-yellow" />
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        exit="exit"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={fadeInAnimation({
                            delay: 0.4,
                            scale: 0.95,
                            y: 30,
                        })}
                        className="flex md:flex-col gap-3.5 md:gap-5 w-full md:w-[calc(24.56%-13.33px)] h-[144px] md:h-[451px] shrink-0"
                    >
                        <div className="relative w-[calc(50%-7px)] md:w-full h-full md:h-[calc(50%-10px)] rounded-[8px] md:rounded-[16px] overflow-hidden">
                            <Image
                                src={urlForSanityImage(photo3)
                                    .fit("crop")
                                    .url()}
                                alt="photo1"
                                fill
                                className="object-cover"
                            />
                            <span className="hidden md:block absolute z-10 bottom-4 left-4 rounded-full size-8 bg-black" />
                        </div>
                        <div className="relative w-[calc(50%-7px)] md:w-full h-full md:h-[calc(50%-10px)] rounded-[8px] md:rounded-[16px] overflow-hidden">
                            <Image
                                src={urlForSanityImage(photo4)
                                    .fit("crop")
                                    .url()}
                                alt="photo1"
                                fill
                                className="object-cover"
                            />
                            <span className="hidden md:block absolute z-10 top-4 right-4 rounded-full size-8 bg-yellow" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        exit="exit"
                        viewport={{ once: true, amount: 0.1 }}
                        variants={fadeInAnimation({
                            delay: 0.6,
                            scale: 0.95,
                            y: 30,
                        })}
                        className="flex flex-col md:justify-between gap-[31px] md:gap-2 w-full md:w-[calc(33.27%-13.33px)] mt-5 md:mt-0"
                    >
                        <div className="md:hidden relative w-full h-[154px] rounded-[16px]">
                            <Image
                                src={urlForSanityImage(photo1)
                                    .fit("crop")
                                    .url()}
                                alt="photo1"
                                fill
                                className="object-cover rounded-[16px]"
                            />
                            <div className="absolute -z-10 top-0 left-[-18px] w-[calc(100%+36px)] h-[154px] rounded-[16px] bg-purple overflow-hidden rotate-[-4.29deg]" />
                        </div>
                        <div className="hidden md:block relative w-full md:h-[318px] lg:h-[334px] rounded-[16px]">
                            <Image
                                src={urlForSanityImage(photo5)
                                    .fit("crop")
                                    .url()}
                                alt="photo1"
                                fill
                                className="object-cover rounded-[16px]"
                            />
                            <span className="hidden md:block absolute z-10 top-5 left-5 rounded-full size-8 bg-purple" />
                        </div>
                        <p className="md:max-w-[325px]">
                            Тут діти торкаються піску, спостерігають за водою,
                            будують, фантазують, сміються. Кожен кадр — це
                            маленька історія відкриттів без поспіху й шуму.
                        </p>
                    </motion.div>
                </div>
            </Container>
        </section>
    );
}
