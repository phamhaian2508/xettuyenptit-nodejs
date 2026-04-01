function formatDate(value) {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
}

export function mapUserRow(row) {
  const roles = row.roles ? row.roles.split(",").filter(Boolean) : [];

  return {
    id: row.id,
    userName: row.username,
    fullName: row.full_name || row.username,
    middleName: row.middle_name,
    firstName: row.first_name,
    email: row.email,
    phone: row.phone,
    gender: row.gender,
    dateOfBirth: formatDate(row.date_of_birth),
    identityNumber: row.identity_number,
    identityIssueDate: formatDate(row.identity_issue_date),
    identityIssuePlace: row.identity_issue_place,
    permanentProvinceCode: row.permanent_province_code,
    permanentProvinceName: row.permanent_province_name,
    permanentDistrictCode: row.permanent_district_code,
    permanentDistrictName: row.permanent_district_name,
    permanentWardCode: row.permanent_ward_code,
    permanentWardName: row.permanent_ward_name,
    permanentAddress: row.permanent_address,
    contactProvinceCode: row.contact_province_code,
    contactProvinceName: row.contact_province_name,
    contactDistrictCode: row.contact_district_code,
    contactDistrictName: row.contact_district_name,
    contactWardCode: row.contact_ward_code,
    contactWardName: row.contact_ward_name,
    contactAddress: row.contact_address,
    householdRegistration: row.household_registration,
    status: row.account_status,
    isDefaultPassword: Boolean(row.is_default_password),
    roles,
    isAdmin: roles.includes("ADMIN"),
    candidateId: row.candidate_id || null,
    candidateCode: row.candidate_code || null
  };
}
