import { Request, Response } from "express";
import jwt from "jsonwebtoken";

class AdminController {
  // Static admin credentials
  private static readonly ADMIN_EMAIL: string = 'admin@example.com';
  private static readonly ADMIN_PASSWORD: string = process.env.ADMIN_PW || '';

  // Admin login
  static async login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
      if (email !== AdminController.ADMIN_EMAIL || password !== AdminController.ADMIN_PASSWORD) {
        return res.status(400).send("Invalid credentials");
      }

      // Generate JWT tokens
      const accessToken = jwt.sign(
        { email: AdminController.ADMIN_EMAIL },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );
      const refreshToken = jwt.sign(
        { email: AdminController.ADMIN_EMAIL },
        process.env.JWTREFRESH_SECRET as string,
        { expiresIn: "10d" }
      );

      // Set refresh token as HTTP-only cookie
      res.cookie('refreshTokenAdmin', refreshToken, {
        httpOnly: true,
        secure: false, // Set to true in production
        sameSite: 'strict',
        maxAge: 10 * 24 * 60 * 60 * 1000 
      });

      console.log(accessToken)

      
      res.send({ accessToken });
    } catch (error) {
      res.status(500).send("Server error");
    }
  }

  // Refresh token method
  static async refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) return res.status(400).send("Refresh token required");

    try {
      // Verify the refresh token
      const decoded: any = jwt.verify(refreshToken, process.env.JWTREFRESH_SECRET as string);

      // Check if the email in the token matches the static admin email
      if (decoded.email !== AdminController.ADMIN_EMAIL) {
        return res.status(403).send("Forbidden");
      }

      // Generate a new access token
      const newAccessToken = jwt.sign(
        { email: AdminController.ADMIN_EMAIL },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      res.send({ accessToken: newAccessToken });
    } catch (error) {
      res.status(401).send("Invalid refresh token");
    }
  }
}

export default AdminController;
