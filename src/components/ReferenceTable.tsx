import { categories, classifyIMC, getPresentationTone } from "../lib/IMC";
import BMIAvatar from "./BMIAvatar";

export default function ReferenceTable({ imc }: { imc: number }) {
  const category = classifyIMC(imc).label;
  const tone = getPresentationTone(imc);
  return (
    <section className="reference card" aria-labelledby="reference-title">
      <div className="section-heading">
        <span className="eyebrow">ENTENDA SEU RESULTADO</span>
        <h2 id="reference-title">Classificação do IMC para adultos</h2>
      </div>
      <table>
        <caption className="sr-only">
          Tabela de faixas de IMC para adultos.
        </caption>
        <thead>
          <tr>
            <th scope="col">Valor do IMC</th>
            <th scope="col">
              <span className="classification-heading">
                <span aria-hidden="true" />
                <span>O que indica</span>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((item) => {
            const selected = category === item.label;
            return (
              <tr
                key={item.label}
                className={selected ? `selected ${tone}` : undefined}
                aria-current={selected ? "true" : undefined}
              >
                <td>{item.range}</td>
                <td>
                  <span className="classification-label">
                    <BMIAvatar category={item.label} />
                    <span className="classification-text">
                      {selected && (
                        <span
                          className="current-indicator"
                          aria-hidden="true"
                        />
                      )}
                      {item.label}
                      {selected && (
                        <span className="sr-only"> — sua faixa atual</span>
                      )}
                    </span>
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="source">
        Fonte:{" "}
        <a
          href="https://www.who.int/data/nutrition/nlis/info/malnutrition-in-women"
          target="_blank"
          rel="noreferrer"
        >
          OMS ↗
        </a>
        .{" "}
        <a
          href="https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html"
          target="_blank"
          rel="noreferrer"
        >
          CDC ↗
        </a>
      </p>
    </section>
  );
}
