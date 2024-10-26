const express = require("express");
const app = express();
const session = require("express-session");
const fs = require("fs");
const cors = require("cors");
const jsonwebtoken = require("jsonwebtoken");

app.use(
  session({
    secret: "secret code",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const server = app.listen(3000, () => {
  console.log("Server started. port 3000.");
});

let sql = require("./sql.js");
const { request } = require("http");
fs.watchFile(__dirname + "/sql.js", (curr, prev) => {
  console.log("sql 변경 시 재시작 없이 반영되도록 함. ");
  delete require.cache[require.resolve("./sql.js")];
  sql = require("./sql.js");
});

const db = {
  database: "dev_class",
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "sk1127..",
};

const dbPool = require("mysql2").createPool(db);

app.post("/api/signup", async (request, res) => {
  try {
    await req.db("signUp", request.body.param);
    if (request.body.param.length > 0) {
      for (let key in request.body.param[0])
        request.session[key] = request.body.param[0][key];
      res.send(request.body.param[0]);
    } else {
      res.send({
        error: "Please try again or contact system manager. ",
      });
    }
  } catch (err) {
    res.send({
      error: "DB access error",
    });
  }
});

app.post("/api/login", async (request, res) => {
  try {
    const result = await req.db(
      "logIn",
      request.body.param,
      request.body.where
    );
    if (request.body.param.length > 0) {
      const token = jsonwebtoken.sign(request.body.where, "leekim1927");
      for (let key in request.body.param[0])
        request.session[key] = request.body.param[0][key];
      request.session[0] = token;
      console.log(result);
      res.send(result);
    }
  } catch (err) {
    res.send({
      error: "DB access error",
    });
  }
});

app.post("/api/logout", async (request, res) => {
  request.session.destroy();
  res.send("ok");
});

app.post("/upload/:productID/:type/:fileName", async (request, res) => {
  let { productID, type, fileName } = request.params;
  const dir = `${__dirname}/uploads/${productID}`;
  const file = `${dir}/${fileName}`;
  if (!request.body.data)
    return fs.unlink(file, async (err) =>
      res.send({
        err,
      })
    );
  const data = request.body.data.slice(
    request.body.data.indexOf(";base64,") + 8
  );
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  fs.writeFile(file, data, "base64", async (error) => {
    await req.db("productImageInsert", [
      {
        product_id: productID,
        type: type,
        path: fileName,
      },
    ]);
    if (error) {
      res.send({
        error,
      });
    } else {
      res.send("ok");
    }
  });
});

app.get("/download/:productId/:fileName", (request, res) => {
  const { productId, type, fileName } = request.params;
  const filepath = `${__dirname}/uploads/${productId}/${fileName}`;
  res.header(
    "Content-Type",
    `image/${fileName.substring(fileName.lastIndexOf("."))}`
  );
  if (!fs.existsSync(filepath))
    res.status(404).send({
      error: "Can not found file. ",
    });
  else fs.createReadStream(filepath).pipe(res);
});

app.post("/apirole/:alias", async (request, res) => {
  if (!request.session.email) {
    return res.status(401).send({
      error: "You need to login. ",
    });
  }

  try {
    res.send(await res.db(request.params.alias));
  } catch (err) {
    res.status(500).send({
      error: err,
    });
  }
});

app.post("/api/:alias", async (request, res) => {
  try {
    res.send(
      await req.db(request.params.alias, request.body.param, request.body.where)
    );
  } catch (err) {
    res.status(500).send({
      error: err,
    });
  }
});

const req = {
  async db(alias, param = [], where = "") {
    return new Promise((resolve, reject) =>
      dbPool.query(sql[alias].query + where, param, (error, rows) => {
        if (error) {
          if (error.code != "ER_DUP_ENTRY") console.log(error);
          reject({});
        } else {
          const token = jsonwebtoken.sign(where, "leekim1927");
          if (rows[0]) {
            rows[0] = { token: token };
          }
          resolve(rows);
          console.log(rows);
        }
      })
    );
  },
};
