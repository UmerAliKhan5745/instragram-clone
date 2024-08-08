import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  id?: string;
}

const isAuthenticated = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: 'User not authenticated',
        success: false
      });
    }

    const decoded = jwt.verify(token, 'omeralikhan') as { userId: string };
    if (!decoded) {
      return res.status(401).json({
        message: 'Invalid token',
        success: false
      });
    }

    req.id = decoded.userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Internal server error',
      success: false
    });
  }
};

export default isAuthenticated;
