// Selección de elementos del DOM
const inputBuscar = document.getElementById("inputBuscar");
const btnBuscar = document.getElementById("btnBuscar");
const contenedor = document.getElementById("contenedor");

// Evento al hacer clic en el botón buscar
btnBuscar.addEventListener("click", async () => {
  const query = inputBuscar.value.trim(); // Capturamos el texto ingresado
  if (!query) {
    alert("Por favor, ingresa un término para buscar.");
    return;
  }

  // Limpiamos el contenedor antes de buscar
  contenedor.innerHTML = "";

  try {
    // Realizamos la solicitud a la API
    const response = await fetch(`https://images-api.nasa.gov/search?q=${query}`);
    if (!response.ok) throw new Error("Error al realizar la solicitud a la API");

    const data = await response.json();
    const items = data.collection.items; // Lista de resultados

    // Validamos si hay resultados
    if (items.length === 0) {
      contenedor.innerHTML = `<p class="text-center text-muted">No se encontraron resultados para "${query}".</p>`;
      return;
    }

    // Renderizamos las imágenes y la información en formato cuadriculado
    renderizarResultados(items);
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    contenedor.innerHTML = `<p class="text-center text-danger">Ocurrió un error al buscar. Por favor, intenta nuevamente.</p>`;
  }
});

// Función para renderizar los resultados en un formato cuadriculado
function renderizarResultados(items) {
  contenedor.innerHTML = ""; // Limpiar resultados anteriores

  const row = document.createElement("div"); // Crear una fila
  row.className = "row row-cols-1 row-cols-md-3 g-4"; // Clases de Bootstrap para cuadricula

  items.forEach(item => {
    // Verificamos que tenga datos válidos
    const title = item.data[0]?.title || "Sin título";
    const description = item.data[0]?.description || "Sin descripción";
    const date = item.data[0]?.date_created || "Fecha desconocida";
    const imageUrl = item.links?.[0]?.href || "";

    // Crear la columna con la tarjeta
    const col = document.createElement("div");
    col.className = "col";

    col.innerHTML = `
      <div class="card h-100">
        <img src="${imageUrl}" class="card-img-top" alt="${title}" style="height: 200px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">${description}</p>
        </div>
        <div class="card-footer">
          <small class="text-muted">${new Date(date).toLocaleDateString()}</small>
        </div>
      </div>
    `;

    row.appendChild(col); // Añadir la columna a la fila
  });

  contenedor.appendChild(row); // Añadir la fila al contenedor principal
}
