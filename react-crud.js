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

  // Szűrt pizza lista
  const filteredPizzas = pizzas.filter(p => 
    p.nev.toLowerCase().includes(search.toLowerCase())
  );

  // Űrlap változás kezelése
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === "vegetarianus" ? Number(value) : value }));
  };

  // Mentés (Create/Update)
  const handleSave = () => {
    if (!form.nev || !form.kategorianev) return;

    if (editingId === null) {
      // Új pizza hozzáadása
      const newId = pizzas.length > 0 ? Math.max(...pizzas.map(p => p.id)) + 1 : 1;
      setPizzas(prev => [{ id: newId, ...form }, ...prev]);
    } else {
      // Meglévő módosítása
      setPizzas(prev => prev.map(p => p.id === editingId ? { id: editingId, ...form } : p));
    }
    handleReset();
  };

  // Szerkesztés indítása
  const handleEdit = (pizza) => {
    setForm({ nev: pizza.nev, kategorianev: pizza.kategorianev, vegetarianus: pizza.vegetarianus });
    setEditingId(pizza.id);
  };

  // Törlés
  const handleDelete = (id) => {
    setPizzas(prev => prev.filter(p => p.id !== id));
    if (editingId === id) handleReset();
  };

  // Űrlap resetelése
  const handleReset = () => {
    setForm({ nev: "", kategorianev: "apród", vegetarianus: 0 });
    setEditingId(null);
  };

  return (
    React.createElement("div", null,
      // Űrlap
      React.createElement("div", { className: "grid" },
        React.createElement("div", null,
          React.createElement("label", null, "Név"),
          React.createElement("input", { 
            name: "nev", 
            value: form.nev, 
            onChange: handleChange, 
            placeholder: "Pizza neve" 
          })
        ),
        React.createElement("div", null,
          React.createElement("label", null, "Catégorie"),
          React.createElement("select", { 
            name: "kategorianev", 
            value: form.kategorianev, 
            onChange: handleChange 
          },
            KATEGORIAK.map(k => React.createElement("option", { key: k, value: k }, k))
          )
        ),
        React.createElement("div", null,
          React.createElement("label", null, "Vegetáriánus"),
          React.createElement("select", { 
            name: "vegetarianus", 
            value: form.vegetarianus, 
            onChange: handleChange 
          },
            React.createElement("option", { value: 0 }, "Nem"),
            React.createElement("option", { value: 1 }, "Igen")
          )
        )
      ),
