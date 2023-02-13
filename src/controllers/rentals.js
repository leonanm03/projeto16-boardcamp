// config imports
import {
  customersTable,
  db,
  gamesTable,
  rentalsTable,
} from "../config/database.js";

// GET ALL
export async function getRentals(req, res) {
  try {
    const rentals = await db.query(`WITH rental_game_customer AS (
      SELECT ${rentalsTable}.id, ${rentalsTable}."customerId", ${rentalsTable}."gameId", ${rentalsTable}."rentDate",
      ${rentalsTable}."daysRented", ${rentalsTable}."returnDate", ${rentalsTable}."originalPrice", ${rentalsTable}."delayFee",
             customers.id AS customer_id, customers.name AS customer_name,
             games.id AS game_id, games.name AS game_name
      FROM ${rentalsTable}
      JOIN customers ON ${rentalsTable}."customerId" = customers.id
      JOIN games ON ${rentalsTable}."gameId" = games.id
    )
    SELECT row_to_json(rental_game_customer) AS rental
    FROM (
      SELECT
        id,
        "customerId",
        "gameId",
        "rentDate",
        "daysRented",
        "returnDate",
        "originalPrice",
        "delayFee",
        json_build_object('id', customer_id, 'name', customer_name) AS customer,
        json_build_object('id', game_id, 'name', game_name) AS game
      FROM rental_game_customer
    ) rental_game_customer;
      `);

    return res.status(200).send(rentals.rows);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

// POST RENTAL
export async function postRental(req, res) {
  const { customerId, gameId, daysRented } = req.body;
  try {
    const game = await db.query(
      `SELECT * FROM ${gamesTable}
      WHERE id = $1`,
      [gameId]
    );
    const { pricePerDay } = game.rows[0];
    const originalPrice = pricePerDay * daysRented;

    // Check if customer is valid
    const customerExists = await db.query(
      `SELECT * FROM ${customersTable}
      WHERE id = $1`,
      [customerId]
    );
    if (customerExists.rows[0] === 0) {
      return res.sendStatus(400);
    }

    // Check if game is valid
    const gameExists = await db.query(
      `SELECT * FROM ${gamesTable} WHERE id = $1`,
      [gameId]
    );
    if (gameExists.rows[0] === 0) {
      return res.sendStatus(400);
    }

    // Check if game is available
    const gamesRented = await db.query(
      `SELECT * FROM ${rentalsTable}
        WHERE "gameId" = $1 AND "returnDate" IS NULL`,
      [gameId]
    );

    const gameStock = gameExists.rows[0].stockTotal;
    const gameRented = gamesRented.rows.length;

    const notInStock = gameStock <= gameRented;
    if (notInStock) {
      return res.sendStatus(400);
    }

    const dateNow = new Date();
    const rentDate = dateNow.toISOString().split("T")[0];
    const returnDate = null;
    const delayFee = null;

    const rental = await db.query(
      `INSERT INTO ${rentalsTable} ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
        VALUES ($1, $2, $3, $4, $5, $6, $7);`,
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
    return res.sendStatus(201);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

// RETURN RENTAL
export async function postRentalReturn(req, res) {
  const { id } = req.params;

  try {
    const rentalExists = await db.query(
      `SELECT * FROM ${rentalsTable}
        WHERE id = $1`,
      [id]
    );
    if (rentalExists.rows.length === 0) {
      return res.sendStatus(404);
    }
    const rental = rentalExists.rows[0];

    const returned = rental.returnDate;
    if (returned !== null) {
      return res.sendStatus(400);
    }

    const dateNow = new Date();
    const newReturnDate = dateNow.toISOString().split("T")[0];
    const rentDate = new Date(rental.rentDate);
    const daysRented = rental.daysRented;
    const returnDate = new Date(newReturnDate);
    const timeDiff = Math.abs(returnDate.getTime() - rentDate.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const delay = diffDays - daysRented;
    let delayFee = 0;

    if (delay > 0) {
      const game = await db.query(
        `SELECT * FROM ${gamesTable}
        WHERE id = $1`,
        [rental.gameId]
      );
      const { pricePerDay } = game.rows[0];

      delayFee = delay * pricePerDay;
    }

    const updatedRental = await db.query(
      `UPDATE ${rentalsTable}
        SET "returnDate" = $1, "delayFee" = $2
        WHERE id = $3`,
      [newReturnDate, delayFee, id]
    );

    return res.status(200).send();
  } catch (err) {
    return res.status(500).send(err.message);
  }
}

// DELETE RENTAL
export async function deleteRental(req, res) {
  const { id } = req.params;

  try {
    const rentalExists = await db.query(
      `SELECT * FROM ${rentalsTable}
        WHERE id = $1`,
      [id]
    );
    if (rentalExists.rows.length === 0) {
      return res.sendStatus(404);
    }

    const rental = rentalExists.rows[0];

    const returned = rental.returnDate;
    if (returned === null) {
      return res.sendStatus(400);
    }

    const deletedRental = await db.query(
      `DELETE FROM ${rentalsTable}
        WHERE id = $1`,
      [id]
    );

    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).send(err.message);
  }
}
