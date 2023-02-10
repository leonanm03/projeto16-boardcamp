import { db, customersTable } from "../config/database.js";

// GET ALL
export async function getCustomers(req, res) {
  try {
    const customers = await db.query(`SELECT * FROM ${customersTable}`);
    res.status(200).send(customers.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

//POST CUSTOMER
export async function postCustomer(req, res) {
  const { name, cpf, phone, birthday } = req.body;

  try {
    const alreadyExists = await db.query(
      `SELECT * FROM ${customersTable} WHERE cpf = $1`,
      [cpf]
    );

    if (alreadyExists.rows.length > 0) {
      return res.status(409).send("This customer already exists");
    }

    const customer = await db.query(
      `INSERT INTO ${customersTable} (name, cpf, phone, birthday) VALUES ($1, $2, $3, $4);`,
      [name, cpf, phone, birthday]
    );
    res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
