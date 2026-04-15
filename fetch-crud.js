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
async function loadRows() {
  try {
    const rows = await request(API_URL);
    render(rows);
    fMsg.textContent = `Betöltve: ${rows.length} rekord`;
    fMsg.className = "muted";
  } catch (err) {
    fMsg.textContent = err.message;
    fMsg.className = "warning";
  }
}

async function save() {
  const payload = {
    nev: fNev.value.trim(),
    kategorianev: fKat.value.trim(),
    vegetarianus: Number(fVeg.value)
  };
  if (!payload.nev || !payload.kategorianev) return;

  try {
    if (editingId === null) {
      await request(API_URL, { method: "POST", body: JSON.stringify(payload) });
      fMsg.textContent = "Rekord létrehozva.";
    } else {
      await request(`${API_URL}?id=${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
      fMsg.textContent = "Rekord módosítva.";
    }
    fMsg.className = "success";
    resetForm();
    loadRows();
  } catch (err) {
    fMsg.textContent = err.message;
    fMsg.className = "warning";
  }
}

function startEdit(row) {
  editingId = row.id;
  fNev.value = row.nev;
  fKat.value = row.kategorianev;
  fVeg.value = String(row.vegetarianus);
}

async function removeRow(id) {
  try {
    await request(`${API_URL}?id=${id}`, { method: "DELETE" });
    if (editingId === id) resetForm();
    loadRows();
  } catch (err) {
    fMsg.textContent = err.message;
    fMsg.className = "warning";
  }
}
