import { CODE_SITE_URL, WEB_BOND_URL } from "@/constants/constants";
import Image from "next/image";

export default function Rights() {
    return (
        <div className="flex flex-col items-center justify-center w-[84.5px] lg:w-[100px] ml-[136px] sm:ml-[162px] lg:ml-auto lg:mr-[-2px]">
            <p className="text-[7.51px] lg:text-[9px] font-medium leading-[120%] lg:leading-[122%] uppercase text-white mb-2.5 lg:mb-3 tracking-[0.05em]">
                Created by
            </p>
            <a
                href={WEB_BOND_URL}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group flex items-center gap-1.5 xl:hover:opacity-80 transition-opacity duration-300"
            >
                <Image
                    src="/images/footer/WebBondLogo.webp"
                    alt="WebBond"
                    width={63.6}
                    height={21.2}
                    className="w-[63.6px] lg:w-[75.21px] h-[21.2px] lg:h-[25px]"
                />
            </a>
            <a
                href={CODE_SITE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-1.5 xl:hover:opacity-80 transition-opacity duration-300"
            >
                <Image
                    src="/images/footer/CodeSiteLogo.svg"
                    alt="CodeSite"
                    width={78.82}
                    height={15}
                    className="w-[78.82px] lg:w-[93.2px] h-[15px] lg:h-[17.8px]"
                />
            </a>
        </div>
    );
}
