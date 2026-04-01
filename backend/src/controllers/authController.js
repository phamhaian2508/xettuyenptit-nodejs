import { clearAuthCookie, setAuthCookie } from "../middleware/security.js";
import { login } from "../services/authService.js";
import { requiredText } from "../utils/validation.js";

export async function loginController(req, res, next) {
  try {
    const username = requiredText(req.body?.username, "Tên đăng nhập", { max: 100 });
    const password = requiredText(req.body?.password, "Mật khẩu", { max: 200 });
    const result = await login(username, password);
    setAuthCookie(res, result.token);
    res.json({
      message: "login_success",
      data: {
        user: result.user
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function meController(req, res) {
  res.json({
    data: req.user
  });
}

export async function logoutController(_req, res) {
  clearAuthCookie(res);
  res.json({
    message: "logout_success"
  });
}
