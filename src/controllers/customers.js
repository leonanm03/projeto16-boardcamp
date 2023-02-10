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
