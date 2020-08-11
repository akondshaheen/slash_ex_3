const express = require("express");
const app = express();
const { Pool } = require("pg");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

app.listen(8000, function () {
  console.log("Server is listening on port 3000. Ready to accept requests!");
});

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cyf_hotels",
  password: "Bird14",
  port: 5432,
});

app.post("/customers", function (req, res) {
  const newCustomerName = req.body.name;
  const newCustomerEmail = req.body.email;
  const newCustomerAddress = req.body.address;
  const newCustomerCity = req.body.city;
  const newCustomerPostcode = req.body.postcode;
  const newCustomerCountry = req.body.country;

  pool
    .query("SELECT * FROM customers WHERE name=$1", [newCustomerName])
    .then((result) => {
      if (result.rows.length > 0) {
        return res
          .status(400)
          .send("A Customer with the same name already exists!");
      } else {
        const query =
          "INSERT INTO customers (name, email,address, city, postcode, country) VALUES ($1, $2, $3, $4, $5, $6)";
        pool
          .query(query, [
            newCustomerName,
            newCustomerEmail,
            newCustomerAddress,
            newCustomerCity,
            newCustomerPostcode,
            newCustomerCountry,
          ])
          .then(() => res.send("Customer created!"))
          .catch((e) => console.error(e));
      }
    });
});

app.put("/customers/:customerId", function (req, res) {
  const customerId = req.params.customerId;
  const customerEmail = req.body.email;
  const customerAddress = req.body.address;
  const customerCity = req.body.city;
  const customerPostcode = req.body.postcode;
  const customerCountry = req.body.country;

  if (customerEmail == "") {
    return res
      .status(400)
      .send("A Customer with the same name already exists!");
  } else {
    pool
      .query(
        "UPDATE customers SET email=$1, address=$2, city=$3, postcode=$4, country=$5 WHERE id=$6",
        [
          customerEmail,
          customerAddress,
          customerCity,
          customerPostcode,
          customerCountry,
          customerId,
        ]
      )
      .then(() => res.send(`Customer ${customerId} updated!`))
      .catch((e) => console.error(e));
  }
});

//EX 4
app.delete("/customers/:customerId", function (req, res) {
  const customerId = req.params.customerId;

  pool
    .query("DELETE FROM bookings WHERE customer_id=$1", [customerId])
    .then(() => {
      pool
        .query("DELETE FROM customers WHERE id=$1", [customerId])
        .then(() => res.send(`Customer ${customerId} deleted!`))
        .catch((e) => console.error(e));
    })

    .catch((e) => console.error(e));
});

app.delete("/customers/:customerName", function (req, res) {
  const customerName = req.params.customerName;

  pool
    .query("SELECT * FROM customers WHERE name=$1", [customerName])
    .then(
      pool
        .query(
          "DELETE FROM bookings INNER JOIN customers WHERE customers.name=$1",
          [customerName]
        )
        .then(() => res.send(`Customer  deleted!`))
        .catch((e) => console.error(e))
    )

    .catch((e) => console.error(e));
});
