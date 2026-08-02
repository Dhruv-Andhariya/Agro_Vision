import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import geoip from "geoip-lite";
import User from "../models/User.js";
import { sendEmail } from "../services/email.service.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const buildAuthResponse = (res, user, message, statusCode = 200) => {
  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  return res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  });
};

const normalizeIp = (value = "") => value.replace(/^::ffff:/, "").replace("::1", "127.0.0.1");

const getClientIp = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];

  if (typeof forwardedFor === "string" && forwardedFor.trim()) {
    return normalizeIp(forwardedFor.split(",")[0].trim());
  }

  return normalizeIp(req.ip || req.socket?.remoteAddress || "");
};

const getDeviceLabel = (userAgent = "") => {
  const agent = userAgent.toLowerCase();
  let os = "Unknown OS";
  let browser = "Browser";

  if (agent.includes("windows")) {
    os = "Windows";
  } else if (agent.includes("mac os") || agent.includes("macintosh")) {
    os = "Mac";
  } else if (agent.includes("linux")) {
    os = "Linux";
  } else if (agent.includes("android")) {
    os = "Android";
  } else if (agent.includes("iphone") || agent.includes("ipad") || agent.includes("ios")) {
    os = "iOS";
  }

  if (agent.includes("edg/")) {
    browser = "Edge";
  } else if (agent.includes("chrome/") && !agent.includes("edg/")) {
    browser = "Chrome";
  } else if (agent.includes("firefox/")) {
    browser = "Firefox";
  } else if (agent.includes("safari/") && !agent.includes("chrome/")) {
    browser = "Safari";
  }

  return `${os} ${browser}`.trim();
};

const getLocationFromIp = (ip = "") => {
  if (!ip) {
    return null;
  }

  const normalizedIp = normalizeIp(ip);

  if (
    normalizedIp.startsWith("127.") ||
    normalizedIp === "localhost" ||
    normalizedIp === "::1"
  ) {
    return null;
  }

  const geo = geoip.lookup(normalizedIp);

  if (!geo) {
    return null;
  }

  return {
    country: geo.country || "",
    region: geo.region || "",
    city: geo.city || "",
    timezone: geo.timezone || "",
  };
};

const formatLocation = (location) => {
  if (!location) {
    return "Unknown location";
  }

  const parts = [location.city, location.region, location.country].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "Unknown location";
};

const getAuthContext = (req) => {
  const ip = getClientIp(req);
  const userAgent = req.headers["user-agent"] || "";
  const location = getLocationFromIp(ip);

  return {
    ip,
    userAgent,
    device: getDeviceLabel(userAgent),
    location,
  };
};

const hasNewLoginContext = (user, context) => {
  if (!user.lastLoginAt) {
    return false;
  }

  const previousLocation = user.lastLoginLocation || {};
  const currentLocation = context.location || {};

  const hasDifferentDevice = user.lastLoginUserAgent !== context.userAgent;
  const hasDifferentIp = user.lastLoginIp !== context.ip;
  const hasDifferentLocation =
    previousLocation.country !== currentLocation.country ||
    previousLocation.region !== currentLocation.region ||
    previousLocation.city !== currentLocation.city;

  return hasDifferentDevice || hasDifferentIp || hasDifferentLocation;
};

const queueEmail = (payload) => {
  void sendEmail(payload).catch((error) => {
    console.error("Email send failed:", error.message);
  });
};

const sendWelcomeEmail = (user) => {
  const subject = "Welcome to AgroVision 🌱";
  const text = `Hi ${user.name},\n\nYour account has been created successfully.\n\nYou can now detect crop diseases using AI.`;

  queueEmail({
    to: user.email,
    subject,
    text,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin-bottom: 16px;">Welcome to AgroVision 🌱</h2>
        <p>Hi ${user.name},</p>
        <p>Your account has been created successfully.</p>
        <p>You can now detect crop diseases using AI.</p>
      </div>
    `,
  });
};

const sendNewLoginAlert = (user, context) => {
  const subject = "New Login Detected";
  const text = `New Login Detected\n\nHi ${user.name},\n\nYour AgroVision account was accessed successfully.\n\nTime: ${new Date().toLocaleString()}\nDevice: ${context.device}\nIP: ${context.ip || "Unknown"}\nLocation: ${formatLocation(context.location)}\n\nIf this wasn't you, please change your password immediately.`;

  queueEmail({
    to: user.email,
    subject,
    text,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2 style="margin-bottom: 16px;">New Login Detected</h2>
        <p>Hi ${user.name},</p>
        <p>Your AgroVision account was accessed successfully.</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Device:</strong> ${context.device}</p>
        <p><strong>IP:</strong> ${context.ip || "Unknown"}</p>
        <p><strong>Location:</strong> ${formatLocation(context.location)}</p>
        <p>If this wasn't you, please change your password immediately.</p>
      </div>
    `,
  });
};

const persistLoginContext = async (user, context) => {
  user.lastLoginAt = new Date();
  user.lastLoginIp = context.ip;
  user.lastLoginUserAgent = context.userAgent;
  user.lastLoginLocation = context.location || {
    country: "",
    region: "",
    city: "",
    timezone: "",
  };

  await user.save();
};

const markAuthActivity = async ({ user, req, shouldSendWelcome = false, shouldCheckLoginAlert = false }) => {
  const context = getAuthContext(req);

  if (shouldCheckLoginAlert && hasNewLoginContext(user, context)) {
    sendNewLoginAlert(user, context);
  }

  if (shouldSendWelcome) {
    sendWelcomeEmail(user);
  }

  await persistLoginContext(user, context);
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    await markAuthActivity({
      user,
      req,
      shouldSendWelcome: true,
      shouldCheckLoginAlert: false,
    });

    return buildAuthResponse(res, user, "Registration successful", 201);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    await markAuthActivity({
      user,
      req,
      shouldSendWelcome: false,
      shouldCheckLoginAlert: true,
    });

    return buildAuthResponse(res, user, "Login successful");
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { credential, mode = "login" } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Google credential is required",
      });
    }

    const audience = process.env.GOOGLE_CLIENT_ID;

    if (!audience) {
      return res.status(500).json({
        success: false,
        message: "Google client ID is not configured on the server",
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience,
    });

    const payload = ticket.getPayload();

    if (!payload?.email || !payload.email_verified) {
      return res.status(401).json({
        success: false,
        message: "Google account email could not be verified",
      });
    }

    const email = payload.email.toLowerCase();
    let user = await User.findOne({ email });
    const isNewUser = !user;

    if (!user && mode === "login") {
      return res.status(404).json({
        success: false,
        message: "Account not found. Please register first.",
      });
    }

    if (!user) {
      const hashedPassword = await bcrypt.hash(
        crypto.randomBytes(32).toString("hex"),
        10
      );

      user = await User.create({
        name: payload.name || payload.given_name || email.split("@")[0],
        email,
        password: hashedPassword,
        avatar: payload.picture || "",
      });
    } else {
      const updates = {};

      if (payload.picture && !user.avatar) {
        updates.avatar = payload.picture;
      }

      if (Object.keys(updates).length > 0) {
        Object.assign(user, updates);
        await user.save();
      }
    }

    await markAuthActivity({
      user,
      req,
      shouldSendWelcome: isNewUser,
      shouldCheckLoginAlert: !isNewUser,
    });

    return buildAuthResponse(
      res,
      user,
      isNewUser ? "Google registration successful" : "Google login successful"
    );
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message || "Google login failed",
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account exists, a reset link has been sent",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetLink = `${clientUrl}/reset-password/${resetToken}`;

    queueEmail({
      to: user.email,
      subject: "Forgot Password",
      text: `Hi ${user.name},\n\nWe received a request to reset your AgroVision password.\n\nReset your password using this link:\n${resetLink}\n\nThis link will expire in 1 hour.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2 style="margin-bottom: 16px;">Forgot Password</h2>
          <p>Hi ${user.name},</p>
          <p>We received a request to reset your AgroVision password.</p>
          <p><a href="${resetLink}" style="color: #15803d; font-weight: 600;">Reset your password</a></p>
          <p>This link will expire in 1 hour.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "If an account exists, a reset link has been sent",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process password reset request",
    });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or has expired",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = "";
    user.resetPasswordExpires = null;
    await user.save();

    queueEmail({
      to: user.email,
      subject: "Password Reset Successful",
      text: `Hi ${user.name},\n\nYour AgroVision password was updated successfully. If this wasn't you, please contact support immediately.`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
          <h2 style="margin-bottom: 16px;">Password Reset Successful</h2>
          <p>Hi ${user.name},</p>
          <p>Your AgroVision password was updated successfully.</p>
          <p>If this wasn't you, please contact support immediately.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to reset password",
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete account",
    });
  }
};
