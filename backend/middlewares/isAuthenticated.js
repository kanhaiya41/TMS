import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        // console.log('cookies', req.cookies);
        if (!token) {
            return res.status(401).json({
                message: 'User not authenticated',
                success: false,
                notAuthorized: true
            })
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: 'Invalid token',
                success: false,
                notAuthorized: true
            })
        }
        req.id = decode.userId;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Authentication error',
            success: false,
            notAuthorized: true
        });
    }
}