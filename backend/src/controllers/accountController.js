import {
  getAccountProfile,
  updateAccountPassword,
  updateAccountProfile
} from "../services/accountService.js";

export async function getProfileController(req, res, next) {
  try {
    const profile = await getAccountProfile(req.user.id);
    res.json({ data: profile });
  } catch (error) {
    next(error);
  }
}

export async function updateProfileController(req, res, next) {
  try {
    const profile = await updateAccountProfile(req.user.id, {
      ...req.body,
      modifiedBy: req.user.userName
    });
    res.json({
      message: "update_success",
      data: profile
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePasswordController(req, res, next) {
  try {
    const result = await updateAccountPassword(req.user.id, {
      ...req.body,
      modifiedBy: req.user.userName
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}
