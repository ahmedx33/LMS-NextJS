import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import { generateAccessToken, generateRefreshToken } from '@/lib';
import bcrypt from 'bcryptjs';
import { UserModel } from '@/models/user';
import connectDB from '@/lib/connect-db';

export const POST = async (req: NextApiRequest, res: NextApiResponse) => {
    await connectDB()
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        res.setHeader('Set-Cookie', [
            cookie.serialize('accessToken', accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60,
                path: '/',
            }),
            cookie.serialize('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7,
                path: '/',
            }),
        ]);

        return res.status(200).json({ message: 'Logged in successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
