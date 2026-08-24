import { registerUser, loginUser, getUserById } from './auth.service.js';

/**
 * POST /api/auth/register
 * Register a new user account
 */
export async function register(req, res, next) {
  try {
    const { username, password } = req.body;
    const user = await registerUser(username, password);

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/login
 * Authenticate user and return JWT
 */
export async function login(req, res, next) {
  try {
    const { username, password } = req.body;
    const { token, user } = await loginUser(username, password);

    // Set httpOnly cookie for additional security
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({
      success: true,
      data: { token, user },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/auth/logout
 * Clear auth cookie
 */
export async function logout(req, res) {
  res.clearCookie('token');
  res.json({
    success: true,
    data: { message: 'Logged out successfully' },
  });
}

/**
 * GET /api/auth/me
 * Get current logged-in user's profile
 */
export async function me(req, res, next) {
  try {
    const user = await getUserById(req.user.id);
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}
