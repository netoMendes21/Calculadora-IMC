export default function ReferenceTable() {
  return (
    <table className="mx-auto text-neutral-600 text-left">
      <thead className="bg-zinc-100 text-rose-400 text-xl">
        <tr>
          <th className="px-6 py-2">IMC</th>
          <th className="px-6 py-2">Classificação</th>
        </tr>
      </thead>
      <tbody className="[&>tr:nth-child(even)]:bg-zinc-100 [&>tr:nth-child(odd)]:bg-white [&>tr>td]:px-6 [&>tr>td]:py-1">
        <tr>
          <td>menos de 17</td>
          <td>Muito abaixo do peso</td>
        </tr>
        <tr>
          <td>Menor que 18,5</td>
          <td>Abaixo do peso</td>
        </tr>
        <tr>
          <td>Entre 18,5 a 24,9</td>
          <td>Peso normal</td>
        </tr>
        <tr>
          <td>25 a 29,9</td>
          <td>Sobrepeso</td>
        </tr>
        <tr>
          <td>30 a 34,9</td>
          <td>Obesidade grau I</td>
        </tr>
        <tr>
          <td>35 a 39,9</td>
          <td>Obesidade grau II</td>
        </tr>
        <tr>
          <td>Maior que 40</td>
          <td>Obesidade grau III</td>
        </tr>
      </tbody>
    </table>
  );
}
