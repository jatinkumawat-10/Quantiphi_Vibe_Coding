import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../config/db.js';
import { env } from '../../config/env.js';
import logger from '../../utils/logger.js';

/**
 * Register a new user
 * 
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{id: string, username: string}>}
 */
export async function registerUser(username, password) {
  // Hash the password
  const passwordHash = await bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);

  // Create the user
  const user = await prisma.user.create({
    data: {
      username,
      passwordHash,
    },
    select: {
      id: true,
      username: true,
    },
  });

  logger.info({ userId: user.id, username: user.username }, 'User registered successfully');
  return user;
}

/**
 * Authenticate a user and return a JWT
 * 
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{token: string, user: {id: string, username: string}}>}
 * @throws {Error} If credentials are invalid
 */
export async function loginUser(username, password) {
  // Find the user
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    const error = new Error('Invalid username or password');
    error.isOperational = true;
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  // Compare passwords
  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    const error = new Error('Invalid username or password');
    error.isOperational = true;
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  // Generate JWT
  const token = jwt.sign(
    { id: user.id, username: user.username },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );

  logger.info({ userId: user.id, username: user.username }, 'User logged in successfully');
  return {
    token,
    user: { id: user.id, username: user.username },
  };
}

/**
 * Get user by ID
 * 
 * @param {string} userId
 * @returns {Promise<{id: string, username: string, createdAt: Date}>}
 */
export async function getUserById(userId) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      createdAt: true,
    },
  });

  if (!user) {
    const error = new Error('User not found');
    error.isOperational = true;
    error.statusCode = 404;
    error.code = 'USER_NOT_FOUND';
    throw error;
  }

  return user;
}
