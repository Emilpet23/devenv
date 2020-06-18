const mysql = require("mysql");
const dotenv = require("dotenv");
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
});

class DbService {
  static getDbServiceInstance() {
    return instance ? instance : new DbService();
  }

  // Henter alt fra tabellen produkt
  async getAllData() {
    try {
      const response = await new Promise((resolve, reject) => {
        const query = "SELECT * FROM produkt;";

        connection.query(query, (err, results) => {
          if (err) reject(new Error(err.message));
          resolve(results);

          // Forsøger at hente alt fra tabellen kategori
          const queri = "SELECT * FROM kategori;";
          connection.query(queri, (err, results) => {
            if (err) reject(new Error(err.message));
            resolve(results);
          });
        });
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  // Indsætter de indtastede værdier ind i tabellen gennem en query
  async insertNewProduct(navn, beskrivelse, kg, amount, pris, kategori) {
    try {
      const insertId = await new Promise((resolve, reject) => {
        // SQL Query, der er blev brugt ? for at undgå SQL injections
        const query =
          "INSERT INTO produkt (navn, beskrivelse, kg, amount, pris, kategori) VALUES (?,?,?,?,?,?);";

        connection.query(query, [navn, beskrivelse, kg, amount, pris, kategori], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.insertId);
        });
      });
      // Returnerer det som et objekt
      return {
        id: insertId,
        navn: navn,
        beskrivelse: beskrivelse,
        kg: kg,
        amount: amount,
        pris: pris,
        kategori: kategori
      };
    } catch (error) {
      console.log(error);
    }
  }

  // Sletter et produkt fra databasen baseret på ID'et
  async deleteRowById(id) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "DELETE FROM produkt WHERE id = ?";

        connection.query(query, [id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  // Opdaterer navnet på et produkt baseret på ID'et
  async updateProductById(id, navn) {
    try {
      id = parseInt(id, 10);
      const response = await new Promise((resolve, reject) => {
        const query = "UPDATE produkt SET navn = ? WHERE id = ?";

        connection.query(query, [navn, id], (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result.affectedRows);
        });
      });

      return response === 1 ? true : false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

module.exports = DbService;
