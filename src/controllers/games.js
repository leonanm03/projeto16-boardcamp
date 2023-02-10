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
