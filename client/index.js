document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:5000/getAll")
      .then((response) => response.json())
      .then((data) => loadHTMLTable(data["data"]));
  });
  
  document
    .querySelector("table tbody")
    .addEventListener("click", function (event) {
      if (event.target.className === "delete-btn") {
        deleteRowById(event.target.dataset.id);
      }
      if (event.target.className === "edit-row-btn") {
        handleEditRow(event.target.dataset.id);
      }
    });
  
  const updateBtn = document.querySelector("#update-row-btn");
  
  function deleteRowById(id) {
    fetch("http://localhost:5000/delete/" + id, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          location.reload();
        }
      });
  }
  
  function handleEditRow(id) {
    const updateSection = document.querySelector("#update-row");
    updateSection.hidden = false;
    document.querySelector("#update-product-input").dataset.id = id;
  }
  
  updateBtn.onclick = function () {
    const updateNavnInput = document.querySelector("#update-product-input");
  
    console.log(updateNavnInput);
  
    fetch("http://localhost:5000/update", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        id: updateNavnInput.dataset.id,
        navn: updateNavnInput.value,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          location.reload();
        }
      });
  };
  
  const addBtn = document.querySelector("#add-product-btn");
  // Tilføjer en on click function til id'et #add-product-btn
  // Vælger hvilke id'er on click funktionen skal tage deres værdi fra
  addBtn.onclick = function () {
    const navnInput = document.querySelector("#navn-input");
    const navn = navnInput.value;
    navnInput.value = "";
    const beskrInput = document.querySelector("#desc-input").value;
    const enhedInput = document.querySelector("#enhed-input").value;
    const amountInput = document.querySelector("#amount-input").value;
    const prisInput = document.querySelector("#pris-input").value;
    const kategoriInput = document.querySelector("#kategori-input").value;

  
    fetch("http://localhost:5000/insert", {
      headers: {
        "Content-type": "application/json",
      },
      // Poster dem ind i et objekt
      method: "POST",
      body: JSON.stringify({ navn: navn, beskrivelse: beskrInput, kg: enhedInput, amount: amountInput, pris: prisInput, kategori: kategoriInput  }),
    })
      .then((response) => response.json())
      .then((data) => insertRowIntoTable(data["data"]));
  };
  
  function insertRowIntoTable(data) {
    console.log(data);
    const table = document.querySelector("table tbody");
    const isTableData = table.querySelector(".no-data");
  
    let tableHtml = "<tr>";
  
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        if (key === "") {
          data[key] = (data[key]);
        }
        tableHtml += `<td>${data[key]}</td>`;
      }
    }
  
    tableHtml += `<td><button class="delete-btn" data-id=${data.id}>Delete</td>`;
    tableHtml += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</td>`;
  
    tableHtml += "</tr>";
  
    if (isTableData) {
      table.innerHTML = tableHtml;
    } else {
      const newRow = table.insertRow();
      newRow.innerHTML = tableHtml;
    }
  }
  
  // Loader dataen i selectoren table tbody, som er et HTML tag
  function loadHTMLTable(data) {
    const table = document.querySelector("table tbody");
  
    if (data.length === 0) {
      table.innerHTML = "<tr><td class='no-data' colspan='5'>Empty</td></tr>";
      return;
    }
  
    let tableHtml = "";
  // Går igennem dataen en for en
    data.forEach(function ({ id, navn, beskrivelse, kg, amount, pris, kategori }) {
      tableHtml += "<tr>";
      tableHtml += `<td>${id}</td>`;
      tableHtml += `<td>${navn}</td>`;
      tableHtml += `<td>${beskrivelse}</td>`;
      tableHtml += `<td>${kg}</td>`;
      tableHtml += `<td>${amount}</td>`;
      tableHtml += `<td>${pris}</td>`;
      tableHtml += `<td>${kategori}</td>`;
      tableHtml += `<td><button class="delete-btn" data-id=${id}>Delete</td>`;
      tableHtml += `<td><button class="edit-row-btn" data-id=${id}>Edit</td>`;
      tableHtml += "</tr>";
    });
  
    table.innerHTML = tableHtml;
  }
  