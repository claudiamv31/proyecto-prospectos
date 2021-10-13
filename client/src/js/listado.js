import "/src/css/listado.css";
import "/src/css/nav.css";
import { axios } from "../shared/axios";
import { createComponent } from "../shared/createComponent";

const listaProspecto = document.getElementById("tabla");
const tbody = listaProspecto.getElementsByTagName("tbody")[0];

const divProspectoContenedor = document.getElementById("contenedor");
const nav = document.getElementById("nav");
const titulo = document.getElementById("titulo");

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
  const detalle = createComponent("div", null, [
    createComponent("div", null, "Nombre: " + prospecto.nombre),
    createComponent("div", null, "Primer apellido: " + prospecto.apellido_pat),
    createComponent("div", null, "Segundo apellido: " + prospecto.apellido_mat),
    createComponent("div", null, "Calle: " + prospecto.calle),
    createComponent("div", null, "Nu\u00FAmero: " + prospecto.numero),
    createComponent("div", null, "Colonia: " + prospecto.colonia),
    createComponent("div", null, "CP: " + prospecto.codigo_p),
    createComponent("div", null, "Tel\u00E9fono: " + prospecto.telefono),
    createComponent("div", null, "RFC: " + prospecto.rfc),
    createComponent("div", null, "Estatus:" + prospecto.estatus),
    createComponent("div", null, "Documento(s):"),

    ...prospecto.documentos.map((documento) => {
      return createComponent("div", null, documento.nombre);
    }),
  ]);

  divProspectoDetalle.appendChild(detalle);
};
