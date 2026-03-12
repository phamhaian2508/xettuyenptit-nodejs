export function mapUserRow(row) {
  return {
    id: row.id,
    userName: row.username,
    email: row.email,
    middleName: row.middle_name,
    firstName: row.first_name,
    fullName: `${row.middle_name || ""} ${row.first_name || ""}`.trim() || row.username,
    phone: row.phone,
    gender: row.gender,
    dateOfBirth: row.date_of_birth,
    identityNumber: row.identity_number,
    identityIssueDate: row.identity_issue_date,
    identityIssuePlace: row.identity_issue_place,
    permanentProvince: row.permanent_province,
    permanentDistrict: row.permanent_district,
    permanentWard: row.permanent_ward,
    permanentAddress: row.permanent_address,
    status: row.status,
    roles: row.roles ? row.roles.split(",").filter(Boolean) : []
  };
}
