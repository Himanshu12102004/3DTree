import mongoose from "mongoose";

const CreationsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  configuration: {
    angleX: { type: Number, required: true },
    angleZ: { type: Number, required: true },
    rootRadius: { type: Number, required: true },
    rootHeight: { type: Number, required: true },
    branchingLevels: { type: Number, required: true },
    smoothingFactor: { type: Number, required: true },
    dampeningFactor: { type: Number, required: true },
    cellDimensionX: { type: Number, required: true },
    cellDimensionZ: { type: Number, required: true },
    rootColor: {
      type: [Number],
      required: true,
      validate: {
        validator: (arr: number[]) => Array.isArray(arr) && arr.length === 3,
        message: "rootColor must be an array of length 3",
      },
    },
    branchColor: {
      type: [Number],
      required: true,
      validate: {
        validator: (arr: number[]) => Array.isArray(arr) && arr.length === 3,
        message: "branchColor must be an array of length 3",
      },
    },
    cameraPosition: {
      type: [Number],
      required: true,
      validate: {
        validator: (arr: number[]) => Array.isArray(arr) && arr.length === 3,
        message: "cameraPosition must be an array of length 3",
      },
    },
    cameraDirection: {
      type: [Number],
      required: true,
      validate: {
        validator: (arr: number[]) => Array.isArray(arr) && arr.length === 2,
        message: "cameraDirection must be an array of length 2",
      },
    },
    maxRayMarch: {
      type: Number,
      required: true,
    },
  },
});

export default mongoose.models.Creations ||
  mongoose.model("Creations", CreationsSchema);
