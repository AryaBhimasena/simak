type StatCardProps = {
  title: string;
  value: string | number;
  highlight?: boolean;
};

export default function StatCard({
  title,
  value,
  highlight = false,
}: StatCardProps) {
  return (
    <div
      className={`
        simakDash__statCard
        ${
          highlight
            ? "simakDash__statCard--highlight"
            : ""
        }
      `}
    >
      <div className="simakDash__statContent">
        <p className="simakDash__statTitle">
          {title}
        </p>

        <h3 className="simakDash__statValue">
          {value}
        </h3>
      </div>
    </div>
  );
}