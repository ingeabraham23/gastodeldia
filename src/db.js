import Dexie from "dexie";

const db = new Dexie("ProductDatabase");
db.version(1).stores({
  records: "++id, title, products",
});

export default db;