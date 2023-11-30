import Dexie from "dexie";

const db = new Dexie("ProductDatabase");
db.version(2).stores({
  records: "++id, title, products",
  listas: "++id, title",
});

export default db;