import { login } from "../services/authService.js";

export async function loginController(req, res, next) {
  try {
    const { username, password } = req.body;
    const result = await login(username, password);
    res.json({
      message: "login_success",
      data: result
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
