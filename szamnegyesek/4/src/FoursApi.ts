export interface Four {
  id: number;
  numbers: number[];
}

const API_URL = "http://localhost:3000/fours";

export async function getFours(): Promise<Four[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

export async function getFour(id: number): Promise<Four> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error("Not found");
  return res.json();
}

export async function addFour(numbers: number[]): Promise<Four> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ numbers }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Invalid data");
  }
  return res.json();
}
