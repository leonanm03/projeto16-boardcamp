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

// GET ONE
export async function getRental(req, res) {
  const { id } = req.params;
  try {
    const rental = await db.query(
      `SELECT * FROM ${rentalsTable} WHERE id = $1;`,
      [id]
    );
    res.status(200).send(rental.rows[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
