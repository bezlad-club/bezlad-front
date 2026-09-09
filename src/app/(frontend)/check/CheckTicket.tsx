"use client";
import { SubmitEvent, useState } from "react";
import Container from "@/components/shared/container/Container";
import MainButton from "@/components/shared/buttons/MainButton";
import { formatDateShortUk } from "@/utils/dateUtils";

interface TicketCheckResult {
  valid?: boolean;
  service?: string;
  date?: string;
  slot?: { startTime?: string; endTime?: string } | null;
  visitors?: number;
  clientName?: string;
  reason?: string;
}

const PIN_STORAGE_KEY = "bezlad_ticket_check_pin";

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-baseline justify-between gap-4">
      <span className="shrink-0 text-gray-dark">{label}</span>
      <span className="text-right font-semibold">{value}</span>
    </li>
  );
}

export default function CheckTicket() {
  const [pin, setPin] = useState("");
  const [code, setCode] = useState("");
  const [result, setResult] = useState<TicketCheckResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheck = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode || isLoading) return;

    const effectivePin =
      pin.trim() || sessionStorage.getItem(PIN_STORAGE_KEY) || "";

    setIsLoading(true);
    setResult(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/tickets/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: trimmedCode, pin: effectivePin }),
      });

      if (response.status === 403) {
        sessionStorage.removeItem(PIN_STORAGE_KEY);
        setErrorMessage("Невірний PIN-код. Спробуйте ще раз.");
        return;
      }

      const data = (await response.json()) as TicketCheckResult;
      if (effectivePin) {
        sessionStorage.setItem(PIN_STORAGE_KEY, effectivePin);
      }
      setResult(data);
    } catch {
      setErrorMessage("Не вдалося перевірити квиток. Спробуйте ще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="pt-[110px] lg:pt-[150px] pb-16">
      <h1 className="mb-2 font-azbuka text-[28px] lg:text-[36px] leading-[120%] uppercase text-center">
        Перевірка квитків
      </h1>
      <p className="mb-8 text-[14px] leading-[120%] text-center text-gray-dark">
        Введіть код з квитка клієнта, щоб підтвердити відвідування
      </p>

      <form
        onSubmit={handleCheck}
        className="mx-auto flex w-full max-w-[420px] flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="check-pin"
            className="text-[12px] font-semibold uppercase text-gray-dark"
          >
            PIN-код
          </label>
          <input
            id="check-pin"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            value={pin}
            onChange={(event) => setPin(event.target.value)}
            className="h-12 w-full rounded-[16px] border border-gray-light bg-white px-4 text-[16px] outline-none transition-colors duration-200 focus:border-purple"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="check-code"
            className="text-[12px] font-semibold uppercase text-gray-dark"
          >
            Код квитка
          </label>
          <input
            id="check-code"
            type="text"
            inputMode="text"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={10}
            placeholder="ABC123"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            className="h-16 w-full rounded-[16px] border-2 border-purple bg-white px-4 text-center font-azbuka text-[26px] uppercase tracking-[0.15em] outline-none placeholder:text-gray-light"
          />
        </div>
        <MainButton
          type="submit"
          disabled={!code.trim() || isLoading}
          isLoading={isLoading}
          loadingText="Перевірка..."
          className="h-14 text-[16px]"
        >
          Перевірити
        </MainButton>
      </form>

      {errorMessage && (
        <div className="mx-auto mt-6 w-full max-w-[420px] rounded-[16px] border-2 border-red-500 bg-red-50 p-5 text-center">
          <p className="font-azbuka text-[18px] uppercase text-red-600">
            Помилка
          </p>
          <p className="mt-1 text-[14px] leading-[120%] text-red-600">
            {errorMessage}
          </p>
        </div>
      )}

      {result && result.valid && (
        <div className="mx-auto mt-6 w-full max-w-[420px] rounded-[16px] border-2 border-green-600 bg-green-50 p-5">
          <p className="text-center font-azbuka text-[22px] lg:text-[26px] leading-[120%] uppercase text-green-700">
            Квиток дійсний
          </p>
          <ul className="mt-4 flex flex-col gap-2 text-[15px] leading-[120%]">
            <ResultRow label="Послуга:" value={result.service || "—"} />
            <ResultRow
              label="Дата:"
              value={result.date ? formatDateShortUk(result.date) : "—"}
            />
            <ResultRow
              label="Час:"
              value={
                result.slot?.startTime && result.slot?.endTime
                  ? `${result.slot.startTime} - ${result.slot.endTime}`
                  : "—"
              }
            />
            <ResultRow
              label="Відвідувачів:"
              value={String(result.visitors ?? 0)}
            />
            <ResultRow label="Клієнт:" value={result.clientName || "—"} />
          </ul>
        </div>
      )}

      {result && !result.valid && (
        <div className="mx-auto mt-6 w-full max-w-[420px] rounded-[16px] border-2 border-red-500 bg-red-50 p-5 text-center">
          <p className="font-azbuka text-[22px] lg:text-[26px] leading-[120%] uppercase text-red-600">
            Квиток недійсний
          </p>
          <p className="mt-2 text-[15px] leading-[120%] text-red-600">
            {result.reason || "Спробуйте ще раз"}
          </p>
        </div>
      )}
    </Container>
  );
}
