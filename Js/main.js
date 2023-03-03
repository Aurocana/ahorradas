function $(element) {
  return document.querySelector(element);
}

if (localStorage.getItem("transacciones") === null) {
  localStorage.setItem("transacciones", JSON.stringify([]));
}

if (localStorage.getItem("categorias") === null) {
  localStorage.setItem("categorias", JSON.stringify([]));
}

const $imagenTransacciones = $("#imagenTransacciones");
const $seccionBalance = $("#seccionBalance");
const $operaciones = $("#nuevaTransaccion");
const $categorias = $("#categorias");
const $contanerEditarCateg = "#contanerEditarCateg";
const $reportes = $("#reportes");
const $ocultarFiltros = $("#ocultarFiltros");
const $mostrarFiltros = $("#mostrarFiltros");
const $listaFiltros = $("#listaFiltros");
const $agregarTransaccion = $("#agregarTransaccion");
const $contenedorForm = $("contenedorForm");
let $listaTransacciones = $("#listaTransacciones");
const $tablaResumen = $("#tablaResumen");
const $editarCategorias = $("#editarCategorias");

$("#titulo").addEventListener("click", () => {
  $seccionBalance.classList.remove("hidden");
  $operaciones.classList.add("hidden");
  $categorias.classList.add("hidden");
  $reportes.classList.add("hidden");
});

$("#agregarOperacion").addEventListener("click", () => {
  $("#idProducto").innerHTML = "";
  var fechaHoy = new Date().toISOString().slice(0, 10);
  actualizarListaCategorias("#categoria-opera");
  $("#fecha-opera").value = fechaHoy;
  $seccionBalance.classList.add("hidden");
  $categorias.classList.add("hidden");
  $reportes.classList.add("hidden");
  $operaciones.classList.remove("hidden");
  $("#monto-opera").value = "";
  $("#descripción-opera").value = "";
});

$("#irBalance").addEventListener("click", () => {
  $seccionBalance.classList.remove("hidden");
  $operaciones.classList.add("hidden");
  $categorias.classList.add("hidden");
  $reportes.classList.add("hidden");
});

$("#irCategoria").addEventListener("click", () => {
  mostrarCategorias();
  $categorias.classList.remove("hidden");
  $seccionBalance.classList.add("hidden");
  $operaciones.classList.add("hidden");
  $reportes.classList.add("hidden");
  $("#editarCategorias").classList.add("hidden");
});

function irEditarCategoria(id) {
  $categorias.classList.add("hidden");
  $seccionBalance.classList.add("hidden");
  $operaciones.classList.add("hidden");
  $reportes.classList.add("hidden");
  $("#editarCategorias").classList.remove("hidden");
  $("#nomCatEditAntiguo").value = id;
  $("#nomCatEdit").value = "";
}

$("#irBalance").addEventListener("click", () => {
  $categorias.classList.add("hidden");
  $operaciones.classList.add("hidden");
  $reportes.classList.add("hidden");
  $seccionBalance.classList.remove("hidden");
  balanceGanancias();
  balanceGastos();
  balanceTotal();
});

$("#irReporte").addEventListener("click", () => {
  $reportes.classList.remove("hidden");
  $seccionBalance.classList.add("hidden");
  $operaciones.classList.add("hidden");
  $categorias.classList.add("hidden");
  actualizarReportes();
});

$("#regresarBalance").addEventListener("click", () => {
  $seccionBalance.classList.remove("hidden");
  $operaciones.classList.add("hidden");
  $categorias.classList.add("hidden");
  $reportes.classList.add("hidden");
});

// Acciones Filtros

function actualizarListaCategorias(idElemento) {
  $(idElemento).innerHTML = "";
  $(idElemento).innerHTML += `<option value="Todas">Todas</option>`;
  for (let i = 0; i < categorias.length; i++) {
    $(
      idElemento
    ).innerHTML += `<option value="${categorias[i]}">${categorias[i]}</option>`;
  }
}
// ===================Filtros ===========================
$mostrarFiltros.addEventListener("click", () => {
  actualizarListaCategorias("#filtroCategorias");
  $mostrarFiltros.classList.add("hidden");
  $ocultarFiltros.classList.remove("hidden");
  $listaFiltros.classList.remove("hidden");
});

$ocultarFiltros.addEventListener("click", () => {
  resetearFiltros();
  mostrarTransacciones(transacciones);
  $ocultarFiltros.classList.add("hidden");
  $mostrarFiltros.classList.remove("hidden");
  $listaFiltros.classList.add("hidden");
});
// =========================Reportes =================================
function actualizarReportes() {
  catMayorGanancia();
  catMayorGasto();
  catMayorBalance();
  mesMayorGanancia();
  mesMayorGasto();
  actualizarListaCategoriasReportes();
  actualizarListaMesesReportes();
}

function actualizarListaMesesReportes() {
  $("#tablaReportesMeses").innerHTML = "";
  $("#tablaReportesMeses").innerHTML += `<tr>
    <th>Meses</th>
    <th>Ganacias</th>
    <th>Gastos</th>
    <th>Balance</th>
  </tr>`;

  let arrFechas = [];

  transacciones.forEach((transaccion) => {
    if (!arrFechas.includes(transaccion.fecha)) {
      arrFechas.push(transaccion.fecha);
    }
  });

  arrFechas.forEach((fecha) => {
    let mes = fecha.slice(5, 7);
    let anio = fecha.slice(0, 4);
    let ganacias = caluladoraBalanceFecha(anio, mes, "Ganancia");
    let gastos = caluladoraBalanceFecha(anio, mes, "Gasto");
    $("#tablaReportesMeses").innerHTML += `<tr>
    <td>${anio}-${mes}</td>
    <td class="text-success">${ganacias}</td>
    <td class="text-danger">${gastos}</td>
    <td class="text-primary">${ganacias - gastos}</td>
  </tr>`;
  });

  actualizarTabla("#tablaResumen", 1, 4, fecha);
  actualizarTabla("#tablaResumen", 2, 4, `$${balance}`);
}

function actualizarListaCategoriasReportes() {
  $("#tablaReportesCategoria").innerHTML = "";
  $("#tablaReportesCategoria").innerHTML += `<tr>
    <th>Categorias</th>
    <th>Ganacias</th>
    <th>Gastos</th>
    <th>Balance</th>
  </tr>`;
  for (let i = 0; i < categorias.length; i++) {
    $("#tablaReportesCategoria").innerHTML += `<tr>
      <td>${categorias[i]}</td>
      <td class="text-success">$${calculosCategorias(
        categorias[i],
        "Ganancia"
      )}</td>
      <td class="text-danger">$${calculosCategorias(
        categorias[i],
        "Gasto"
      )}</td>
      <td class="text-primary">$${balanceCategoria(categorias[i])}</td>
    </tr>`;
  }
}

function balanceCategoria(catACalcular) {
  let balance = 0;
  let catFiltradas = transacciones.filter((transaccion) => {
    return transaccion.categoria == catACalcular;
  });
  catFiltradas.forEach((transaccion) => {
    if (transaccion.tipo == "Ganancia") {
      balance += transaccion.monto;
    } else {
      balance -= transaccion.monto;
    }
  });
  return balance;
}

function calculosCategorias(catACalcular, tipo) {
  let balance = 0;
  transacciones.forEach((transaccion) => {
    if (transaccion.categoria == catACalcular && transaccion.tipo == tipo) {
      balance += transaccion.monto;
    }
  });
  return balance;
}

function mostrarImagenTransaccion() {
  if (transacciones.length == 0) {
    $imagenTransacciones.classList.remove("hidden");
    $("#encabezadoTransacciones").classList.add("hidden");
    return;
  }
  $imagenTransacciones.classList.add("hidden");
  $("#encabezadoTransacciones").classList.remove("hidden");
}
//===============Calculo de Balance=====================================
function balanceGanancias() {
  let balance = 0;
  transacciones.forEach((transaccion) => {
    if (transaccion.tipo == "Ganancia") {
      balance += transaccion.monto;
    }
  });
  $("#balanceGanancias").innerHTML = `$${balance}`;
}

function balanceGastos() {
  let balance = 0;
  transacciones.forEach((transaccion) => {
    if (transaccion.tipo == "Gasto") {
      balance += transaccion.monto;
    }
  });
  $("#balanceGastos").innerHTML = `$${balance}`;
}

function balanceTotal() {
  let balance = 0;
  transacciones.forEach((transaccion) => {
    if (transaccion.tipo == "Ganancia") {
      balance += transaccion.monto;
    } else {
      balance -= transaccion.monto;
    }
  });
  $("#balanceTotal").innerHTML = `$${balance}`;
}
// ===========================Reportes=====================================
function mesMayorGanancia() {
  let transaccionesGanancia = transacciones.filter((transaccion) => {
    return transaccion.tipo == "Ganancia";
  });
  let mayorAnio = transaccionesGanancia[0].fecha.slice(0, 4);
  let mayorMes = transaccionesGanancia[0].fecha.slice(5, 7);
  let fecha = transaccionesGanancia[0].fecha;
  let balance = caluladoraBalanceFecha(mayorAnio, mayorMes, "Ganancia");
  transaccionesGanancia.forEach((transaccion) => {
    let mes = transaccion.fecha.slice(5, 7);
    let anio = transaccion.fecha.slice(0, 4);
    let temp = caluladoraBalanceFecha(anio, mes, "Ganancia");
    if (temp > balance) {
      balance = temp;
      mayorAnio = anio;
      mayorMes = mes;
      fecha = transaccion.fecha;
    }
  });

  actualizarTabla("#tablaResumen", 1, 4, fecha);
  actualizarTabla("#tablaResumen", 2, 4, `$${balance}`);
}

function mesMayorGasto() {
  let transaccionesGasto = transacciones.filter((transaccion) => {
    return transaccion.tipo == "Gasto";
  });
  let mayorAnio = transaccionesGasto[0].fecha.slice(0, 4);
  let mayorMes = transaccionesGasto[0].fecha.slice(5, 7);
  let fecha = transaccionesGasto[0].fecha;
  let balance = caluladoraBalanceFecha(mayorAnio, mayorMes, "Gasto");
  transaccionesGasto.forEach((transaccion) => {
    let mes = transaccion.fecha.slice(5, 7);
    let anio = transaccion.fecha.slice(0, 4);
    let temp = caluladoraBalanceFecha(anio, mes, "Gasto");
    if (temp > balance) {
      balance = temp;
      mayorAnio = anio;
      mayorMes = mes;
      fecha = transaccion.fecha;
    }
  });

  actualizarTabla("#tablaResumen", 1, 5, fecha);
  actualizarTabla("#tablaResumen", 2, 5, `$${balance}`);
}

function caluladoraBalanceFecha(anio, mes, tipo) {
  let balance = 0;
  let transaccionesGanancia = transacciones.filter((transaccion) => {
    return transaccion.tipo == tipo;
  });
  transaccionesGanancia.forEach((transaccion) => {
    let mesTransaccion = transaccion.fecha.slice(5, 7);
    let anioTransaccion = transaccion.fecha.slice(0, 4);
    if (anioTransaccion == anio && mesTransaccion == mes) {
      balance += transaccion.monto;
    }
  });
  return balance;
}

function actualizarTabla(idTabla, columna, fila, valor) {
  let tabla = $(idTabla);
  tabla.rows[fila].cells[columna].innerHTML = valor;
}

function catMayorGanancia() {
  let mayorGanancia = 0;
  let categoriaMayorGanancia = "";
  transacciones.forEach((transaccion) => {
    let balance = calculadoraBalance(transaccion.categoria);
    if (balance > mayorGanancia) {
      mayorGanancia = balance;
      categoriaMayorGanancia = transaccion.categoria;
    }
  });
  actualizarTabla("#tablaResumen", 1, 1, categoriaMayorGanancia);
  actualizarTabla("#tablaResumen", 2, 1, `$${mayorGanancia}`);
}

function catMayorGasto() {
  let mayorGasto = 0;
  let categoriaMayorGasto = "";
  transacciones.forEach((transaccion) => {
    let balance = calculadoraBalance(transaccion.categoria);
    if (balance < mayorGasto) {
      mayorGasto = balance;
      categoriaMayorGasto = transaccion.categoria;
    }
  });
  actualizarTabla("#tablaResumen", 1, 2, categoriaMayorGasto);
  actualizarTabla("#tablaResumen", 2, 2, `$${mayorGasto}`);
}

function catMayorBalance() {
  let mayorGanancia = 0;
  let categoriaMayorGanancia = "";
  transacciones.forEach((transaccion) => {
    let balance = calculadoraBalance(transaccion.categoria);
    if (balance > mayorGanancia) {
      mayorGanancia = balance;
      categoriaMayorGanancia = transaccion.categoria;
    }
  });
  actualizarTabla("#tablaResumen", 1, 3, categoriaMayorGanancia);
  actualizarTabla("#tablaResumen", 2, 3, `$${mayorGanancia}`);
}

function calculadoraBalance(nomCategoria) {
  let balance = transacciones.filter((transaccion) => {
    return transaccion.categoria == nomCategoria;
  });
  let total = 0;
  balance.forEach((transaccion) => {
    if (transaccion.tipo == "Ganancia") {
      total += transaccion.monto;
    } else {
      total -= transaccion.monto;
    }
  });
  return total;
}

// Acciones Categorias

$("#btnCancelarEditarCat").addEventListener("click", () => {
  mostrarCategorias();
  $categorias.classList.remove("hidden");
  $seccionBalance.classList.add("hidden");
  $operaciones.classList.add("hidden");
  $reportes.classList.add("hidden");
  $("#editarCategorias").classList.add("hidden");
});

function mostrarCategorias() {
  let html = "";
  categorias.forEach((categoria) => {
    html += `
    <div class="categoria">
      <div class="categoria__nombre">
        <p>${categoria}</p>
      </div>
      <div class="categoria__acciones">
        <i class="text-bg-info fa-solid fa-pen btn" onclick="irEditarCategoria(this.id)" id="${categoria}"></i>
        <i class="text-bg-danger fa-solid fa-trash btn" onclick="eliminarCategoria(this.id)" id="${categoria}"></i>
      </div>
    </div>
    `;
  });
  $("#listaCategorias").innerHTML = html;
}

$("#btnGuardarEdit").addEventListener("click", () => {
  categorias = JSON.parse(localStorage.getItem("categorias"));
  let catAntiguo = $("#nomCatEditAntiguo").value;
  let id = $("#nomCatEdit").value;
  categorias = categorias.filter((categoria) => categoria != catAntiguo);
  categorias.push(id);
  mostrarCategorias();
  $categorias.classList.remove("hidden");
  $seccionBalance.classList.add("hidden");
  $operaciones.classList.add("hidden");
  $reportes.classList.add("hidden");
  $("#editarCategorias").classList.add("hidden");
  localStorage.setItem("categorias", JSON.stringify(categorias));
});

$("#btnAgregarCategoria").addEventListener("click", () => {
  categorias = JSON.parse(localStorage.getItem("categorias"));
  let categoria = $("#tituloCategoria").value;
  categorias.push(categoria);
  mostrarCategorias();
  $("#tituloCategoria").value = "";
  localStorage.setItem("categorias", JSON.stringify(categorias));
});

function eliminarCategoria(id) {
  categorias = categorias.filter((categoria) => categoria !== id);
  mostrarCategorias();
  localStorage.setItem("categorias", JSON.stringify(categorias));
}

// Lista operaciones

function mostrarTransacciones(listraTransacciones) {
  let html = "";
  listraTransacciones.forEach((transaccion) => {
    html += `
    <div class="operacion">
    <div class="operacion__descripcion">
      <p>${transaccion.descripcion}</p>
    </div>
    <div class="operacion__monto">
      <p>$${transaccion.monto}</p>
    </div>
    <div class="operacion__tipo">
      <p>${transaccion.tipo}</p>
    </div>
    <div class="operacion__categoria">
      <p>${transaccion.categoria}</p>
    </div>
    <div class="operacion__fecha">
      <p>${transaccion.fecha}</p>
    </div>
    <div class="operacion__acciones">
      <i class="text-bg-info fa-solid fa-pen btn" onclick="editar(this.id)" id="${transaccion.id}"></i>
      <i class="text-bg-danger fa-solid fa-trash btn" onclick="eliminar(this.id)" id="${transaccion.id}"></i>
    </div>
  </div>
    `;
  });
  $listaTransacciones.innerHTML = html;
}
// ============================Editar Operaciones ==============================
function editar(id) {
  $seccionBalance.classList.add("hidden");
  $categorias.classList.add("hidden");
  $reportes.classList.add("hidden");
  $operaciones.classList.remove("hidden");
  let transaccionAEditar = transacciones.find((transaccion) => {
    return transaccion.id == id;
  });
  $("#monto-opera").value = transaccionAEditar.monto;
  $("#descripción-opera").value = transaccionAEditar.descripcion;
  $("#tipo-opera").value = transaccionAEditar.tipo;
  $("#fecha-opera").value = transaccionAEditar.fecha;
  $("#idProducto").innerHTML = transaccionAEditar.id;
  actualizarBalances();
}

function actualizarBalances() {
  balanceGanancias();
  balanceGastos();
  balanceTotal();
}

function eliminar(id) {
  transacciones = transacciones.filter((transaccion) => {
    return transaccion.id !== id;
  });
  mostrarTransacciones(transacciones);
  actualizarBalances();
  if (transacciones.length == 0) {
    mostrarImagenTransaccion();
  }
  localStorage.setItem("transacciones", JSON.stringify(transacciones));
}

window.addEventListener("load", () => {
  transacciones = JSON.parse(localStorage.getItem("transacciones"));
  categorias = JSON.parse(localStorage.getItem("categorias"));
  resetearFiltros();
  mostrarTransacciones(transacciones);
  mostrarImagenTransaccion();
  actualizarBalances();
});

// Transacciones

function resetearFiltros() {
  $("#select-tipo").value = "Todas";
  $("#fechaFiltro").value = "";
  $("#ordenarPor").value = "Todas";
  $("#filtroCategorias").value = "Todas";
}

$agregarTransaccion.addEventListener("click", () => {
  transacciones = JSON.parse(localStorage.getItem("transacciones"));
  if ($("#monto-opera").value == "" || isNaN($("#monto-opera").value)) {
    alert("Ingrese un monto correcto");
    return;
  }
  if ($("#descripción-opera").value == "") {
    alert("Debe ingresar una descripción");
    return;
  }
  if ($("#idProducto").innerHTML == "") {
    let nuevaTransaccion = {};
    nuevaTransaccion.id = crypto.randomUUID();
    nuevaTransaccion.descripcion = $("#descripción-opera").value;
    nuevaTransaccion.monto = parseInt($("#monto-opera").value);
    nuevaTransaccion.tipo = $("#tipo-opera").value;
    nuevaTransaccion.categoria = $("#categoria-opera").value;
    nuevaTransaccion.fecha = $("#fecha-opera").value;
    transacciones.unshift(nuevaTransaccion);
  } else {
    transacciones = transacciones.filter((transaccion) => {
      return transaccion.id != $("#idProducto").innerHTML;
    });
    let nuevaTransaccion = {};
    nuevaTransaccion.id = $("#idProducto").innerHTML;
    nuevaTransaccion.descripcion = $("#descripción-opera").value;
    nuevaTransaccion.monto = parseInt($("#monto-opera").value);
    nuevaTransaccion.tipo = $("#tipo-opera").value;
    nuevaTransaccion.categoria = $("#categoria-opera").value;
    nuevaTransaccion.fecha = $("#fecha-opera").value;
    transacciones.unshift(nuevaTransaccion);
  }
  //=========================Resetear ===================================
  $categorias.classList.add("hidden");
  $operaciones.classList.add("hidden");
  $reportes.classList.add("hidden");
  mostrarImagenTransaccion();
  $seccionBalance.classList.remove("hidden");
  resetearFiltros();
  mostrarTransacciones(transacciones);
  actualizarBalances();
  localStorage.setItem("transacciones", JSON.stringify(transacciones));
});

$("#select-tipo").addEventListener("change", () => {
  let tipo = $("#select-tipo").value;
  if (tipo == "Todas") {
    mostrarTransacciones(transacciones);
    return;
  }
  let transaccionesFiltradas = transacciones.filter((transaccion) => {
    return transaccion.tipo == tipo;
  });
  mostrarTransacciones(transaccionesFiltradas);
});

$("#fechaFiltro").addEventListener("change", () => {
  let fechaDesde = $("#fechaFiltro").value; //2021-08-30
  let transaccionesFiltradas = transacciones.filter((transaccion) => {
    return transaccion.fecha >= fechaDesde;
  });
  mostrarTransacciones(transaccionesFiltradas);
});

$("#filtroCategorias").addEventListener("change", () => {
  if ($("#filtroCategorias").value == "Todas") {
    mostrarTransacciones(transacciones);
    return;
  }
  let transaccionesFiltradas = transacciones.filter((transaccion) => {
    return transaccion.categoria == $("#filtroCategorias").value;
  });
  mostrarTransacciones(transaccionesFiltradas);
});

function ordenarPorMasReciente() {
  let transaccionesOrdenadas = transacciones.sort((a, b) => {
    return new Date(b.fecha) - new Date(a.fecha);
  });
  mostrarTransacciones(transaccionesOrdenadas);
}

function ordenarPorMasAntigua() {
  let transaccionesOrdenadas = transacciones.sort((a, b) => {
    return new Date(a.fecha) - new Date(b.fecha);
  });
  mostrarTransacciones(transaccionesOrdenadas);
}

function ordenarPorMayorMonto() {
  let transaccionesOrdenadas = transacciones.sort((a, b) => {
    return b.monto - a.monto;
  });
  mostrarTransacciones(transaccionesOrdenadas);
}

function ordenarPorMenorMonto() {
  let transaccionesOrdenadas = transacciones.sort((a, b) => {
    return a.monto - b.monto;
  });
  mostrarTransacciones(transaccionesOrdenadas);
}

function ordenarAZ() {
  let transaccionesOrdenadas = transacciones.sort((a, b) => {
    if (a.descripcion < b.descripcion) {
      return -1;
    }
    if (a.descripcion > b.descripcion) {
      return 1;
    }
    return 0;
  });
  mostrarTransacciones(transaccionesOrdenadas);
}

function ordenarZA() {
  let transaccionesOrdenadas = transacciones.sort((a, b) => {
    if (a.descripcion > b.descripcion) {
      return -1;
    }
    if (a.descripcion < b.descripcion) {
      return 1;
    }
    return 0;
  });
  mostrarTransacciones(transaccionesOrdenadas);
}

$("#ordenarPor").addEventListener("change", () => {
  let orden = $("#ordenarPor").value;
  switch (orden) {
    case "Todas":
      mostrarTransacciones(transacciones);
      break;
    case "Más reciente":
      ordenarPorMasReciente();
      break;
    case "Más antigua":
      ordenarPorMasAntigua();
      break;
    case "Mayor monto":
      ordenarPorMayorMonto();
      break;
    case "Menor monto":
      ordenarPorMenorMonto();
      break;
    case "A/Z":
      ordenarAZ();
      break;
    case "Z/A":
      ordenarZA();
      break;
  }
});
// ===============================LocalStorage=========================
//transacciones= localStorage.addEventListener("load",() => {
// transacciones = JSON.parse(localStorage.getItem("transicciones"));
// const $form = document.querySelector("#contenedorForm");

//  function estaMostrar(()=>{
//    const
//  });
