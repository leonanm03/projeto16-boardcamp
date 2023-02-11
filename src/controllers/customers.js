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

// POST CUSTOMER
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

// GET CUSTOMER BY ID
export async function getCustomerById(req, res) {
  const { id } = req.params;

  try {
    const customer = await db.query(
      `SELECT * FROM ${customersTable} WHERE id = $1`,
      [id]
    );

    if (customer.rows.length === 0) {
      return res.status(404).send("Customer not found");
    }

    res.status(200).send(customer.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

// PUT CUSTOMER
export async function putCustomer(req, res) {
  const { id } = req.params;
  const { name, cpf, phone, birthday } = req.body;

  try {
    const customer = await db.query(
      `SELECT * FROM ${customersTable} WHERE id = $1`,
      [id]
    );

    if (customer.rows.length === 0) {
      return res.status(404).send("Customer not found");
    }

    const cpfAlreadyExists = await db.query(
      `SELECT * FROM ${customersTable} WHERE cpf = $1 AND id <> $2`,
      [cpf, id]
    );

    if (cpfAlreadyExists.rows.length > 0) {
      return res.status(409).send("This CPF is already in use");
    }

    await db.query(
      `UPDATE ${customersTable} SET name = $1, cpf = $2, phone = $3, birthday = $4 WHERE id = $5`,
      [name, cpf, phone, birthday, id]
    );

    res.status(200).send("Customer updated");
  } catch (error) {
    res.status(500).send(error.message);
  }
}
