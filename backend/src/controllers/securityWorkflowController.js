import {
  bootstrapRootAccess,
  getInternalReviewReport,
  getRootConsole,
  importApplicationDocumentFromUrl,
  listApplicationDocuments,
  runSupportRecoveryPrecheck,
  uploadApplicationDocument
} from "../services/securityWorkflowService.js";

export async function supportRecoveryPrecheckController(req, res, next) {
  try {
    const data = await runSupportRecoveryPrecheck(req.query);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function listApplicationDocumentsController(req, res, next) {
  try {
    const data = await listApplicationDocuments(req.params.id, req.user);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function uploadApplicationDocumentController(req, res, next) {
  try {
    const data = await uploadApplicationDocument(req.params.id, req.body, req.user);
    res.json({
      message: "upload_success",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function importApplicationDocumentFromUrlController(req, res, next) {
  try {
    const data = await importApplicationDocumentFromUrl(req.params.id, req.body, req.user);
    res.json({
      message: "import_success",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function getInternalReviewReportController(_req, res, next) {
  try {
    const data = await getInternalReviewReport();
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

export async function bootstrapRootAccessController(req, res, next) {
  try {
    const data = await bootstrapRootAccess(req.user, req.body);
    res.json({
      message: "bootstrap_success",
      data
    });
  } catch (error) {
    next(error);
  }
}

export async function getRootConsoleController(req, res, next) {
  try {
    const data = await getRootConsole(req.user);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}
