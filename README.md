# Beauty-Mart

interview task for ideamagix

## 📲 App Installation

👉 [Click here to install the APK](https://expo.dev/accounts/rehan_tamboli/projects/BeautyMart/builds/e4db4e86-6944-43ad-81a9-e01aa713c432)

Open this link on an **Android device** to download and install the app.

# 📱 BeautyMart - Inventory Management App

BeautyMart is a mobile application built using **React Native (Expo)** to help beauty store owners manage their inventory efficiently. It supports user authentication, product listing, category filtering, and image upload with cropping functionality.

---

## 🚀 Features

- 🔐 **User Authentication** (Firebase Auth)
- 📦 **Product Listing**
  - Add, edit, delete products
  - Upload product images (Camera & Gallery)
  - Crop images before saving (ImageCropScreen)
- 🗃️ **Category Filtering**
  - List products by category
- 📊 **Dashboard**
  - Statistics and insights
- ☁️ **Firebase Firestore** for database
- ☁️ **Cloudinary** for optimized image storage

---

## 🔧 Tech Stack

- **React Native (Expo)**
- **Firebase Auth + Firestore**
- **Cloudinary**
- **React Navigation**
- **React Native Toast**
- **Expo ImagePicker**
- **Expo Camera**
- **Expo ImageManipulator**

---

## 🧭 Navigation Flow

Root Stack Navigator
├── RegisterScreen
├── LoginScreen
└── MainTabs (Bottom Tab Navigator)
├── Dashboard
├── Categories (Stack)
│ ├── CategoryList
│ └── FilteredCategory
└── Product (Stack)
├── ProductScreen
└── CropScreen

## 💻 Screens Lists

/screens
/Auth

- LoginScreen.js
- RegistrationScreen.js
  /Main
- DashboardScreen.js
  /Category
- CategoryList.js
- FilteredCategory.js
  /Product
- ProductScreen.js
- ImageCropScreen.js
  /firebaseConfigue.js
  /App.js
  /eas.json

---

## 🔐 Firebase Collections

- **users**

  - `uid` → `{ name, email, phone, createdAt }`

- **products**
  - `docId` → `{ name, category, price, weight, dimensions, imageUrl }`

---

## 📦 How to Build APK

Make sure EAS CLI is installed:

```bash
npm install -g eas-cli
```

🔗 Links

🔗 APK Build Link
(https://expo.dev/accounts/rehan_tamboli/projects/BeautyMart)

📽️ Screen Recording Link


💾 Code Repo / Drive Link

🗃️ Firestore Export Dump

## 📝 Developer Info

Rehan Tamboli
Front-End & Mobile App Developer
Tech Stack React/React Native
📧 Email: <your email here>
🌐 Portfolio: <optional>
