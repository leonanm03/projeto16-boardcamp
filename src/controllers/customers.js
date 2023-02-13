// config imports
import { db, customersTable } from "../config/database.js";

// GET ALL
export async function getCustomers(req, res) {
  try {
    const result = await db.query(`SELECT * FROM ${customersTable}`);
    const customers = result.rows;
    return res.status(200).send(customers);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

// POST CUSTOMER
export async function postCustomer(req, res) {
  const { name, cpf, phone, birthday } = req.body;

  try {
    const alreadyExists = await db.query(
      `SELECT * FROM ${customersTable}
        WHERE cpf = $1`,
      [cpf]
    );

    if (alreadyExists.rows.length > 0) {
      return res.sendStatus(409);
    }

    await db.query(
      `INSERT INTO ${customersTable} (name, cpf, phone, birthday)
        VALUES ($1, $2, $3, $4);`,
      [name, cpf, phone, birthday]
    );
    return res.sendStatus(201);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

// GET CUSTOMER BY ID
export async function getCustomerById(req, res) {
  const { id } = req.params;

  try {
    const customer = await db.query(
      `SELECT * FROM ${customersTable}
        WHERE id = $1`,
      [id]
    );

    if (customer.rows.length === 0) {
      return res.sendStatus(404);
    }

    return res.status(200).send(customer.rows[0]);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

// PUT CUSTOMER
export async function putCustomer(req, res) {
  const { name, cpf, phone, birthday } = req.body;
  const { id } = req.params;

  try {
    const customer = await db.query(
      `SELECT * FROM ${customersTable}
        WHERE id = $1`,
      [id]
    );

    if (customer.rows.length === 0) {
      return res.sendStatus(404);
    }

    const cpfAlreadyExists = await db.query(
      `SELECT * FROM ${customersTable}
        WHERE cpf = $1 AND id <> $2`,
      [cpf, id]
    );

    if (cpfAlreadyExists.rows.length > 0) {
      return res.sendStatus(409);
    }

    await db.query(
      `UPDATE ${customersTable} 
        SET name = $1, cpf = $2, phone = $3, birthday = $4 
        WHERE id = $5`,
      [name, cpf, phone, birthday, id]
    );

    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}
