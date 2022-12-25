const mongoose = require("mongoose");

/* Connecting */
mongoose
  .connect("mongodb://127.0.0.1:27017/roadbook", {
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });



/* 
const customerSchema = mongoose.Schema({
  name: 'string',
  age: 'number',
  sex: 'string'
},
  {
    collection: 'newCustomer'
  }
);

const Customer = mongoose.model('Schema', customerSchema);

const customer1 = new Customer({ name: '홍길동', age: 30, sex: '남' });

customer1.save()
  .then(() => {
    console.log(customer1);
  })
  .catch((err) => {
    console.log('Error : ' + err);
  }); */