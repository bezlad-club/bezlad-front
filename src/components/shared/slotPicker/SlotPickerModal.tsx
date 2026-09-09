"use client";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Service, ServiceSlot } from "@/payload-types";
import type { CartItem } from "@/types/cart";
import Modal from "../modals/Modal";
import Backdrop from "../backdrop/Backdrop";
import MainButton from "../buttons/MainButton";
import QuantityControl from "../cart/QuantityControl";
import { MAX_ITEMS_PER_SERVICE } from "@/constants/constants";
import { fadeInAnimation } from "@/utils/animationVariants";
import {
  formatDateShortUk,
  getNextDaysIso,
  getTodayIso,
  getWeekdayFromDate,
  getWeekdayShortUk,
} from "@/utils/dateUtils";

export interface SlotAvailability {
  id: number;
  startTime: string;
  endTime: string;
  price: number;
  adultPrice: number;
  capacity: number;
  remaining: number;
}

interface SlotPickerModalProps {
  isModalShown: boolean;
  setIsModalShown: Dispatch<SetStateAction<boolean>>;
  service: Service | null;
  sessionKey?: number;
  onAddToCart: (item: Omit<CartItem, "quantity" | "addedAt">) => void;
}

interface SlotPickerFormProps {
  service: Service;
  setIsModalShown: Dispatch<SetStateAction<boolean>>;
  onAddToCart: (item: Omit<CartItem, "quantity" | "addedAt">) => void;
}

interface BackButtonProps {
  onClick: () => void;
}

function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer shrink-0 rounded-full border border-black bg-transparent px-5 h-12 text-[14px] font-azbuka uppercase enabled:hover:bg-purple-ultra-light enabled:active:scale-[98%] transition duration-300"
    >
      Назад
    </button>
  );
}

function SlotPickerForm({
  service,
  setIsModalShown,
  onAddToCart,
}: SlotPickerFormProps) {
  const [step, setStep] = useState(1);
  const [slots, setSlots] = useState<ServiceSlot[] | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [availability, setAvailability] = useState<SlotAvailability[]>([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [childrenQty, setChildrenQty] = useState(1);
  const [adultsQty, setAdultsQty] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadSlots = async () => {
      try {
        const response = await fetch(
          `/api/serviceSlot?where[service][equals]=${service.id}&limit=100&depth=0`
        );
        if (!response.ok) {
          throw new Error("Failed to load slots");
        }
        const data = await response.json();
        if (cancelled) return;
        setSlots(Array.isArray(data?.docs) ? (data.docs as ServiceSlot[]) : []);
      } catch {
        if (!cancelled) {
          setSlotsError(
            "Не вдалося завантажити розклад. Спробуйте ще раз пізніше."
          );
        }
      } finally {
        if (!cancelled) {
          setSlotsLoading(false);
        }
      }
    };

    loadSlots();

    return () => {
      cancelled = true;
    };
  }, [service]);

  const coveredWeekdays = useMemo(() => {
    return new Set((slots ?? []).flatMap((slot) => slot.weekdays));
  }, [slots]);

  const days = useMemo(() => {
    return getNextDaysIso(14).filter((iso) =>
      coveredWeekdays.has(getWeekdayFromDate(iso))
    );
  }, [coveredWeekdays]);

  const todayIso = getTodayIso();

  const selectedSlot =
    availability.find((slot) => slot.id === selectedSlotId) ?? null;

  const total =
    childrenQty * (selectedSlot?.price ?? 0) +
    adultsQty * (selectedSlot?.adultPrice ?? 0);

  const handleSelectDate = async (iso: string) => {
    setSelectedDate(iso);
    setSelectedSlotId(null);
    setAvailability([]);
    setAvailabilityLoading(true);
    setStep(2);

    try {
      const response = await fetch(
        `/api/slots/availability?serviceId=${service.id}&date=${iso}`
      );
      if (!response.ok) {
        throw new Error("Failed to load availability");
      }
      const data = await response.json();
      setAvailability(Array.isArray(data) ? (data as SlotAvailability[]) : []);
    } catch {
      const weekday = getWeekdayFromDate(iso);
      setAvailability(
        (slots ?? [])
          .filter((slot) => slot.weekdays.includes(weekday))
          .map((slot) => ({
            id: slot.id,
            startTime: slot.startTime,
            endTime: slot.endTime,
            price: slot.price,
            adultPrice: slot.adultPrice,
            capacity: slot.capacity,
            remaining: slot.capacity,
          }))
      );
    } finally {
      setAvailabilityLoading(false);
    }
  };

  const handleSelectSlot = (slot: SlotAvailability) => {
    if (slot.remaining <= 0) {
      return;
    }
    setSelectedSlotId(slot.id);
    setChildrenQty(1);
    setAdultsQty(0);
    setStep(3);
  };

  const handleContinueToAdults = () => {
    if (!selectedSlot) {
      return;
    }
    setAdultsQty((prev) => Math.min(prev, MAX_ITEMS_PER_SERVICE));
    setStep(4);
  };

  const handleAddToCart = () => {
    if (!selectedDate || !selectedSlot) {
      return;
    }
    onAddToCart({
      id: service.id,
      title: service.title,
      price: selectedSlot.price,
      adultPrice: selectedSlot.adultPrice,
      description: service.description,
      image: service.image,
      slotId: selectedSlot.id,
      date: selectedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      childrenQty,
      adultsQty: Math.min(adultsQty, MAX_ITEMS_PER_SERVICE),
    });
    setIsModalShown(false);
  };

  const slotSummary = selectedSlot
    ? `${formatDateShortUk(selectedDate ?? "")} · ${selectedSlot.startTime} - ${selectedSlot.endTime}`
    : "";

  return (
    <div className="flex-1 flex flex-col pr-3 overflow-hidden min-h-0">
      <h2 className="mb-1 font-azbuka text-[22px] lg:text-[26px] font-normal leading-[120%] text-center uppercase">
        {service.title}
      </h2>
      <p className="mb-4 text-center text-[12px] font-semibold uppercase text-purple">
        Крок {step} / 4
      </p>

      <div className="flex-1 overflow-y-auto min-h-0 scrollbar scrollbar-w-[3px] lg:scrollbar-w-[4px] scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-purple scrollbar-track-purple/10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeInAnimation({ x: 24, duration: 0.35 })}
            className="flex flex-col gap-4"
          >
            {step === 1 && (
              <div className="flex flex-col gap-4">
                <h3 className="font-azbuka text-[18px] leading-[120%] uppercase text-center">
                  Оберіть дату відвідування
                </h3>
                {slotsLoading && (
                  <div className="flex justify-center py-10">
                    <div className="loader" />
                  </div>
                )}
                {!slotsLoading && slotsError && (
                  <p className="text-center text-[14px] leading-[120%] text-red-500">
                    {slotsError}
                  </p>
                )}
                {!slotsLoading && !slotsError && days.length === 0 && (
                  <p className="text-center text-[14px] leading-[120%] text-gray-dark">
                    На найближчі два тижні вільних дат немає
                  </p>
                )}
                {!slotsLoading && !slotsError && days.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {days.map((iso) => (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => handleSelectDate(iso)}
                        className={`flex w-[74px] shrink-0 cursor-pointer flex-col items-center gap-0.5 rounded-[12px] border px-2 py-2.5 transition-colors duration-200 hover:border-purple hover:bg-purple-ultra-light ${
                          iso === todayIso
                            ? "border-purple bg-purple-ultra-light"
                            : "border-gray-light"
                        }`}
                      >
                        <span
                          className={`text-[11px] leading-[120%] ${
                            iso === todayIso
                              ? "font-bold text-purple"
                              : "text-gray-dark"
                          }`}
                        >
                          {iso === todayIso
                            ? "Сьогодні"
                            : getWeekdayShortUk(iso)}
                        </span>
                        <span className="font-azbuka text-[14px] font-bold leading-[120%]">
                          {iso.slice(8)}.{iso.slice(5, 7)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-4">
                <h3 className="font-azbuka text-[18px] leading-[120%] uppercase text-center">
                  {selectedDate ? formatDateShortUk(selectedDate) : ""}
                </h3>
                {availabilityLoading && (
                  <div className="flex justify-center py-10">
                    <div className="loader" />
                  </div>
                )}
                {!availabilityLoading && availability.length === 0 && (
                  <p className="text-center text-[14px] leading-[120%] text-gray-dark">
                    На цей день слотів немає
                  </p>
                )}
                {!availabilityLoading && availability.length > 0 && (
                  <ul className="flex flex-col gap-2">
                    {availability.map((slot) => (
                      <li key={slot.id}>
                        <button
                          type="button"
                          disabled={slot.remaining <= 0}
                          onClick={() => handleSelectSlot(slot)}
                          className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-[12px] border p-3.5 text-left transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 hover:border-purple hover:bg-purple-ultra-light ${
                            selectedSlotId === slot.id
                              ? "border-purple bg-purple-ultra-light"
                              : "border-gray-light"
                          }`}
                        >
                          <span className="flex flex-col">
                            <span className="font-azbuka text-[16px] font-bold leading-[120%]">
                              {slot.startTime} - {slot.endTime}
                            </span>
                            <span
                              className={`text-[12px] leading-[120%] ${
                                slot.remaining <= 0
                                  ? "text-red-500"
                                  : "text-gray-dark"
                              }`}
                            >
                              {slot.remaining <= 0
                                ? "Вільних місць немає"
                                : `Залишилось дитячих місць: ${slot.remaining}`}
                            </span>
                          </span>
                          <span className="shrink-0 font-azbuka text-[14px] leading-[120%] text-purple text-right">
                            Діти: {slot.price} грн
                            <br />
                            Дорослі: {slot.adultPrice} грн
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <BackButton onClick={() => setStep(1)} />
              </div>
            )}

            {step === 3 && (
              <div className="flex flex-col gap-4">
                <h3 className="font-azbuka text-[18px] leading-[120%] uppercase text-center">
                  Кількість дитячих квитків
                </h3>
                <p className="text-center text-[13px] leading-[120%] text-gray-dark">
                  {slotSummary} · Діти: {selectedSlot?.price ?? 0} грн ·
                  Дорослі: {selectedSlot?.adultPrice ?? 0} грн
                </p>
                <div className="flex justify-center">
                  <QuantityControl
                    quantity={childrenQty}
                    min={1}
                    max={
                      selectedSlot ? Math.max(selectedSlot.remaining, 1) : 1
                    }
                    onIncrease={() =>
                      setChildrenQty((prev) =>
                        Math.min(prev + 1, selectedSlot?.remaining ?? 1)
                      )
                    }
                    onDecrease={() =>
                      setChildrenQty((prev) => Math.max(prev - 1, 1))
                    }
                  />
                </div>
                {selectedSlot && (
                  <p className="text-center text-[12px] leading-[120%] text-gray-dark">
                    Залишилось дитячих місць: {selectedSlot.remaining}
                  </p>
                )}
                <div className="flex gap-2">
                  <BackButton onClick={() => setStep(2)} />
                  <MainButton
                    className="h-12 flex-1 text-[14px]"
                    onClick={handleContinueToAdults}
                  >
                    Далі
                  </MainButton>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="flex flex-col gap-4">
                <h3 className="font-azbuka text-[18px] leading-[120%] uppercase text-center">
                  Введіть кількість дорослих
                </h3>
                <p className="text-center text-[13px] leading-[120%] text-gray-dark">
                  {slotSummary}
                </p>
                <div className="flex justify-center">
                  <QuantityControl
                    quantity={adultsQty}
                    min={0}
                    max={MAX_ITEMS_PER_SERVICE}
                    onIncrease={() =>
                      setAdultsQty((prev) =>
                        Math.min(prev + 1, MAX_ITEMS_PER_SERVICE)
                      )
                    }
                    onDecrease={() =>
                      setAdultsQty((prev) => Math.max(prev - 1, 0))
                    }
                  />
                </div>
                <div className="w-full rounded-[12px] bg-purple-ultra-light p-4 text-center">
                  <p className="font-azbuka text-[22px] font-bold leading-[120%]">
                    {total} грн
                  </p>
                  <p className="mt-1 text-[13px] leading-[120%]">
                    {childrenQty} × {selectedSlot?.price ?? 0} грн (діти) +{" "}
                    {adultsQty} × {selectedSlot?.adultPrice ?? 0} грн (дорослі)
                  </p>
                </div>
                <div className="flex gap-2">
                  <BackButton onClick={() => setStep(3)} />
                  <MainButton
                    className="h-12 flex-1 text-[14px]"
                    onClick={handleAddToCart}
                  >
                    Додати в корзину
                  </MainButton>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function SlotPickerModal({
  isModalShown,
  setIsModalShown,
  service,
  sessionKey = 0,
  onAddToCart,
}: SlotPickerModalProps) {
  if (!service) {
    return null;
  }

  return (
    <>
      <Modal
        isModalShown={isModalShown}
        setIsModalShown={setIsModalShown}
        className="pb-5 lg:pb-[22px] pr-2 lg:pr-8"
      >
        <SlotPickerForm
          key={sessionKey}
          service={service}
          setIsModalShown={setIsModalShown}
          onAddToCart={onAddToCart}
        />
      </Modal>
      <Backdrop
        isVisible={isModalShown}
        onClick={() => setIsModalShown(false)}
      />
    </>
  );
}
