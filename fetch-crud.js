const API_URL = "backend/api/pizzas.php";
let editingId = null;

const fNev = document.getElementById("f_nev");
const fKat = document.getElementById("f_kat");
const fVeg = document.getElementById("f_veg");
const fBody = document.getElementById("f_tbody");
const fMsg = document.getElementById("f_msg");

document.getElementById("f_save").addEventListener("click", save);
document.getElementById("f_reset").addEventListener("click", resetForm);

async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Hiba történt");
  return data;
}
