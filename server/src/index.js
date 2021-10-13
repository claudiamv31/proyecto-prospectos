const express = require("express");
const app = express();
const port = 3001;
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const upload = multer({ dest: "uploads" });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "prospectos",
});

connection.connect();

app
  .route("/prospectos")
  .get((req, res) => {
    const coumna = [
      "prospectos.*",
      "prospectos_doc.nombre AS documentos_nombre",
      "prospectos_doc.ruta AS documentos_ruta",
    ].join(",");
    connection.query(
      `SELECT ${coumna} FROM prospectos LEFT JOIN prospectos_doc ON prospectos.id = prospectos_doc.idprospecto`,
      (error, results) => {
        if (error) {
          return res.status(500).send(error);
        }
        res.status(200).json({
          res: Object.values(
            results.reduce((acc, prospecto) => {
              const { documentos_nombre, documentos_ruta, ...restProspecto } =
                prospecto;

              return {
                ...acc,
                [prospecto.id]: {
                  ...restProspecto,
                  documentos: [
                    ...(acc[prospecto.id]?.documentos ?? []), //nullish
                    {
                      nombre: documentos_nombre,
                      ruta: documentos_ruta,
                    },
                  ],
                },
              };
            }, {})
          ),
        });
      }
    );
  })
  .post(upload.array("documentos"), (req, res) => {
    const body = req.body;
    const errors = {};

    if (!body.nombre) {
      errors.nombre = "Nombre invalido";
    }
    if (!body.apellido_pat) {
      errors.apellido_pat = "Apellido invalido";
    }
    if (!body.calle) {
      errors.calle = "Calle invalida";
    }
    if (!body.numero) {
      errors.numero = "Numero invalido";
    }
    if (!body.colonia) {
      errors.colonia = "Colonia invalida";
    }
    if (!body.codigo_p) {
      errors.codigo_p = "CP invalido";
    }
    if (!body.rfc) {
      errors.rfc = "RFC invalido";
    }
    if (!req.files.length) {
      errors.documentos = "No se subio ningun documento";
    }

    if (Object.keys(errors).length) {
      return res.status(400).json(errors);
    }

    const data = {
      nombre: body.nombre,
      apellido_pat: body.apellido_pat,
      apellido_mat: body.apellido_mat,
      calle: body.calle,
      numero: body.numero,
      colonia: body.colonia,
      codigo_p: body.codigo_p,
      telefono: body.telefono,
      rfc: body.rfc,
      estatus: "Enviado",
    };

    connection.query(
      `INSERT INTO prospectos SET ?`,
      data,
      function (error, results) {
        if (error) {
          return res.status(500).send(error);
        }

        const fileErrors = [];
        const inserted = { ...data, id: results.insertId };
        const savedFiles = [];
        req.files.forEach((file) => {
          const destinoUploads = [file.destination, inserted.id].join("/");
          if (!fs.existsSync(destinoUploads)) {
            fs.mkdirSync(destinoUploads, { recursive: true });
          }

          fs.rename(
            [file.destination, file.filename].join("/"),
            [destinoUploads, file.originalname].join("/"),
            (error) => {
              if (error) {
                fileErrors.push([destinoUploads, file.originalname].join("/"));
                return;
              }

              connection.query(
                `INSERT INTO prospectos_doc SET ?`,
                {
                  idprospecto: inserted.id,
                  nombre: file.originalname,
                  ruta: [destinoUploads, file.originalname].join("/"),
                },
                function (error, results) {
                  if (error) {
                    fileErrors.push(file.originalname);
                    return res.status(500).send(error);
                  }
                }
              );

              savedFiles.push({
                idprospecto: inserted.id,
                nombre: file.originalname,
                ruta: [destinoUploads, file.originalname].join("/"),
              });
            }
          );
        });
        if (fileErrors.length) {
          return res
            .status(500)
            .json({ error: "No se pudo guardar los archivos" });
        } else {
        }
      }
    );
  })
  .put(upload.none(), (req, res) => {
    const body = req.body;
    const errors = {};
    if (
      (!body.observaciones && body.estatus == "Rechazado") ||
      (body.observaciones && body.estatus == "Autorizado")
    ) {
      errors.observaciones = "Observaciones no es valido";
    }
    if (!body.id) {
      errors.id = "Id del prospecto no es requerido";
    }
    if (!body.estatus) {
      errors.estatus = "El estatus no es valido";
    }
    if (Object.keys(errors).length) {
      return res.status(400).json(errors);
    }
    try {
      connection.query(
        `UPDATE prospectos SET observaciones = ?, estatus = ? WHERE id = ?`,
        [body.observaciones ?? null, body.estatus, body.id],
        (error) => {
          if (error) throw error;
        }
      );
    } catch (error) {
      return res.estatus(500).json({ error });
    }
    return res.json({ ok: "ok" });
  });

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
