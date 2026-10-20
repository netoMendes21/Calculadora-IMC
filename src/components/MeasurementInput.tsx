import { useLayoutEffect, useRef, useState } from "react";
import Input from "./Input";
import {
  maskCursor,
  maskMeasurement,
  normalizeMeasurementPaste,
  type MeasurementField,
} from "../lib/inputMask";

export default function MeasurementInput({
  field,
  value,
  error,
  onChange,
  onError,
}: {
  field: MeasurementField;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onError: (message: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pointerFocus, setPointerFocus] = useState(false);
  const cursorRef = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (
      cursorRef.current !== null &&
      document.activeElement === inputRef.current
    ) {
      inputRef.current?.setSelectionRange(cursorRef.current, cursorRef.current);
      cursorRef.current = null;
    }
  });

  function update(raw: string, position: number) {
    const masked = maskMeasurement(raw, field);
    cursorRef.current = maskCursor(
      masked,
      raw.slice(position).replace(/\D/g, "").length,
    );
    onChange(masked);
  }

  return (
    <Input
      ref={inputRef}
      data-pointer-focus={pointerFocus || undefined}
      onPointerDown={() => setPointerFocus(true)}
      onBlur={() => setPointerFocus(false)}
      id={field}
      name={field}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      spellCheck={false}
      placeholder={field === "weight" ? "Ex.: 100,0" : "Ex.: 1,75"}
      value={value}
      aria-invalid={Boolean(error)}
      aria-describedby={`${field}-hint${error ? ` ${field}-error` : ""}`}
      onChange={(event) => {
        const raw = event.target.value;
        if (!/^\d*(?:[.,]\d*)?$/.test(raw)) {
          onError(
            "Digite apenas números. A vírgula é inserida automaticamente.",
          );
          return;
        }
        update(raw, event.target.selectionStart ?? raw.length);
      }}
      onPaste={(event) => {
        event.preventDefault();
        const pasted = normalizeMeasurementPaste(
          event.clipboardData.getData("text"),
          field,
        );
        if (pasted === null) {
          onError(
            `Use somente números, sem milhar. Exemplo: ${field === "weight" ? "755 → 75,5 kg" : "175 → 1,75 m"}.`,
          );
          return;
        }
        if (pasted.includes(",")) {
          // A pasted decimal already declares its units: preserve that value.
          update(pasted, pasted.length);
        } else {
          const start = event.currentTarget.selectionStart ?? value.length;
          const end = event.currentTarget.selectionEnd ?? start;
          update(
            value.slice(0, start) + pasted + value.slice(end),
            start + pasted.length,
          );
        }
      }}
      onKeyDown={(event) => {
        const input = event.currentTarget;
        const start = input.selectionStart ?? 0;
        if (start !== input.selectionEnd) return;
        const canDelete =
          (event.key === "Backspace" && start > 0) ||
          (event.key === "Delete" && start < value.length);
        if (canDelete && /^0*,0+$/.test(value)) {
          event.preventDefault();
          update("", 0);
          return;
        }
        // Deleting the comma also removes the adjacent digit, instead of trapping the cursor.
        const index = event.key === "Backspace" ? start - 1 : start;
        if (
          (event.key === "Backspace" || event.key === "Delete") &&
          value[index] === ","
        ) {
          event.preventDefault();
          const digit = event.key === "Backspace" ? index - 1 : index + 1;
          update(
            value.slice(0, digit) + value.slice(digit + 1),
            Math.max(0, digit),
          );
        }
      }}
    />
  );
}
