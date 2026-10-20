import { useEffect, useRef, useState } from "react";
import Button from "./components/Button";
import MeasurementInput from "./components/MeasurementInput";
import Icon from "./components/Icon";
import Label from "./components/Label";
import ReferenceTable from "./components/ReferenceTable";
import ResultsTable from "./components/ResultsTable";
import calculateIMC, { IMCResult, type Calculation } from "./lib/IMC";
import { parseMeasurement } from "./lib/validators";
import type { MeasurementField } from "./lib/inputMask";

const measurementFields = [
  {
    name: "weight",
    label: "Seu peso",
    unit: "kg",
    hint: "Digite 755 → 75,5 kg. Vírgula automática.",
  },
  {
    name: "height",
    label: "Sua altura",
    unit: "m",
    hint: "Digite 175 → 1,75 m. Vírgula automática.",
  },
] as const;

function App() {
  const [values, setValues] = useState({ weight: "", height: "" });
  const [errors, setErrors] = useState<
    Partial<Record<MeasurementField, string>>
  >({});
  const [result, setResult] = useState<Calculation | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (result) resultRef.current?.focus();
  }, [result]);

  function focusField(field: MeasurementField) {
    formRef.current?.querySelector<HTMLInputElement>(`#${field}`)?.focus();
  }

  function setFieldError(field: MeasurementField, error?: string) {
    setErrors((previous) => ({ ...previous, [field]: error }));
  }

  function changeField(field: MeasurementField, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setFieldError(field);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const weight = parseMeasurement(values.weight, "weight");
    const height = parseMeasurement(values.height, "height");
    setErrors({
      weight: weight.error ?? undefined,
      height: height.error ?? undefined,
    });
    if (weight.value === null || height.value === null) {
      setResult(null);
      focusField(weight.error ? "weight" : "height");
      return;
    }
    const IMC = calculateIMC(weight.value, height.value);
    setResult({
      weight: weight.value,
      height: height.value,
      IMC,
      category: IMCResult(IMC),
    });
  }

  function reset() {
    setValues({ weight: "", height: "" });
    setErrors({});
    setResult(null);
    focusField("weight");
  }

  return (
    <div className={`app-shell ${result ? "showing-result" : "initial-view"}`}>
      <header className="site-header">
        <a className="brand" href="#main">
          <span className="brand-mark" aria-hidden="true">
            <Icon name="heart" />
          </span>
          equilíbrio<span className="brand-period">.</span>
        </a>
      </header>
      <main id="main">
        <section className="intro">
          <h1>
            Seu corpo, além <br />
            de um <span>número.</span>
          </h1>
          <p>Calcule seu IMC e conheça a faixa de peso para sua altura.</p>
        </section>
        <div className="calculator-grid">
          <section
            className="calculator card"
            aria-labelledby="calculator-title"
          >
            <div className="step-label">
              <span>01</span> SEUS DADOS
            </div>
            <h2 id="calculator-title">Vamos calcular seu IMC?</h2>
            <p className="section-description">
              Preencha seu peso e sua altura para começar.
            </p>
            <form ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className="measurement-fields">
                {measurementFields.map(({ name: field, label, unit, hint }) => (
                  <div className="field" key={field}>
                    <Label htmlFor={field}>{label}</Label>
                    <div
                      className={`input-wrap ${errors[field] ? "invalid" : ""}`}
                    >
                      <MeasurementInput
                        field={field}
                        value={values[field]}
                        error={errors[field]}
                        onError={(message) => setFieldError(field, message)}
                        onChange={(value) => changeField(field, value)}
                      />
                      <span className="input-unit" aria-hidden="true">
                        {unit}
                      </span>
                    </div>
                    <p id={`${field}-hint`} className="sr-only">
                      {hint}
                    </p>
                    {errors[field] && (
                      <p
                        className="field-error"
                        id={`${field}-error`}
                        role="alert"
                      >
                        {errors[field]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <Button type="submit">
                Calcular meu IMC <Icon name="arrow" />
              </Button>
              {result && (
                <button className="reset-button" type="button" onClick={reset}>
                  <Icon name="reset" /> Refazer cálculo
                </button>
              )}
            </form>
          </section>
          <section
            className="result-panel"
            ref={resultRef}
            tabIndex={-1}
            aria-label="Resultado do cálculo"
            aria-live="polite"
            aria-atomic="true"
          >
            {result && <ResultsTable IMCData={result} />}
          </section>
        </div>
        {result && <ReferenceTable imc={result.IMC} />}
      </main>
      <footer>
        <span className="footer-brand">equilíbrio.</span>
      </footer>
    </div>
  );
}

export default App;
