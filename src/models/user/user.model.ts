import { model, Schema, models } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "./user.types";

export const UserSchema = new Schema<IUser>(
    {
        username: { type: String, required: true, unique: false },
        email: {
            type: String, required: true, unique: true
        },
        password: { type: String, required: true },
        points: { type: Number, required: true, default: 0 },
        role: { type: String, required: true, default: 'Student', enum: ['Student', 'Teacher', 'Admin'] },
    },
    { timestamps: true }
);

UserSchema.index({ email: 1 }, { unique: true });

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

export const UserModel = models.User || model<IUser>("User", UserSchema);
