// // database.js
// import * as SQLite from "expo-sqlite";

// let db = null;

// export const initDatabase = async () => {
//   if (!db) {
//     db = await SQLite.openDatabaseAsync("inventory.db");
//   }
//   return db;
// };

// export const initializeSchema = async () => {
//   const db = await initDatabase();

//   // Create tables if they don't exist
//   await db.execAsync(`
//     CREATE TABLE IF NOT EXISTS categories (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL
//     );

//     CREATE TABLE IF NOT EXISTS products (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL,
//       quantity INTEGER DEFAULT 0,
//       category_id INTEGER,
//       FOREIGN KEY (category_id) REFERENCES categories(id)
//     );

//     CREATE TABLE IF NOT EXISTS users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       name TEXT NOT NULL,
//       role TEXT
//     );
//   `);
// };

// export const seedSampleData = async () => {
//   const db = await initDatabase();

//   const existing = await db.getFirstAsync(
//     "SELECT COUNT(*) as count FROM categories"
//   );
//   if (existing?.count > 0) {
//     console.log("ℹ️ Sample data already exists, skipping seed.");
//     return;
//   }

//   await db.runAsync(`INSERT INTO categories (name) VALUES (?), (?), (?)`, [
//     "Hair",
//     "Skincare",
//     "Nails",
//   ]);

//   await db.runAsync(`INSERT INTO users (name, role) VALUES (?, ?)`, [
//     "Admin",
//     "admin",
//   ]);

//   await db.runAsync(`INSERT INTO users (name, role) VALUES (?, ?)`, [
//     "Manager",
//     "manager",
//   ]);

//   await db.runAsync(
//     `INSERT INTO products (name, quantity, category_id) VALUES (?, ?, ?)`,
//     ["Shampoo", 198, 1]
//   );

//   await db.runAsync(
//     `INSERT INTO products (name, quantity, category_id) VALUES (?, ?, ?)`,
//     ["Face Wash", 37, 2]
//   );

//   await db.runAsync(
//     `INSERT INTO products (name, quantity, category_id) VALUES (?, ?, ?)`,
//     ["Nail Polish", 119, 3]
//   );

//   console.log("✅ Sample data seeded");
// };

// const runQuery = async (sql, params = []) => {
//   const database = await initDatabase();
//   const result = await database.runAsync(sql, params);
//   return result;
// };

// export const getDashboardStats = async () => {
//   const db = await initDatabase();
//   try {
//     const catRes = (await db.getFirstAsync(
//       "SELECT COUNT(*) AS count FROM categories"
//     )) || { count: 0 };
//     const prodRes = (await db.getFirstAsync(
//       "SELECT COUNT(*) AS count FROM products"
//     )) || { count: 0 };
//     const userRes = (await db.getFirstAsync(
//       "SELECT COUNT(*) AS count FROM users"
//     )) || { count: 0 };
//     const lowStockRes = (await db.getFirstAsync(
//       "SELECT COUNT(*) AS count FROM products WHERE quantity < 5"
//     )) || { count: 0 };

//     console.log("📦 DB instance:", db);
//     return {
//       categories: catRes.count,
//       products: prodRes.count,
//       users: userRes.count,
//       lowStock: lowStockRes.count,
//     };
//   } catch (error) {
//     console.error("Failed to load dashboard stats:", error);
//     return {
//       categories: 0,
//       products: 0,
//       users: 0,
//       lowStock: 0,
//     };
//   }
// };

// database.js
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebaseConfigue"; // adjust the import as needed

// --- Categories ---
export const addCategory = async (name) => {
  await addDoc(collection(db, "categories"), { name });
};

export const getCategories = async () => {
  const categoriesCol = collection(db, "categories");
  const snapshot = await getDocs(categoriesCol);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// --- Products ---
export const addProduct = async (product) => {
  // product = { name, quantity, categoryId, imageUrl }
  await addDoc(collection(db, "products"), product);
};

export const getProducts = async () => {
  const productsCol = collection(db, "products");
  const snapshot = await getDocs(productsCol);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updateProduct = async (productId, updatedFields) => {
  const productRef = doc(db, "products", productId);
  await updateDoc(productRef, updatedFields);
};

export const deleteProduct = async (productId) => {
  await deleteDoc(doc(db, "products", productId));
};

// --- Users ---
export const addUser = async (user) => {
  // user = { name, role }
  await addDoc(collection(db, "users"), user);
};

export const getUsers = async () => {
  const usersCol = collection(db, "users");
  const snapshot = await getDocs(usersCol);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// --- Dashboard Stats ---
export const getDashboardStats = async () => {
  const categoriesCountSnap = await getCountFromServer(
    collection(db, "categories")
  );
  const productsCountSnap = await getCountFromServer(
    collection(db, "products")
  );
  const usersCountSnap = await getCountFromServer(collection(db, "users"));

  const lowStockQuery = query(
    collection(db, "products"),
    where("quantity", "<", 5)
  );
  const lowStockSnap = await getCountFromServer(lowStockQuery);

  return {
    categories: categoriesCountSnap.data().count,
    products: productsCountSnap.data().count,
    users: usersCountSnap.data().count,
    lowStock: lowStockSnap.data().count,
  };
};
