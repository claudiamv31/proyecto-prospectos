import "./style.css";
import "/src/css/nav.css";
import { axios } from "./shared/axios";

const formulario = document.getElementById("formulario");
const cancelar = document.getElementById("cancelar");

formulario.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = event.target;
  const data = new FormData(form);

  axios.post("/prospectos", data).then((data) => {
    console.log(data);
  });
  window.location.href = "/src/views/listado.html";
});

cancelar.addEventListener("click", () => {
  alert("Si sale perdera toda la informaci\u00F3n");
  formulario.reset();
});
