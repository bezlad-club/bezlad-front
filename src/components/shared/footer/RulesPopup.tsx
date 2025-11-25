import { Dispatch, SetStateAction } from "react";
import Modal from "../modals/Modal";

interface RulesPopupProps {
    isRulesPopupShown: boolean;
    setIsRulesPopupShown: Dispatch<SetStateAction<boolean>>;
}

export default function RulesPopup({
    isRulesPopupShown,
    setIsRulesPopupShown,
}: RulesPopupProps) {
    return (
        <Modal
            isModalShown={isRulesPopupShown}
            setIsModalShown={setIsRulesPopupShown}
            className="bg-white lg:bg-gray px-4.5 lg:px-[45px] pt-6 pb-6 lg:py-14 w-[calc(100%-66px)] max-w-[calc(100%-66px)] h-[calc(100dvh-176px)] max-h-[calc(100dvh-176px)] lg:w-[calc(100%-294px)] lg:max-w-[986px] lg:h-[calc(100dvh-129px)] lg:max-h-[933px] overflow-hidden flex flex-col"
        >
            <div className="relative flex flex-col items-center w-full z-20 flex-1 min-h-0">
                <h2 className="mb-4 lg:mb-6 text-[24px] lg:text-[36px] font-azbuka leading-[108.33%] lg:leading-[108.33%] text-center uppercase shrink-0">
                    Правила відвідування пісочниці:
                </h2>
                <div
                    id="rules-popup-content"
                    className="overflow-y-auto scrollbar scrollbar-w-[4px] lg:scrollbar-w-[8px] scrollbar-thumb-rounded-full 
      scrollbar-track-rounded-full scrollbar-thumb-purple scrollbar-track-purple/10 popup-scroll w-full flex-1 min-h-0 pr-3 lg:pr-6"
                >
                    <p className="text-base lg:text-[20px] leading-[120%] lg:leading-[150%] mb-4">
                        Шановні батьки та гості, будь ласка, дотримуйтесь цих
                        правил для забезпечення безпечного та приємного ігрового
                        досвіду для всіх.
                    </p>
                    <ol className="list-none pl-0 [counter-reset:rules-counter] [&>li]:relative [&>li]:pl-4 [&>li]:[counter-increment:rules-counter] [&>li::before]:content-[counter(rules-counter)_'.'] [&>li::before]:absolute [&>li::before]:left-0 [&>li::before]:font-medium [&_ul]:list-none [&_ul]:pl-0 [&_ul_li]:relative [&_ul_li]:pl-5 [&_ul_li::before]:content-['•'] [&_ul_li::before]:absolute [&_ul_li::before]:left-0 [&_ul_li::before]:text-black">
                        <li>
                            <h3 className="text-[14px] lg:text-[16px] leading-[120%] font-medium mb-3 lg:mb-4">
                                Вікові Обмеження та Відповідальність
                            </h3>
                            <ul className="mb-4 lg:mb-6">
                                <li className="text-[14px] lg:text-[16px] leading-[150%]">
                                    Пісочниця призначена виключно для дітей
                                    віком до 7 років.
                                </li>
                                <li className="text-[14px] lg:text-[16px] leading-[150%]">
                                    Перед початком гри необхідно підписати (або
                                    надати) форму відмови від відповідальності.
                                </li>
                                <li className="text-[14px] lg:text-[16px] leading-[150%]">
                                    Батьки або опікуни зобов&lsquo;язані
                                    постійно та уважно контролювати своїх дітей
                                    протягом усього часу перебування в ігровій
                                    зоні.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <h3 className="text-[14px] lg:text-[16px] leading-[120%] font-medium mb-3 lg:mb-4">
                                Гігієна та Чистота
                            </h3>
                            <ul className="mb-4">
                                <li className="text-[14px] lg:text-[16px] leading-[150%]">
                                    При вході в простір «БезЛад» всім
                                    відвідувачам потрібно одягнути бахіли.
                                </li>
                                <li className="text-[14px] lg:text-[16px] leading-[150%]">
                                    Забороняється вхід у пісочницю у взутті або
                                    шкарпетках.
                                </li>
                                <li className="text-[14px] lg:text-[16px] leading-[150%]">
                                    Не допускається приносити чи вживати їжу,
                                    напої, цукерки або жувальні гумки у
                                    пісочниці або в безпосередній близькості від
                                    неї.
                                </li>
                                <li className="text-[14px] lg:text-[16px] leading-[150%]">
                                    Після завершення гри та перед вживанням їжі
                                    обов&lsquo;язково вимийте руки.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <h3 className="text-[14px] lg:text-[16px] leading-[120%] font-medium mb-3 lg:mb-4">
                                Поведінка та Безпека
                            </h3>
                            <ul className="mb-4">
                                <li className="text-[14px] lg:text-[16px] leading-[150%]">
                                    У пісочниці заборонено бігати, кричати,
                                    лазити, хапати чи боротися.
                                </li>
                                <li className="text-[14px] lg:text-[16px] leading-[150%]">
                                    Будь ласка, заохочуйте спокійну та дружню
                                    гру.
                                </li>
                                <li className="text-[14px] lg:text-[16px] leading-[150%]">
                                    Пісок залишається в пісочниці!Суворо
                                    заборонено розкидати пісок за межі ігрової
                                    зони.
                                </li>
                                <li className="text-[14px] lg:text-[16px] leading-[150%]">
                                    Забороняється закопувати дітей повністю чи
                                    частково.
                                </li>
                            </ul>
                        </li>
                        <li>
                            <h3 className="text-[14px] lg:text-[16px] leading-[120%] font-medium mb-3 lg:mb-4">
                                Використання Іграшок
                            </h3>
                            <ul className="mb-4">
                                <li className="text-[14px] lg:text-[16px] leading-[150%]">
                                    Всі іграшки та пісок повинні залишатися в
                                    межах пісочниці.
                                </li>
                                <li className="text-[14px] lg:text-[16px] leading-[150%]">
                                    Дозволяється користуватися лише іграшками,
                                    які належать простору «БезЛад» та
                                    знаходяться у спеціальній коробці.
                                </li>
                                <li className="text-[14px] lg:text-[16px] leading-[150%]">
                                    Заборонено приносити власні іграшки.
                                </li>
                            </ul>
                        </li>
                    </ol>
                    <p className="text-base lg:text-[20px] leading-[120%] lg:leading-[150%]">
                        Дякуємо за дотримання правил! Нехай ваша гра буде
                        безпечною та радісною!
                    </p>
                </div>
            </div>
        </Modal>
    );
}
