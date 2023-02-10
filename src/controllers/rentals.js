import { db, rentalsTable } from "../config/database.js";

// GET ALL
export async function getRentals(req, res) {
  try {
    const rentals = await db.query(`SELECT * FROM ${rentalsTable}`);
    res.status(200).send(rentals.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
