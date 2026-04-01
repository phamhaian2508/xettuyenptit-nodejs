import {
  getAdmissionPeriods,
  getGuidesForUser,
  getMajors,
  getMyApplications,
  getNotificationsForUser
} from "../services/studentService.js";

export async function getGuidesController(req, res, next) {
  try {
    const data = await getGuidesForUser(req.user);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function getNotificationsController(req, res, next) {
  try {
    const data = await getNotificationsForUser(req.user.id);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function getAdmissionPeriodsController(req, res, next) {
  try {
    const data = await getAdmissionPeriods(req.query.namTuyenSinh);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function getMajorsController(req, res, next) {
  try {
    const data = await getMajors();
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function getMyApplicationsController(req, res, next) {
  try {
    const data = await getMyApplications(req.user);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}
