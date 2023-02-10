import { db, gamesTable } from "../config/database.js";

// GET ALL
export async function getGames(req, res) {
  try {
    const games = await db.query(`SELECT * FROM ${gamesTable}`);
    res.status(200).send(games.rows);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

// POST GAME
export async function postGame(req, res) {
  const { name, image, stockTotal, pricePerDay } = req.body;

  try {
    const alreadyExists = await db.query(
      `SELECT * FROM ${gamesTable} WHERE name = $1`,
      [name]
    );

    if (alreadyExists.rows.length > 0) {
      return res.status(409).send("This game already exists");
    }

    const game = await db.query(
      `INSERT INTO ${gamesTable} (name, image, "stockTotal", "pricePerDay") VALUES ($1, $2, $3, $4);`,
      [name, image, stockTotal, pricePerDay]
    );
    return res.sendStatus(201);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
