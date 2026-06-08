export default function SectionCard({ title, items }) {
  return (
    <div className="simakDash__sectionCard">
      <h3 className="simakDash__sectionTitle">{title}</h3>

      <ul className="simakDash__sectionList">
        {items.map((item, index) => (
          <li key={index} className="simakDash__sectionItem">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
