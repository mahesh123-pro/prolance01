import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token" });

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedData?.id;
        req.role = decodedData?.role;

        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthenticated" });
    }
};

export const isAdmin = (req, res, next) => {
    if (req.role !== 'ADMIN') return res.status(403).json({ message: "Access denied. Admin only." });
    next();
};

export default auth;
