const APPLICATION_STATUS_LABELS = {
  NEW: "Mới",
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  SUPPLEMENT_REQUIRED: "Cần bổ sung",
  REJECTED: "Từ chối"
};

const ACCOUNT_STATUS_LABELS = {
  ACTIVE: "Hoạt động",
  INACTIVE: "Ngừng hoạt động",
  LOCKED: "Đã khóa"
};

export const APPLICATION_STATUS_OPTIONS = Object.entries(APPLICATION_STATUS_LABELS).map(
  ([value, label]) => ({
    value,
    label
  })
);

export function getApplicationStatusLabel(status) {
  return APPLICATION_STATUS_LABELS[status] || status || "-";
}

export function getAccountStatusLabel(status) {
  return ACCOUNT_STATUS_LABELS[status] || status || "-";
}
