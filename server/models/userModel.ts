import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";

// Interface for User Document
export interface IUser extends Document {
  email: string;
  password?: string;
  name: string;
  isPro: boolean;
  proSince?: Date;
  transactionId?: string;
  orderId?: string;
  image?: string;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    isPro: {
      type: Boolean,
      default: false,
    },
    proSince: {
      type: Date,
    },
    transactionId: {
      type: String,
    },
    orderId: {
      type: String,
    },
    image: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/thumbnails/001/840/618/small/picture-profile-icon-male-icon-human-or-people-sign-and-symbol-free-vector.jpg",
    }
  },
  { timestamps: true }
);

// Method to compare passwords
userSchema.methods.comparePassword = function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Hash password before saving
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  if (this.password) this.password = await bcrypt.hash(this.password, salt);
  next();
});

// User Model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
