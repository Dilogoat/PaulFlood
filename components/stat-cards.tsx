type StatCardsProps = {
  stats: Array<{ label: string; value: string | number }>;
};

export function StatCards({ stats }: StatCardsProps) {
  return (
    <section className="grid four">
      {stats.map((item) => (
        <article key={item.label} className="card">
          <p className="muted">{item.label}</p>
          <p className="big">{item.value}</p>
        </article>
      ))}
    </section>
  );
}
