import { En } from './Layout';

/**
 * 사용량 표 — src/data/site.js 의 processes[*] 로부터 자동 렌더링.
 *
 * 기존 정적 사이트에서는 이 숫자가 JS의 DATA와 HTML의 <table> 두 곳에
 * 중복돼 있어 항상 함께 고쳐야 했지만, 이제는 데이터 한 곳만 고치면 됩니다.
 */
export default function DosageTable({ process }) {
  const { title, unit, columns, rows } = process;

  return (
    <div className="table-wrap">
      <table>
        <caption>{title} 코라텍스 사용량 — 기계 규모별 권장량</caption>
        <thead>
          <tr>
            <th scope="col">{unit}</th>
            {columns.map((c, i) => (
              <th key={i} scope="col">
                {c.ko}
                <En>{c.en}</En>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key}>
              <th scope="row">
                {row.ko}
                <En>{row.en}</En>
              </th>
              {row.cells.map((cell, i) => (
                <td key={i}>
                  {typeof cell === 'string' ? (
                    cell
                  ) : (
                    <>
                      <strong>{cell.strong}</strong>
                      {cell.rest}
                    </>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
