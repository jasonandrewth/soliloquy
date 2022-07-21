const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();
const { PrismaClient, Prisma } = require('@prisma/client')

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const prisma = new PrismaClient()

const path = require("path");

//Use a Custom Templating Engine
// app.set("view engine", "pug");

app.set("views", path.resolve("./src/views"));

function get_random(arr) {
  return arr[Math.floor((Math.random() * arr.length))];
}

const fetchData = async () => {
  try {

    const size = await prisma.$queryRaw(Prisma.sql`SELECT pg_size_pretty (
      pg_database_size ('postgres')
  );`)

    const catalogName = await prisma.$queryRaw(Prisma.sql`
    SELECT * FROM information_schema.information_schema_catalog_name; `)

    const userName = await prisma.$queryRaw(Prisma.sql`SELECT current_user;`)

    const sqlFeatures = await prisma.$queryRaw(Prisma.sql`SELECT * FROM information_schema.sql_features; `)

    const sqlSizing = await prisma.$queryRaw(Prisma.sql`SELECT * FROM information_schema.sql_sizing;`)

    const columns = await prisma.$queryRaw(Prisma.sql`SELECT * FROM information_schema.columns;`)
    console.log("columns:", columns)

    const log = await prisma.log.create({
      data: {
        "size": size[0].pg_size_pretty,
        "applicapleRoles": JSON.stringify(sqlFeatures),
        "dbName": catalogName[0].catalog_name,
        "user": userName[0].current_user,
        "sqlSizing": JSON.stringify(sqlSizing)
      }
    })

    // const log2 = await prisma.log.findUnique({
    //   where: {
    //     id: log.id
    //   }
    // })
    return { feats: sqlFeatures, size: size, sizing: sqlSizing }
  } catch (error) {
    console.log(error)
  }

}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

// Expose the node_modules folder as static resources (to access socket.io.js in the browser)
app.use('/static', express.static('node_modules'));
app.use(express.static(__dirname + '/public'));

//***************this snippet gets the local ip of the node.js server. copy this ip to the client side code and add ':3000' *****
//****************exmpl. 192.168.56.1---> var sock =new WebSocket("ws://192.168.56.1:3000");*************************************
require('dns').lookup(require('os').hostname(), function (err, add, fam) {
  console.log('addr: ' + add);
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/views/index.html');
});

app.use('/api', require('./src/routes/api.route'));

// Handle connection
io.on('connection', (socket) => {
  console.log('client connected');

  let prevSize

  const shownData = ["feats", "sizing"]
  const chosenData = get_random(shownData)

  // Send data on the socket
  const socketInterval = setInterval(async () => {
    let data = await fetchData()

    //Only emit if size changed
    if (prevSize !== data.size[0].pg_size_pretty) {
      socket.emit('dbSize', { size: data.size[0].pg_size_pretty });
    }

    if (chosenData === "feats") {
      data.feats.slice(0, 100).forEach(chunk => {
        socket.emit('datathing', { data: chunk });
      })
    } else {
      data.sizing.slice(0, 100).forEach(chunk => {
        socket.emit('datathing', { data: chunk });
      })
    }
    // console.log(data)
    prevSize = data.size[0].pg_size_pretty
  }, 10000);

  // socket.on('my other event', function (data) {
  //   console.log(data);
  // });

  socket.on('disconnect', function () {
    console.log("disconnected")
    clearInterval(socketInterval);
  });
})

app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
