import { formatNumber } from "../lib/utils";

export default function ResultsTable({
  IMCData,
}: {
  IMCData: { weight: number; height: number; IMC: number; category: string };
}) {
  return (
    <table className="text-center text-xs md:text-base md:[&>tbody>tr>td]:p-2 md:[&>tbody>tr>td]:px-4 [&>tbody>tr>td]:px-2 text-neutral-600 mx-auto">
      <tbody>
        <tr className="border-rose-400 font-bold">
          <td>Peso</td>
          <td>Altura</td>
          <td>IMC</td>
          <td>Resultado</td>
        </tr>
        <tr>
          <td>{formatNumber(IMCData.weight)} kg</td>
          <td>{formatNumber(IMCData.height * 100, 0)} cm</td>
          <td>{formatNumber(IMCData.IMC)}</td>
          <td>{IMCData.category}</td>
        </tr>
      </tbody>
    </table>
  );
}
