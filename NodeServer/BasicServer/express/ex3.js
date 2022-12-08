const express = require('express');

const app = express();

app.get('/', (req, res, next) =>{
  res.send("Hello World!");
  next();
});

const myLogger = (req, res, next) => {
  console.log("Logged");
  next();
};

app.use(myLogger);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Somethning broke!!');
});

app.listen(3000);