import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";
import User from "./models/User.js";

dotenv.config();

const PRODUCTS = [
  {
    name: "Arc Wireless Headphones",
    category: "Electronics",
    price: 12499,
    stock: 24,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    description: "Premium sound isolation with 40hr battery life. Foldable design with touch controls.",
    rating: 4.8, reviews: 312, badge: "Bestseller"
  },
  {
    name: "Leather Minimal Wallet",
    category: "Accessories",
    price: 4199,
    stock: 60,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80",
    description: "Full-grain Italian leather, RFID blocking, holds 8 cards + cash.",
    rating: 4.6, reviews: 189, badge: "New"
  },
  {
    name: "Matte Ceramic Mug",
    category: "Kitchen",
    price: 1299,
    stock: 100,
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600&q=80",
    description: "450ml handcrafted ceramic. Dishwasher safe. Available in 6 earthy tones.",
    rating: 4.9, reviews: 540, badge: ""
  },
  {
    name: "Mechanical Keyboard TKL",
    category: "Electronics",
    price: 9999,
    stock: 15,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
    description: "Compact tenkeyless with hot-swap switches. RGB backlighting. PBT keycaps.",
    rating: 4.7, reviews: 228, badge: "Hot"
  },
  {
    name: "Yoga Mat Pro",
    category: "Sports",
    price: 2499,
    stock: 40,
    image: "https://images.unsplash.com/photo-1601925228892-5c7c9c644c9c?w=600&q=80",
    description: "6mm natural rubber, alignment lines, non-slip texture both sides.",
    rating: 4.5, reviews: 301, badge: ""
  },
  {
    name: "Plant Grow Kit",
    category: "Home",
    price: 1799,
    stock: 55,
    image: "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=600&q=80",
    description: "Everything to grow herbs indoors. Includes 5 seed varieties and organic soil.",
    rating: 4.8, reviews: 175, badge: "Eco"
  },
  {
    name: "Smart Water Bottle",
    category: "Sports",
    price: 2999,
    stock: 30,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
    description: "Temperature tracking, hydration reminders, 24hr insulation. BPA-free stainless.",
    rating: 4.6, reviews: 256, badge: ""
  },
  {
    name: "Modular Desk Lamp",
    category: "Home",
    price: 5999,
    stock: 18,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80",
    description: "Adjustable arms, 3 color temperatures, wireless charging base, USB-A port.",
    rating: 4.7, reviews: 143, badge: "New"
  },
  {
    name: "Running Shoes Air",
    category: "Sports",
    price: 6499,
    stock: 35,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    description: "Lightweight mesh upper with air-cushion sole. Ideal for road and track.",
    rating: 4.6, reviews: 412, badge: ""
  },
  {
    name: "Minimalist Watch",
    category: "Accessories",
    price: 8999,
    stock: 22,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    description: "Sapphire crystal glass, stainless steel case, genuine leather strap.",
    rating: 4.8, reviews: 267, badge: "Bestseller"
  },
  {
    name: "Wooden Serving Board",
    category: "Kitchen",
    price: 1599,
    stock: 48,
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&q=80",
    description: "Solid acacia wood. Hand-oiled finish. Perfect for cheese, bread, and charcuterie.",
    rating: 4.7, reviews: 198, badge: ""
  },
  {
    name: "Portable Bluetooth Speaker",
    category: "Electronics",
    price: 3799,
    stock: 33,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
    description: "360° surround sound, 12hr playtime, IPX5 waterproof. Built-in mic for calls.",
    rating: 4.5, reviews: 334, badge: ""
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");

    await Product.deleteMany();
    await User.deleteMany();

    await Product.insertMany(PRODUCTS);
    console.log(`✅ Seeded ${PRODUCTS.length} products`);

    // Create admin user
    await User.create({
      name: "Admin",
      email: "admin@shop.com",
      password: "admin123",
      role: "admin",
    });
    console.log("✅ Admin user created: admin@shop.com / admin123");

    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
};

seed();
