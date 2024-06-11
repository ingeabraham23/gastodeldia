import Dexie from "dexie";

const db = new Dexie("ProductDatabase");
db.version(4).stores({
  records: "++id, title, products",
  listas: "++id, title",
  operaciones: "++id, titulo",
  simple: "++id, titulo"
});

export default db;