// Kategóriák CRUD - React + Axios
(function() {
  // Várjuk meg míg a React és ReactDOM betöltődik
  function waitForReact(callback, attempts = 0) {
    if (typeof window.React !== "undefined" && typeof window.ReactDOM !== "undefined") {
      callback();
    } else if (attempts < 50) {
      setTimeout(() => waitForReact(callback, attempts + 1), 100);
    }
  }

  waitForReact(function() {
    const { useState, useEffect, useCallback } = window.React;

    function CategoriesApp() {
      const [categories, setCategories] = useState([]);
      const [loading, setLoading] = useState(true);
      const [message, setMessage] = useState("");
      const [messageType, setMessageType] = useState("");
      
      // űrlap állapotok
      const [nev, setNev] = useState("");
      const [ar, setAr] = useState("");
      const [editingId, setEditingId] = useState(null);
      const [usingAxios, setUsingAxios] = useState(false);

      const API_URL = "./backend/api/categories.php";

      // Adatok betöltése
      useEffect(() => {
        loadData();
      }, []);

      async function loadData() {
        setLoading(true);
        try {
          if (typeof window.axios !== "undefined") {
            const response = await window.axios.get(API_URL);
            setCategories(response.data);
            setUsingAxios(true);
            showMessage("Kategóriák betöltve az API-ról", "success");
          } else {
            throw new Error("Axios nem elérhető");
          }
        } catch (err) {
          // Fallback: helyi kategoriesData.js-ből
          if (window.CATEGORIES_DATA && Array.isArray(window.CATEGORIES_DATA)) {
            setCategories(window.CATEGORIES_DATA.map((item, idx) => ({
              id: item.id || idx + 1,
              nev: item.nev || "",
              ar: item.ar || 0
            })));
            setUsingAxios(false);
            showMessage("Kategóriák betöltve helyi forrásból (API offline)", "success");
          } else {
            showMessage("Hiba az adatok betöltésénél: " + err.message, "warning");
          }
        }
        setLoading(false);
      }

      function showMessage(text, type) {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => {
          setMessage("");
          setMessageType("");
        }, 3000);
      }

      async function handleSave() {
        const nevValue = nev.trim();
        const arValue = Number(ar);

        if (!nevValue || arValue <= 0) {
          showMessage("A kategória neve és ár (pozitív szám) kötelező!", "warning");
          return;
        }

        const payload = { nev: nevValue, ar: arValue };

        try {
          if (usingAxios && typeof window.axios !== "undefined") {
            if (editingId === null) {
              await window.axios.post(API_URL, payload);
              showMessage("Kategoria sikeresen hozzáadva!", "success");
            } else {
              await window.axios.put(`${API_URL}?id=${editingId}`, payload);
              showMessage("Kategoria sikeresen módosítva!", "success");
            }
            await loadData();
          } else {
            // Helyi mentés
            if (editingId === null) {
              const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
              setCategories([{ id: newId, ...payload }, ...categories]);
              showMessage("Kategoria sikeresen hozzáadva!", "success");
            } else {
              setCategories(categories.map(c => c.id === editingId ? { id: editingId, ...payload } : c));
              showMessage("Kategoria sikeresen módosítva!", "success");
            }
          }
          resetForm();
        } catch (err) {
          showMessage("Hiba: " + err.message, "warning");
          console.error("Save error:", err);
        }
      }

      async function handleDelete(id) {
        try {
          if (usingAxios && typeof window.axios !== "undefined") {
            await window.axios.delete(`${API_URL}?id=${id}`);
            showMessage("Kategoria sikeresen törölve!", "success");
            await loadData();
          } else {
            setCategories(categories.filter(c => c.id !== id));
            showMessage("Kategoria sikeresen törölve!", "success");
            if (editingId === id) resetForm();
          }
        } catch (err) {
          showMessage("Hiba: " + err.message, "warning");
          console.error("Delete error:", err);
        }
      }

      function handleEdit(category) {
        setNev(category.nev);
        setAr(String(category.ar));
        setEditingId(category.id);
      }

      function resetForm() {
        setNev("");
        setAr("");
        setEditingId(null);
      }

      // JSX renderelés
      return window.React.createElement("div", null,
        window.React.createElement("p", { className: messageType }, message),
        
        window.React.createElement("div", { className: "grid" },
          window.React.createElement("div", null,
            window.React.createElement("label", null, "Kategoria neve"),
            window.React.createElement("input", {
              value: nev,
              onChange: e => setNev(e.target.value),
              placeholder: "pl. apród, lovag"
            })
          ),
          window.React.createElement("div", null,
            window.React.createElement("label", null, "Ár (Ft)"),
            window.React.createElement("input", {
              type: "number",
              value: ar,
              onChange: e => setAr(e.target.value),
              placeholder: "pl. 850",
              min: "0"
            })
          )
        ),
        
        window.React.createElement("div", { className: "actions", style: { marginTop: ".75rem" } },
          window.React.createElement("button", { onClick: handleSave }, editingId === null ? "Új kategória" : "Módosítás"),
          window.React.createElement("button", { className: "secondary", onClick: resetForm }, "Űrlap törlése")
        ),
        
        loading ? window.React.createElement("p", { className: "muted" }, "Betöltés...") :
        window.React.createElement("table", null,
          window.React.createElement("thead", null,
            window.React.createElement("tr", null,
              window.React.createElement("th", null, "ID"),
              window.React.createElement("th", null, "Kategoria"),
              window.React.createElement("th", null, "Ár (Ft)"),
              window.React.createElement("th", null, "Művelet")
            )
          ),
          window.React.createElement("tbody", null,
            categories.map(c => 
              window.React.createElement("tr", { key: c.id },
                window.React.createElement("td", null, c.id),
                window.React.createElement("td", null, window.React.createElement("strong", null, c.nev)),
                window.React.createElement("td", null, c.ar),
                window.React.createElement("td", null,
                  window.React.createElement("div", { className: "actions" },
                    window.React.createElement("button", { className: "secondary", onClick: () => handleEdit(c) }, "Szerkeszt"),
                    window.React.createElement("button", { className: "secondary", onClick: () => handleDelete(c.id) }, "Töröl")
                  )
                )
              )
            )
          )
        )
      );
    }

    // React alkalmazás mountolása
    const root = window.ReactDOM.createRoot(document.getElementById("axiosRoot"));
    root.render(window.React.createElement(CategoriesApp));
  });
})();// Kategóriák CRUD - Axios API
(function() {
  const API_URL = "./backend/api/categories.php"; // Fiktiv API endpoint
  let categories = [];
  let editingId = null;
  let usingAxios = false;

  const root = document.getElementById("axiosRoot");

  // Ellenőrizzük, hogy Axios elérhető-e
  function hasAxios() {
    return typeof window.axios !== "undefined";
  }

  async function loadData() {
    try {
      let data = [];
      
      // Próbáljunk Axios-val betölteni
      if (hasAxios()) {
        try {
          const response = await window.axios.get(API_URL);
          data = response.data;
          usingAxios = true;
          showMessage("Kategóriák betöltve az API-ról", "success");
        } catch (err) {
          console.warn("Axios API hiba:", err.message);
          throw err;
        }
      } else {
        throw new Error("Axios nem elérhető");
      }
      
      categories = data;
    } catch (err) {
      // Fallback: helyi kategoriesData.js-ből
      if (window.CATEGORIES_DATA && Array.isArray(window.CATEGORIES_DATA)) {
        categories = window.CATEGORIES_DATA.map((item, idx) => ({
          id: item.id || idx + 1,
          nev: item.nev || "",
          ar: item.ar || 0
        }));
        usingAxios = false;
        showMessage("Kategóriák betöltve helyi forrásból (API offline)", "success");
      } else {
        showMessage("Hiba az adatok betöltésénél: " + err.message, "warning");
        return;
      }
    }
    render();
  }

  function render() {
    root.innerHTML = `
      <p id="message" class="muted"></p>
      
      <div class="grid">
        <div>
          <label>Kategória neve</label>
          <input id="inputNev" placeholder="pl. apród, lovag">
        </div>
        <div>
          <label>Ár (Ft)</label>
          <input id="inputAr" type="number" placeholder="pl. 850" min="0">
        </div>
      </div>
      
      <div class="actions" style="margin-top: .75rem">
        <button id="btnSave">${editingId === null ? "Új kategória" : "Módosítás"}</button>
        <button id="btnReset" class="secondary">Űrlap törlése</button>
      </div>
      
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Kategória</th>
            <th>Ár (Ft)</th>
            <th>Művelet</th>
          </tr>
        </thead>
        <tbody id="tbody">
          ${categories.map(c => `
            <tr>
              <td>${c.id}</td>
              <td><strong>${c.nev}</strong></td>
              <td>${c.ar}</td>
              <td>
                <div class="actions">
                  <button data-edit="${c.id}" class="secondary">Szerkeszt</button>
                  <button data-del="${c.id}" class="secondary">Töröl</button>
                </div>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    // Késleltetett eseménykezelő beállítás
    setTimeout(() => {
      document.getElementById("btnSave").addEventListener("click", save);
      document.getElementById("btnReset").addEventListener("click", resetForm);

      // Szerkeszt gombok
      document.querySelectorAll("[data-edit]").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = Number(btn.dataset.edit);
          const cat = categories.find(c => c.id === id);
          if (cat) {
            document.getElementById("inputNev").value = cat.nev;
            document.getElementById("inputAr").value = cat.ar;
            editingId = id;
          }
        });
      });

      // Törlés gombok
      document.querySelectorAll("[data-del]").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = Number(btn.dataset.del);
          deleteRow(id);
        });
      });
    }, 0);
  }

  async function save() {
    const nev = document.getElementById("inputNev").value.trim();
    const ar = Number(document.getElementById("inputAr").value);

    if (!nev || ar <= 0) {
      showMessage("A kategória neve és ár (pozitív szám) kötelező!", "warning");
      return;
    }

    try {
      const payload = { nev, ar };
      
      if (usingAxios && hasAxios()) {
        // API-val mentés
        if (editingId === null) {
          await window.axios.post(API_URL, payload);
          showMessage("Kategória sikeresen hozzáadva!", "success");
        } else {
          await window.axios.put(`${API_URL}?id=${editingId}`, payload);
          showMessage("Kategória sikeresen módosítva!", "success");
        }
        await loadData();
      } else {
        // Helyi mentés
        if (editingId === null) {
          const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
          categories.unshift({ id: newId, ...payload });
          showMessage("Kategória sikeresen hozzáadva!", "success");
        } else {
          const idx = categories.findIndex(c => c.id === editingId);
          if (idx !== -1) {
            categories[idx] = { id: editingId, ...payload };
            showMessage("Kategória sikeresen módosítva!", "success");
          }
        }
        resetForm();
      }
    } catch (err) {
      showMessage("Hiba: " + err.message, "warning");
      console.error("Save error:", err);
    }
  }

  async function deleteRow(id) {
    try {
      if (usingAxios && hasAxios()) {
        await window.axios.delete(`${API_URL}?id=${id}`);
        showMessage("Kategória sikeresen törölve!", "success");
        await loadData();
      } else {
        categories = categories.filter(c => c.id !== id);
        showMessage("Kategória sikeresen törölve!", "success");
        if (editingId === id) resetForm();
        render();
      }
    } catch (err) {
      showMessage("Hiba: " + err.message, "warning");
      console.error("Delete error:", err);
    }
  }

  function resetForm() {
    document.getElementById("inputNev").value = "";
    document.getElementById("inputAr").value = "";
    editingId = null;
    render();
  }

  function showMessage(text, type) {
    const msgEl = document.getElementById("message");
    if (msgEl) {
      msgEl.textContent = text;
      msgEl.className = type;
    }
  }

  // Kezdeti betöltés, de mérsékelten hosszú késleltetéssel az Axios betöltéséhez
  setTimeout(loadData, 500);
})();
