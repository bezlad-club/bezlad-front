import Image from "next/image";
import * as motion from "motion/react-client";
import { fadeInAnimation } from "@/utils/animationVariants";

export default function PriceListImages() {
    return (
        <>
            <div className="absolute left-0 bottom-0 w-full h-full">
                <div className="absolute inset-0 left-0 bottom-0 pointer-events-none ">
                    <Image
                        src="/images/ctaContactUs/noise.webp"
                        fill
                        alt="noise"
                        className="object-cover opacity-20"
                    />
                </div>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    exit="exit"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fadeInAnimation({ delay: 1, scale: 0.95 })}
                    className="absolute top-[252px] -left-[110px] md:top-[165px] md:-left-[140px]"
                >
                    <Image
                        src="/images/priceList/leaves.svg"
                        alt="leaves"
                        width={321}
                        height={389.61}
                        className="md:h-[514px] md:w-[424px]"
                    />
                </motion.div>
            </div>
        </>
    );
}
