// React CRUD alkalmazás - Valódi React
const { useState, useEffect } = React;

const KATEGORIAK = ["apród", "lovag", "főnemes", "király"];

// PizzaApp komponens
function PizzaApp() {
  const [pizzas, setPizzas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ nev: "", kategorianev: "apród", vegetarianus: 0 });

  // Adatok betöltése inicializáláskor
  useEffect(() => {
    if (window.PIZZA_DATA && Array.isArray(window.PIZZA_DATA)) {
      const data = window.PIZZA_DATA.map((item, idx) => ({
        id: idx + 1,
        nev: item.nev || "",
        kategorianev: item.kategorianev || "apród",
        vegetarianus: item.vegetarianus || 0
      }));
      setPizzas(data);
    }
  }, []);
