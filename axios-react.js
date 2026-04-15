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
  }
