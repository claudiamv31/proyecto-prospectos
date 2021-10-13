import "/src/css/evaluacion.css";
import "/src/css/nav.css";
import { axios } from "../shared/axios";
import { createComponent } from "../shared/createComponent";

const listaProspecto = document.getElementById("tabla");
const tbody = listaProspecto.getElementsByTagName("tbody")[0];
const nav = document.getElementById("nav");
const titulo = document.getElementById("titulo");

const divProspectoContenedor = document.getElementById("contenedor");

axios.get("prospectos").then((data) => {
  data.data.res.forEach((prospecto) => {
    const tr = createComponent("tr", null, [
      createComponent("td", null, prospecto.nombre),
      createComponent("td", null, prospecto.apellido_pat),
      createComponent("td", null, prospecto.apellido_mat),
      createComponent("td", null, prospecto.estatus),
    ]);
    tr.addEventListener("click", () => {
      crearProspectoDetalle(prospecto);
      listaProspecto.style.display = "none";
      divProspectoContenedor.style.display = "block";
      nav.style.display = "none";
      titulo.style.display = "none";
    });
    tbody.appendChild(tr);
  });
});

const btnRegresar = document.getElementById("bth-regresar");

btnRegresar.addEventListener("click", () => {
  listaProspecto.style.display = "table";
  divProspectoContenedor.style.display = "none";
  divProspectoDetalle.innerHTML = "";
  nav.style.display = "block";
  titulo.style.display = "block";
});

const divProspectoDetalle = document.getElementById("prospecto-detalle");

const crearProspectoDetalle = (prospecto) => {
  const detalle = createComponent("div", { ["data-id"]: prospecto.id }, [
    createComponent("div", null, "Nombre: " + prospecto.nombre),
    createComponent("div", null, "Primer Apellido: " + prospecto.apellido_pat),
    createComponent("div", null, "Segundo Apellido: " + prospecto.apellido_mat),
    createComponent("div", null, "Calle: " + prospecto.calle),
    createComponent("div", null, "N\u00FAmero: " + prospecto.numero),
    createComponent("div", null, "Colonia: " + prospecto.colonia),
    createComponent("div", null, "CP: " + prospecto.codigo_p),
    createComponent("div", null, "Tel\u00E9fono: " + prospecto.telefono),
    createComponent("div", null, "RFC: " + prospecto.rfc),
    createComponent("div", null, "Estatus: " + prospecto.estatus),
    createComponent("div", null, "Documento(s): "),

    ...prospecto.documentos.map((documento) => {
      return createComponent("div", null, documento.nombre);
    }),
  ]);

  divProspectoDetalle.appendChild(detalle);
};

const btnRechazo = document.getElementById("btn-rechazar");
const observaciones = document.getElementById("observaciones");

btnRechazo.addEventListener("click", () => {
  divProspectoContenedor.style.display = "none";
  observaciones.style.display = "block";
});

observaciones.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = divProspectoDetalle.querySelector("[data-id]"); //Busca el elemento como funciona en css
  console.log(id);
  const form = event.target;
  const data = new FormData(form);
  data.append("id", id.getAttribute("data-id"));
  data.append("estatus", "Rechazado");

  axios
    .put("prospectos", data)
    .then((data) => {
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
});

const btnAutorizar = document.getElementById("btn-autorizar");
btnAutorizar.addEventListener("click", () => {
  const id = divProspectoDetalle.querySelector("[data-id]");

  axios
    .put("prospectos", {
      id: id.getAttribute("data-id"),
      estatus: "Aceptado",
    })
    .then((data) => {
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
});

observaciones.querySelector("[type=button]").addEventListener("click", () => {
  divProspectoContenedor.style.display = "block";
  observaciones.style.display = "none";
});
