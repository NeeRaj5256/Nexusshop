import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// POST /api/orders — authenticated users
router.post("/", protect, async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const order = await Order.create({ user: req.user._id, items, total });

    // Decrement stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.qty },
      });
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/my — user's own orders
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders — admin: all orders
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/stats — admin dashboard stats
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find();
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    res.json({ totalOrders: orders.length, totalRevenue });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
