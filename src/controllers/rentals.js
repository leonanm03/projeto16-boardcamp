import {
  customersTable,
  db,
  gamesTable,
  rentalsTable,
} from "../config/database.js";

// GET ALL
export async function getRentals(req, res) {
  try {
    const rentals = await db.query(`SELECT * FROM ${rentalsTable}`);
    console.log(rentals.rows);
    res.status(200).send(rentals.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

// POST RENTAL
export async function postRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  const dateNow = new Date();
  const rentDate = dateNow.toISOString().split("T")[0];
  let originalPrice = 0;
  const returnDate = null;
  const delayFee = null;
  try {
    const game = await db.query(`SELECT * FROM ${gamesTable} WHERE id = $1`, [
      gameId,
    ]);
    const { pricePerDay } = game.rows[0];
    originalPrice = pricePerDay * daysRented;

    // Check if customer is valid
    const customerExists = await db.query(
      `SELECT * FROM ${customersTable} WHERE id = $1`,
      [customerId]
    );
    if (customerExists.rows[0] === 0) {
      return res.status(400).send("Customer not found!");
    }

    // Check if game is valid
    const gameExists = await db.query(
      `SELECT * FROM ${gamesTable} WHERE id = $1`,
      [gameId]
    );
    if (gameExists.rows[0] === 0) {
      return res.status(400).send("Game not found!");
    }

    const rental = await db.query(
      `INSERT INTO ${rentalsTable} ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") VALUES ($1, $2, $3, $4, $5, $6, $7);`,
      [
        customerId,
        gameId,
        rentDate,
        daysRented,
        returnDate,
        originalPrice,
        delayFee,
      ]
    );
    res.status(201).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
}
