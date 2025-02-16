import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppErrors';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/Users/user.interface';
import { User } from '../modules/Users/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // Check if the authorization header is missing
    if (!authHeader) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Authorization header is missing',
      );
    }

    const [prefix, token] = authHeader.split(' ');

    // Validate token format
    if (prefix !== 'Bearer' || !token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token format');
    }

    // Verify token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(
        token,
        config.jwt_access_token as string,
      ) as JwtPayload;
    } catch (err) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token');
    }

    // Extract user data from token
    const { userEmail, role } = decoded;

    // Check if the role is required and authorized
    if (requiredRoles.length && !requiredRoles.includes(role as TUserRole)) {
      throw new AppError(httpStatus.FORBIDDEN, 'You are not authorized');
    }

    // Check if the user exists in the database
    const existUser = await User.findOne({ email: userEmail });
    if (!existUser) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'User does not exist');
    }

    // Validate role consistency
    if (existUser.role !== role) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Role mismatch detected');
    }

    // Attach user data to request object
    req.user = { userEmail, role } as JwtPayload;

    // Proceed to the next middleware
    next();
  });
};

export default auth;
