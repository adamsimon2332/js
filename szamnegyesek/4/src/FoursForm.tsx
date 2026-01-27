import React, { useState } from "react";
import { addFour } from "./FoursApi";

export default function FoursForm({ onSuccess }: { onSuccess: () => void }) {
  const [values, setValues] = useState(["", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (i: number, v: string) => {
    const newVals = [...values];
    newVals[i] = v;
    setValues(newVals);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const nums = values.map(Number);
      await addFour(nums);
      setValues(["", "", "", ""]);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: 8, alignItems: "center" }}
    >
      {values.map((v, i) => (
        <input
          key={i}
          type="number"
          value={v}
          onChange={(e) => handleChange(i, e.target.value)}
          required
          style={{ width: 50 }}
        />
      ))}
      <button type="submit" disabled={loading}>
        Rögzít
      </button>
      {error && <span style={{ color: "red", marginLeft: 8 }}>{error}</span>}
    </form>
  );
}
