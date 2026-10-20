import {
  getPresentationTone,
  getUnderweightNotice,
  getBoundaryNotice,
  referenceWeight,
  type Calculation,
} from "../lib/IMC";
import { formatNumber } from "../lib/utils";
import BMIAvatar from "./BMIAvatar";
import Icon from "./Icon";

export default function ResultsTable({ IMCData }: { IMCData: Calculation }) {
  const { weight, height, IMC, category } = IMCData;
  const range = referenceWeight(height);
  const boundaryNotice = getBoundaryNotice(IMC);
  const underweightNotice = getUnderweightNotice(IMC);
  const tone = getPresentationTone(IMC);
  const below = IMC < 18.5;
  const above = IMC >= 25;
  const formattedIMC = formatNumber(IMC);
  const action = below ? "ganhar" : "perder";
  const noticeTitle =
    underweightNotice?.title ??
    (boundaryNotice?.atBoundary
      ? "Seu IMC está no limite entre duas faixas"
      : "Atenção: seu IMC está perto de outra faixa");
  const difference = below ? range.min - weight : weight - range.max;
  const amount =
    difference < 0.05
      ? "menos de 0,1"
      : `cerca de ${formatNumber(difference, 1)}`;
  return (
    <div className="result-content">
      <h2 className="result-title">Resultado</h2>
      <BMIAvatar category={category} large />
      <div
        className={`result-number${formattedIMC.length > 5 ? " result-number-long" : ""}`}
      >
        <span className="imc-value">
          {formattedIMC}
          <span
            className="imc-unit"
            aria-label="quilogramas por metro quadrado"
          >
            kg/m²
          </span>
        </span>
      </div>
      <span className={`category-pill ${tone}`}>{category}</span>
      {(underweightNotice || boundaryNotice) && (
        <aside
          className={`boundary-notice ${tone}`}
          aria-labelledby="result-notice-title"
        >
          <h3 id="result-notice-title">
            <Icon name="info" />
            {noticeTitle}
          </h3>
          {underweightNotice ? (
            <>
              <p>{underweightNotice.message}</p>
              {boundaryNotice && (
                <p>
                  Seu IMC está perto da faixa de peso adequado, que começa em
                  18,5.
                </p>
              )}
            </>
          ) : (
            boundaryNotice && (
              <p>
                Você está na faixa de <strong>{category}</strong>. Se o seu IMC{" "}
                {boundaryNotice.direction === "higher" ? "chegar a" : "ficar"}{" "}
                <strong>
                  {boundaryNotice.direction === "higher"
                    ? `${formatNumber(boundaryNotice.boundary, 1)} ou mais`
                    : `abaixo de ${formatNumber(boundaryNotice.boundary, 1)}`}
                </strong>
                , ele passa para <strong>{boundaryNotice.nextCategory}</strong>.
              </p>
            )
          )}
        </aside>
      )}
      <div className="difference">
        {IMC === 25 ? (
          <p>
            Pelo cálculo, seu peso precisaria ficar um pouco abaixo do atual.
          </p>
        ) : below || above ? (
          <p>
            Pelo cálculo, você precisaria{" "}
            <strong>
              {action} {amount} kg.
            </strong>
          </p>
        ) : (
          <p>
            Pelo cálculo, seu peso já está na faixa adequada. Você não precisa
            ganhar nem perder peso.
          </p>
        )}
      </div>
      <div className="weight-reference">
        <h3>Qual peso corresponde a um IMC adequado para você?</h3>
        <p className="weight-range">
          Entre {formatNumber(range.min, 1)} e {formatNumber(range.max, 1)}{" "}
          <span>kg</span>
        </p>
      </div>
    </div>
  );
}
