import Dexie from "dexie";

const db = new Dexie("ProductDatabase");
db.version(3).stores({
  records: "++id, title, products",
  listas: "++id, title",
  operaciones: "++id, titulo"
});

export default db;