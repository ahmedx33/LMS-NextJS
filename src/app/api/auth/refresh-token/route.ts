/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

const refreshTokenHandler = (req: NextApiRequest, res: NextApiResponse) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token missing' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!, (err, decoded: any) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }

        const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_ACCESS_SECRET!, {
            expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME,
        });

        res.status(200).json({ accessToken: newAccessToken });
    });
};

export default refreshTokenHandler;
