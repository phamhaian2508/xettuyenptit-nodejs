import {
  exportApplicationsCsv,
  exportCandidatesCsv,
  getAdminDashboardSummary,
  getApplicationDetail,
  getCandidateDetail,
  listApplications,
  listCandidates,
  updateApplicationStatus
} from "../services/adminService.js";

export async function getDashboardSummaryController(_req, res, next) {
  try {
    const data = await getAdminDashboardSummary();
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function listApplicationsController(req, res, next) {
  try {
    const data = await listApplications(req.query);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function getApplicationDetailController(req, res, next) {
  try {
    const data = await getApplicationDetail(req.params.id);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function updateApplicationStatusController(req, res, next) {
  try {
    const data = await updateApplicationStatus(req.params.id, req.body, req.user);
    res.json({
      message: "update_success",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function listCandidatesController(req, res, next) {
  try {
    const data = await listCandidates(req.query);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function getCandidateDetailController(req, res, next) {
  try {
    const data = await getCandidateDetail(req.params.id);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function exportApplicationsController(req, res, next) {
  try {
    const csv = await exportApplicationsCsv(req.query, req.user);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="applications.csv"');
    res.send(csv);
  } catch (error) {
    next(error);
  }
}

export async function exportCandidatesController(req, res, next) {
  try {
    const csv = await exportCandidatesCsv(req.query, req.user);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", 'attachment; filename="candidates.csv"');
    res.send(csv);
  } catch (error) {
    next(error);
  }
}
