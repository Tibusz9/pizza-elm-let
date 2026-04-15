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
