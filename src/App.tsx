import { useState } from "react";
import Button from "./components/Button";
import Input from "./components/Input";
import Label from "./components/Label";
import ReferenceTable from "./components/ReferenceTable";
import calculateIMC, { IMCResult } from "./lib/IMC";
import ResultsTable from "./components/ResultsTable";
import { validateHeight, validateWeight } from "./lib/validators";

function App() {
  const [IMCData, setIMCData] = useState<null | {
    weight: number;
    height: number;
    IMC: number;
    category: string;
  }>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData) as {
      weight: string;
      height: string;
    };

    const { weight, height } = data;
    if (!weight || !height) {
      alert("Ops...você precisa preencher os campos");
      return;
    }

    const weightNumber = parseFloat(weight.replace(",", "."));
    const heightNumber = parseFloat(height.replace(",", ".")) / 100;

    const validatorWeight = validateWeight(weightNumber);
    if (validatorWeight) {
      alert(validatorWeight);
      return;
    }

    const validatorHeight = validateHeight(heightNumber);
    if (validatorHeight) {
      alert(validatorHeight);
      return;
    }

    const IMC = calculateIMC(weightNumber, heightNumber);

    const IMCResultString = IMCResult(IMC);

    setIMCData({
      weight: weightNumber,
      height: heightNumber,
      IMC: IMC,
      category: IMCResultString,
    });

    e.currentTarget.reset();
  }

  function handleClickReset(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setIMCData(null);
  }

  return (
    <main className="bg-white max-w-4xl mx-auto md:py-24 md:px-48 px-5 py-10">
      <form onSubmit={handleSubmit}>
        <section id="form">
          <div>
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              disabled={!!IMCData}
              name="weight"
              type="text"
              id="weight"
              className="mt-1"
            />
          </div>

          <div className="mt-4">
            <Label htmlFor="height">Altura (cm)</Label>
            <Input
              disabled={!!IMCData}
              name="height"
              type="text"
              id="height"
              className="mt-1"
            />
          </div>

          {IMCData ? (
            <Button onClick={handleClickReset} type="button">
              Refazer
            </Button>
          ) : (
            <Button type="submit">Calcular</Button>
          )}
        </section>

        <section id="result" className="py-10 px-4 h-40">
          {IMCData ? (
            <ResultsTable IMCData={IMCData} />
          ) : (
            <p className="text-center text-neutral-400">
              Saiba agora se está no seu peso ideal!
            </p>
          )}
        </section>

        <section id="reference-table">
          <ReferenceTable />
        </section>
      </form>
    </main>
  );
}

export default App;
