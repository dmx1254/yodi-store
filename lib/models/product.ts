// lib/models/product.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  price: number;
  category: string;
  subCategory?: string;
  discount?: number;
  imageUrl: string;
  benefits?: string[];
  stock: number;
  brand?: string;
  sku?: string;
  etiquette?: string;
  description?: string;
  usage?: string;
}

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subCategory: {
      type: String,
      required: false,
      trim: true,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    brand: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Permet les valeurs null/undefined uniques
    },
    etiquette: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    usage: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel =
  mongoose.models.product || mongoose.model<IProduct>("product", productSchema);

export default ProductModel;
