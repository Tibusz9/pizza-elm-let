// Kategóriák CRUD - Axios API
(function() {
  const API_URL = "backend/api/categories.php"; // Fiktív API endpoint
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
  }function render() {
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
  
