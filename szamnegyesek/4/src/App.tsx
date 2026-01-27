import { useEffect, useState } from "react";
import { getFours } from "./FoursApi";
import type { Four } from "./FoursApi";
import FoursForm from "./FoursForm";
import FoursList from "./FoursList";
import "./App.css";

function App() {
  const [fours, setFours] = useState<Four[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFours = async () => {
    setLoading(true);
    try {
      setFours(await getFours());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFours();
  }, []);

  return (
    <div className="App">
      <h1>Számnégyesek</h1>
      <FoursForm onSuccess={fetchFours} />
      <h2>Rögzített számnégyesek</h2>
      {loading ? <div>Betöltés...</div> : <FoursList fours={fours} />}
    </div>
  );
}

export default App;
