import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Série unique : bleu séquentiel validé (palette de référence dataviz)
const SERIES_COLOR = '#2a78d6';
const AXIS = { stroke: '#9ca3af', fontSize: 12, tickLine: false, axisLine: false };

// Carte « un graphique en barres + sa vue tableau » (une seule série, un seul axe)
export function BarChartCard({
  title,
  data,
  dataKey,
  label,
  format = String,
  axisFormat = format,
  horizontal = false,
}) {
  const layout = horizontal ? 'vertical' : 'horizontal';

  return (
    <section className="chart-card">
      <h2 className="chart-card__title">{title}</h2>
      {data.length === 0 ? (
        <p className="chart-card__empty">Aucune donnée pour le moment</p>
      ) : (
        <div className="chart-card__plot">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout={layout}
              margin={{ top: 8, right: 16, bottom: 0, left: 8 }}
            >
              <CartesianGrid stroke="#e5e7eb" vertical={horizontal} horizontal={!horizontal} />
              {horizontal ? (
                <>
                  <XAxis type="number" {...AXIS} tickFormatter={axisFormat} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" {...AXIS} width={90} />
                </>
              ) : (
                <>
                  <XAxis dataKey="name" {...AXIS} />
                  <YAxis {...AXIS} tickFormatter={axisFormat} width={90} allowDecimals={false} />
                </>
              )}
              <Tooltip formatter={(value) => [format(value), label]} cursor={{ fill: '#f3f4f6' }} />
              <Bar
                dataKey={dataKey}
                name={label}
                fill={SERIES_COLOR}
                barSize={24}
                radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <details className="chart-card__table">
        <summary>Voir les données</summary>
        <table>
          <tbody>
            {data.map((row) => (
              <tr key={row.name}>
                <th scope="row">{row.name}</th>
                <td>{format(row[dataKey])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}
