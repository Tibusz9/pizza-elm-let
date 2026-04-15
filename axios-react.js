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
