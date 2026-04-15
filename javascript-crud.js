// Rendelések CRUD - Vanilla JavaScript (tömbben tárolt adatok)
console.log("Script loaded, ORDERS_DATA:", window.ORDERS_DATA);

let orders = window.ORDERS_DATA ? [...window.ORDERS_DATA] : [];
let editIndex = -1;

const pizzanevEl = document.getElementById("pizzanev");
const darabEl = document.getElementById("darab");
const felvetelEl = document.getElementById("felvetel");
const kiszallitasEl = document.getElementById("kiszallitas");
const tbody = document.getElementById("tbody");
const msg = document.getElementById("msg");
const saveBtn = document.getElementById("saveBtn");
const resetBtn = document.getElementById("resetBtn");

console.log("Elements:", { pizzanevEl, darabEl, felvetelEl, kiszallitasEl, tbody, msg, saveBtn, resetBtn });

if (saveBtn) {
  saveBtn.addEventListener("click", function(e) {
    e.preventDefault();
    console.log("Save button clicked!");
    onSave();
  });
}

if (resetBtn) {
  resetBtn.addEventListener("click", function(e) {
    e.preventDefault();
    console.log("Reset button clicked!");
    resetForm();
  });
}

function onSave() {
  console.log("onSave called");
  const pizzanev = pizzanevEl.value.trim();
  const darab = parseInt(darabEl.value, 10);
  const felvetel = felvetelEl.value.trim();
  const kiszallitas = kiszallitasEl.value.trim();

  console.log({ pizzanev, darab, felvetel, kiszallitas, isNaN: isNaN(darab) });

  if (!pizzanev || isNaN(darab) || darab <= 0 || !felvetel || !kiszallitas) {
    msg.textContent = "Minden mező kitöltése kötelező és a darab pozitív szám!";
    msg.className = "warning";
    console.log("Validation error");
    return;
  }

  const item = { pizzanev, darab, felvetel, kiszallitas };
  console.log("Item to save:", item);

  if (editIndex === -1) {
    orders.unshift(item);
    msg.textContent = "Új rendelés hozzáadva.";
    console.log("Added new order, total:", orders.length);
  } else {
    orders[editIndex] = item;
    msg.textContent = "Rendelés módosítva.";
    editIndex = -1;
    console.log("Updated order");
  }
  
  msg.className = "success";
  setTimeout(() => { msg.className = "muted"; }, 3000);
  resetForm();
  render();
}

function onEdit(index) {
  const o = orders[index];
  pizzanevEl.value = o.pizzanev;
  darabEl.value = o.darab;
  felvetelEl.value = o.felvetel;
  kiszallitasEl.value = o.kiszallitas;
  editIndex = index;
}

function onDelete(index) {
  orders.splice(index, 1);
  if (editIndex === index) editIndex = -1;
  render();
}
