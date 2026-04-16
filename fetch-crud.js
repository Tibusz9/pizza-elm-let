const API_URL = "./backend/api/pizzas.php";
let editingId = null;

const fNev = document.getElementById("f_nev");
const fKat = document.getElementById("f_kat");
const fVeg = document.getElementById("f_veg");
const fBody = document.getElementById("f_tbody");
const fMsg = document.getElementById("f_msg");

document.getElementById("f_save").addEventListener("click", save);
document.getElementById("f_reset").addEventListener("click", resetForm);

async function request(url, options = {}) {
  let res;
  try {
    res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options
    });
  } catch (_err) {
    throw new Error("Az API nem elerheto. Inditsd a projektet PHP szerveren (nem file:// modban).");
  }

  const text = await res.text();
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch (_err) {
    if (!res.ok) {
      throw new Error("A szerver hibat adott vissza, de nem JSON formatumban.");
    }
    throw new Error("Ervenytelen API valasz.");
  }

  if (!res.ok) throw new Error(data?.error || "Hiba tortent");
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
      fMsg.textContent = "Rekord letrehozva.";
    } else {
      const safeId = encodeURIComponent(editingId);
      await request(`${API_URL}?id=${safeId}`, { method: "PUT", body: JSON.stringify(payload) });
      fMsg.textContent = "Rekord modositva.";
    }

    fMsg.className = "success";
    resetForm();
    await loadRows();
  } catch (err) {
    fMsg.textContent = err.message;
    fMsg.className = "warning";
  }
}

function startEdit(row) {
  editingId = row.id ?? row.nev;
  fNev.value = row.nev;
  fKat.value = row.kategorianev;
  fVeg.value = String(row.vegetarianus);
}

async function removeRow(id) {
  try {
    const safeId = encodeURIComponent(id);
    await request(`${API_URL}?id=${safeId}`, { method: "DELETE" });
    if (editingId === id) resetForm();
    await loadRows();
  } catch (err) {
    fMsg.textContent = err.message;
    fMsg.className = "warning";
  }
}

function resetForm() {
  editingId = null;
  fNev.value = "";
  fKat.value = "";
  fVeg.value = "0";
}

function render(rows) {
  fBody.innerHTML = "";

  rows.forEach((row) => {
    const rowKey = row.id ?? row.nev;
    const displayId = row.id ?? "-";
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${displayId}</td>
      <td>${row.nev}</td>
      <td>${row.kategorianev}</td>
      <td>${row.vegetarianus ? "Igen" : "Nem"}</td>
      <td>
        <div class="actions">
          <button class="secondary" data-edit="${rowKey}">Szerkeszt</button>
          <button class="secondary" data-del="${rowKey}">Töröl</button>
        </div>
      </td>
    `;

    tr.querySelector("[data-edit]").addEventListener("click", () => startEdit(row));
    tr.querySelector("[data-del]").addEventListener("click", () => removeRow(rowKey));
    fBody.appendChild(tr);
  });
}

loadRows();
