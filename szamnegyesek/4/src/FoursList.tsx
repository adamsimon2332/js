import type { Four } from "./FoursApi";

export default function FoursList({ fours }: { fours: Four[] }) {
  if (!fours.length) return <div>Nincs rögzített számnégyes.</div>;
  return (
    <ul>
      {fours.map((four) => (
        <li key={four.id}>
          #{four.id}: {four.numbers.join(", ")}
        </li>
      ))}
    </ul>
  );
}
