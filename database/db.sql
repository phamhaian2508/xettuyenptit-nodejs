DROP DATABASE IF EXISTS xettuyenptitnodejs;
CREATE DATABASE xettuyenptitnodejs CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE xettuyenptitnodejs;
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE roles (
  id BIGINT NOT NULL AUTO_INCREMENT,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_roles_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE users (
  id BIGINT NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  account_status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
  is_default_password TINYINT(1) NOT NULL DEFAULT 1,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_users_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_roles (
  user_id BIGINT NOT NULL,
  role_id BIGINT NOT NULL,
  assigned_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, role_id),
  CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id) REFERENCES roles (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE user_profiles (
  user_id BIGINT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  middle_name VARCHAR(100) NULL,
  first_name VARCHAR(100) NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(20) NULL,
  gender VARCHAR(30) NULL,
  date_of_birth DATE NULL,
  identity_number VARCHAR(30) NULL,
  identity_issue_date DATE NULL,
  identity_issue_place VARCHAR(255) NULL,
  permanent_province_code VARCHAR(30) NULL,
  permanent_province_name VARCHAR(255) NULL,
  permanent_district_code VARCHAR(30) NULL,
  permanent_district_name VARCHAR(255) NULL,
  permanent_ward_code VARCHAR(30) NULL,
  permanent_ward_name VARCHAR(255) NULL,
  permanent_address VARCHAR(500) NULL,
  contact_province_code VARCHAR(30) NULL,
  contact_province_name VARCHAR(255) NULL,
  contact_district_code VARCHAR(30) NULL,
  contact_district_name VARCHAR(255) NULL,
  contact_ward_code VARCHAR(30) NULL,
  contact_ward_name VARCHAR(255) NULL,
  contact_address VARCHAR(500) NULL,
  household_registration VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id),
  UNIQUE KEY uk_user_profiles_email (email),
  UNIQUE KEY uk_user_profiles_identity_number (identity_number),
  CONSTRAINT fk_user_profiles_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE administrative_units (
  id BIGINT NOT NULL AUTO_INCREMENT,
  external_id VARCHAR(50) NULL,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  unit_level VARCHAR(20) NOT NULL,
  parent_code VARCHAR(50) NULL,
  source VARCHAR(50) NOT NULL DEFAULT 'ptit_api',
  cached_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_administrative_units_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE candidates (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NOT NULL,
  candidate_code VARCHAR(50) NOT NULL,
  graduation_year INT NULL,
  high_school_name VARCHAR(255) NULL,
  note TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_candidates_user_id (user_id),
  UNIQUE KEY uk_candidates_candidate_code (candidate_code),
  CONSTRAINT fk_candidates_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE admission_periods (
  id BIGINT NOT NULL AUTO_INCREMENT,
  admission_year INT NOT NULL,
  code VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  start_at DATETIME NOT NULL,
  end_at DATETIME NOT NULL,
  status VARCHAR(30) NOT NULL,
  description TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_admission_periods_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE majors (
  id BIGINT NOT NULL AUTO_INCREMENT,
  major_code VARCHAR(50) NOT NULL,
  major_name VARCHAR(255) NOT NULL,
  specialization_code VARCHAR(50) NULL,
  specialization_name VARCHAR(255) NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_majors_major_specialization (major_code, specialization_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE application_guides (
  id BIGINT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  target_role VARCHAR(30) NOT NULL DEFAULT 'CANDIDATE',
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE notifications (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  notification_type VARCHAR(30) NOT NULL DEFAULT 'SYSTEM',
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE admission_applications (
  id BIGINT NOT NULL AUTO_INCREMENT,
  application_code VARCHAR(50) NOT NULL,
  candidate_id BIGINT NOT NULL,
  admission_year INT NOT NULL,
  admission_period_id BIGINT NOT NULL,
  major_id BIGINT NOT NULL,
  combination_code VARCHAR(20) NOT NULL,
  application_score DECIMAL(5,2) NOT NULL DEFAULT 0,
  status VARCHAR(30) NOT NULL DEFAULT 'NEW',
  note TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_admission_applications_code (application_code),
  CONSTRAINT fk_admission_applications_candidate FOREIGN KEY (candidate_id) REFERENCES candidates (id) ON DELETE CASCADE,
  CONSTRAINT fk_admission_applications_period FOREIGN KEY (admission_period_id) REFERENCES admission_periods (id),
  CONSTRAINT fk_admission_applications_major FOREIGN KEY (major_id) REFERENCES majors (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE audit_logs (
  id BIGINT NOT NULL AUTO_INCREMENT,
  user_id BIGINT NULL,
  action_code VARCHAR(100) NOT NULL,
  action_name VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100) NULL,
  entity_id VARCHAR(100) NULL,
  metadata_json LONGTEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_audit_logs_entity (entity_type, entity_id),
  CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE support_recovery_requests (
  id BIGINT NOT NULL AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  recovery_channel VARCHAR(50) NOT NULL,
  contact_email VARCHAR(255) NOT NULL,
  temporary_password VARCHAR(100) NOT NULL,
  lookup_reference VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
  notes TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_support_recovery_requests_lookup_reference (lookup_reference),
  KEY idx_support_recovery_requests_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE application_documents (
  id BIGINT NOT NULL AUTO_INCREMENT,
  application_id BIGINT NOT NULL,
  uploaded_by BIGINT NOT NULL,
  source_type VARCHAR(20) NOT NULL DEFAULT 'UPLOAD',
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(120) NULL,
  storage_key VARCHAR(255) NOT NULL,
  file_size_bytes INT NOT NULL DEFAULT 0,
  preview_text TEXT NULL,
  source_url VARCHAR(500) NULL,
  processing_status VARCHAR(30) NOT NULL DEFAULT 'STORED',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_application_documents_storage_key (storage_key),
  CONSTRAINT fk_application_documents_application FOREIGN KEY (application_id) REFERENCES admission_applications (id) ON DELETE CASCADE,
  CONSTRAINT fk_application_documents_user FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE internal_service_tokens (
  id BIGINT NOT NULL AUTO_INCREMENT,
  service_code VARCHAR(100) NOT NULL,
  access_token VARCHAR(255) NOT NULL,
  note VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_internal_service_tokens_service_code (service_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO roles (code, name, description) VALUES
('ADMIN', 'Quản trị viên', 'Quản trị viên hệ thống'),
('CANDIDATE', 'Thí sinh', 'Tài khoản thí sinh xét tuyển');

INSERT INTO roles (code, name, description) VALUES
('ROOT', 'Root Console', 'Quyen root trong ung dung de phuc vu kiem thu');

INSERT INTO users (username, password_hash, account_status, is_default_password) VALUES
('nguyentuan', '{bcrypt}$2b$10$4guEdicLDYGgOOiDumweYeMBicfwPqvMY9FsVXxUKU16a4mPA4NMC', 'ACTIVE', 1),
('037204009101', '{bcrypt}$2b$10$RdiqUBlLI15bvSn8dfg1ZuRthUarKnKFbcFjK1ACdnJinvzi8tPM.', 'ACTIVE', 1),
('037204009102', '{bcrypt}$2b$10$E.xdL7pvY6ehvxXbhJdIyuhl3S6D.vPckNujiOxsPoqaaR2eNQJjG', 'ACTIVE', 1),
('037204009103', '{bcrypt}$2b$10$nMr.LUSYcKIWRK5yJcEh1uheOEkXTBo.ca.KYYOuziHc8AicCKt22', 'ACTIVE', 1),
('037204009104', '{bcrypt}$2b$10$QvFLehDENeHV14W0iJEDteeN/NOEWgBpKigwSj6EBzfsWxiIYw986', 'ACTIVE', 1),
('037204009105', '{bcrypt}$2b$10$N2EezIR/p/nmgZ7vnGj1UOGZAKVSh3UTXXnkwIFQC0JDZ5tXLAHrq', 'ACTIVE', 1),
('037204009106', '{bcrypt}$2b$10$rep8WogV3hxm/cy1RWO1xezSm7bkMuKhmTWgCixlIWVKE9OSPldWu', 'ACTIVE', 1),
('037204009107', '{bcrypt}$2b$10$noIqGg4Y5XuEH15IJV84j.vnktppHaWU1ioQrIuAf/iGJ2cuLbNkG', 'ACTIVE', 1),
('037204009108', '{bcrypt}$2b$10$Hw.fEwaJD8zpLGLCvylIVO0Tt9qfapLW1Gu6S7sx0G0mwh3O1JkuK', 'ACTIVE', 1),
('037204009109', '{bcrypt}$2b$10$U.2k4vg9QIVUbQFNcCAJHOJvxTDNwBgALJCwzjGdVJJBX7FEJorMS', 'ACTIVE', 1),
('037204009110', '{bcrypt}$2b$10$9i5rhyUHY0pYo/t2oYULQeaY22rWpAeNgafyzo6yR2s.Fp9oyQG2i', 'ACTIVE', 1),
('037204009150', '{noop}Portal!2026Support', 'ACTIVE', 0);

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.code = 'ADMIN'
WHERE u.username = 'nguyentuan';

INSERT INTO user_roles (user_id, role_id)
SELECT u.id, r.id
FROM users u
JOIN roles r ON r.code = 'CANDIDATE'
WHERE u.username IN (
  '037204009101',
  '037204009102',
  '037204009103',
  '037204009104',
  '037204009105',
  '037204009106',
  '037204009107',
  '037204009108',
  '037204009109',
  '037204009110',
  '037204009150'
);

INSERT INTO user_profiles (
  user_id, full_name, middle_name, first_name, email, phone, gender, date_of_birth,
  identity_number, identity_issue_date, identity_issue_place,
  permanent_province_code, permanent_province_name,
  permanent_district_code, permanent_district_name,
  permanent_ward_code, permanent_ward_name,
  permanent_address, contact_province_code, contact_province_name,
  contact_district_code, contact_district_name,
  contact_ward_code, contact_ward_name,
  contact_address, household_registration
) VALUES
((SELECT id FROM users WHERE username = 'nguyentuan'), 'Nguyễn Tuấn', 'Nguyễn', 'Tuấn', 'nguyentuan@ptit.edu.vn', '0988000001', 'Nam', '1990-09-15', '011199000001', '2015-01-20', 'Hà Nội', '01', 'Hà Nội', '001', 'Cầu Giấy', '00001', 'Dịch Vọng Hậu', '122 Hoàng Quốc Việt', '01', 'Hà Nội', '001', 'Cầu Giấy', '00001', 'Dịch Vọng Hậu', '122 Hoàng Quốc Việt', 'Hà Nội'),
((SELECT id FROM users WHERE username = '037204009101'), 'Nguyễn Minh Anh', 'Nguyễn Minh', 'Anh', 'minhanh01@example.com', '0901111101', 'Nữ', '2007-01-01', '037204009101', '2022-05-01', 'Hà Nội', '01', 'Hà Nội', '268', 'Nam Từ Liêm', '09520', 'Mỹ Đình 1', 'Số 12 đường Lê Đức Thọ', '01', 'Hà Nội', '268', 'Nam Từ Liêm', '09520', 'Mỹ Đình 1', 'Số 12 đường Lê Đức Thọ', 'Hà Nội'),
((SELECT id FROM users WHERE username = '037204009102'), 'Trần Quốc Bảo', 'Trần Quốc', 'Bảo', 'quocbao02@example.com', '0901111102', 'Nam', '2007-03-12', '037204009102', '2022-04-14', 'Hải Phòng', '31', 'Hải Phòng', '303', 'Ngô Quyền', '11311', 'Lạch Tray', 'Số 8 Lạch Tray', '31', 'Hải Phòng', '303', 'Ngô Quyền', '11311', 'Lạch Tray', 'Số 8 Lạch Tray', 'Hải Phòng'),
((SELECT id FROM users WHERE username = '037204009103'), 'Lê Thu Hà', 'Lê Thu', 'Hà', 'thuha03@example.com', '0901111103', 'Nữ', '2007-06-25', '037204009103', '2022-07-09', 'Nam Định', '36', 'Nam Định', '356', 'Nam Định', '13624', 'Lộc Hạ', 'Ngõ 25 Trần Hưng Đạo', '36', 'Nam Định', '356', 'Nam Định', '13624', 'Lộc Hạ', 'Ngõ 25 Trần Hưng Đạo', 'Nam Định'),
((SELECT id FROM users WHERE username = '037204009104'), 'Phạm Đức Long', 'Phạm Đức', 'Long', 'duclong04@example.com', '0901111104', 'Nam', '2006-11-11', '037204009104', '2021-12-18', 'Thanh Hóa', '38', 'Thanh Hóa', '381', 'Thanh Hóa', '14656', 'Đông Vệ', 'Số 34 Trần Phú', '38', 'Thanh Hóa', '381', 'Thanh Hóa', '14656', 'Đông Vệ', 'Số 34 Trần Phú', 'Thanh Hóa'),
((SELECT id FROM users WHERE username = '037204009105'), 'Bùi Gia Hân', 'Bùi Gia', 'Hân', 'giahan05@example.com', '0901111105', 'Nữ', '2007-02-19', '037204009105', '2022-03-20', 'Nghệ An', '40', 'Nghệ An', '412', 'Vinh', '16534', 'Hưng Dũng', 'Số 88 Nguyễn Sỹ Sách', '40', 'Nghệ An', '412', 'Vinh', '16534', 'Hưng Dũng', 'Số 88 Nguyễn Sỹ Sách', 'Nghệ An'),
((SELECT id FROM users WHERE username = '037204009106'), 'Đoàn Thành Nam', 'Đoàn Thành', 'Nam', 'thanhnam06@example.com', '0901111106', 'Nam', '2007-04-14', '037204009106', '2022-06-30', 'Đà Nẵng', '48', 'Đà Nẵng', '490', 'Hải Châu', '20194', 'Hòa Cường Bắc', 'Số 19 đường 2/9', '48', 'Đà Nẵng', '490', 'Hải Châu', '20194', 'Hòa Cường Bắc', 'Số 19 đường 2/9', 'Đà Nẵng'),
((SELECT id FROM users WHERE username = '037204009107'), 'Võ Hoàng Mai', 'Võ Hoàng', 'Mai', 'hoangmai07@example.com', '0901111107', 'Nữ', '2006-09-09', '037204009107', '2021-11-15', 'Khánh Hòa', '56', 'Khánh Hòa', '568', 'Nha Trang', '22345', 'Lộc Thọ', 'Số 7 Trần Phú', '56', 'Khánh Hòa', '568', 'Nha Trang', '22345', 'Lộc Thọ', 'Số 7 Trần Phú', 'Khánh Hòa'),
((SELECT id FROM users WHERE username = '037204009108'), 'Nguyễn Hữu Đạt', 'Nguyễn Hữu', 'Đạt', 'huudat08@example.com', '0901111108', 'Nam', '2007-01-30', '037204009108', '2022-01-05', 'Lâm Đồng', '68', 'Lâm Đồng', '672', 'Đà Lạt', '24826', 'Phường 1', 'Số 20 Trần Hưng Đạo', '68', 'Lâm Đồng', '672', 'Đà Lạt', '24826', 'Phường 1', 'Số 20 Trần Hưng Đạo', 'Lâm Đồng'),
((SELECT id FROM users WHERE username = '037204009109'), 'Trương Quỳnh Như', 'Trương Quỳnh', 'Như', 'quynhnhu09@example.com', '0901111109', 'Nữ', '2006-07-17', '037204009109', '2021-09-30', 'TP.HCM', '79', 'TP Hồ Chí Minh', '760', 'Quận 1', '26734', 'Bến Nghé', 'Số 5 Lê Lợi', '79', 'TP Hồ Chí Minh', '760', 'Quận 1', '26734', 'Bến Nghé', 'Số 5 Lê Lợi', 'TP Hồ Chí Minh'),
((SELECT id FROM users WHERE username = '037204009110'), 'Phạm Tiến Dũng', 'Phạm Tiến', 'Dũng', 'tiendung10@example.com', '0901111110', 'Nam', '2007-10-05', '037204009110', '2022-08-12', 'Cần Thơ', '92', 'Cần Thơ', '916', 'Ninh Kiều', '31165', 'An Hòa', 'Số 14 Cách Mạng Tháng 8', '92', 'Cần Thơ', '916', 'Ninh Kiều', '31165', 'An Hòa', 'Số 14 Cách Mạng Tháng 8', 'Cần Thơ'),
((SELECT id FROM users WHERE username = '037204009150'), 'Support Candidate', 'Support', 'Candidate', 'support.candidate@example.local', '0901111150', 'Nam', '2007-09-15', '037204009150', '2022-09-20', 'Ha Noi', '01', 'Ha Noi', '001', 'Cau Giay', '00001', 'Dich Vong Hau', '122 Hoang Quoc Viet', '01', 'Ha Noi', '001', 'Cau Giay', '00001', 'Dich Vong Hau', '122 Hoang Quoc Viet', 'Ha Noi');

INSERT INTO administrative_units (external_id, code, name, unit_level, parent_code) VALUES
('01', '01', 'Hà Nội', 'PROVINCE', NULL),
('31', '31', 'Hải Phòng', 'PROVINCE', NULL),
('79', '79', 'TP Hồ Chí Minh', 'PROVINCE', NULL),
('001', '001', 'Cầu Giấy', 'DISTRICT', '01'),
('268', '268', 'Nam Từ Liêm', 'DISTRICT', '01'),
('760', '760', 'Quận 1', 'DISTRICT', '79'),
('00001', '00001', 'Dịch Vọng Hậu', 'WARD', '001'),
('09520', '09520', 'Mỹ Đình 1', 'WARD', '268'),
('26734', '26734', 'Bến Nghé', 'WARD', '760');

INSERT INTO candidates (user_id, candidate_code, graduation_year, high_school_name, note) VALUES
((SELECT id FROM users WHERE username = '037204009101'), 'TS2025001', 2025, 'THPT Mỹ Đình', 'Thí sinh có nguyện vọng vào CNTT'),
((SELECT id FROM users WHERE username = '037204009102'), 'TS2025002', 2025, 'THPT Ngô Quyền', NULL),
((SELECT id FROM users WHERE username = '037204009103'), 'TS2025003', 2025, 'THPT Lê Hồng Phong', NULL),
((SELECT id FROM users WHERE username = '037204009104'), 'TS2025004', 2024, 'THPT Hàm Rồng', 'Thí sinh tự do'),
((SELECT id FROM users WHERE username = '037204009105'), 'TS2025005', 2025, 'THPT Chuyên Phan Bội Châu', NULL),
((SELECT id FROM users WHERE username = '037204009106'), 'TS2025006', 2025, 'THPT Phan Châu Trinh', NULL),
((SELECT id FROM users WHERE username = '037204009107'), 'TS2025007', 2024, 'THPT Lý Tự Trọng', 'Hồ sơ cần bổ sung học bạ'),
((SELECT id FROM users WHERE username = '037204009108'), 'TS2025008', 2025, 'THPT Bùi Thị Xuân', NULL),
((SELECT id FROM users WHERE username = '037204009109'), 'TS2025009', 2024, 'THPT Lê Quý Đôn', NULL),
((SELECT id FROM users WHERE username = '037204009110'), 'TS2025010', 2025, 'THPT Châu Văn Liêm', NULL),
((SELECT id FROM users WHERE username = '037204009150'), 'TS2026BS01', 2025, 'THPT Demo Support', 'Tai khoan bo sung minh chung');

INSERT INTO admission_periods (admission_year, code, name, start_at, end_at, status, description) VALUES
(2025, 'DOT2025-01', 'Đợt xét tuyển sớm 2025', '2025-03-01 00:00:00', '2025-05-31 23:59:59', 'CLOSED', 'Đợt nhận hồ sơ sớm'),
(2025, 'DOT2025-02', 'Đợt xét tuyển chính 2025', '2025-06-01 00:00:00', '2025-09-15 23:59:59', 'OPEN', 'Đợt xét tuyển chính thức'),
(2026, 'DOT2026-01', 'Đợt xét tuyển dự kiến 2026', '2026-02-01 00:00:00', '2026-04-30 23:59:59', 'UPCOMING', 'Đợt dự kiến phục vụ demo');

INSERT INTO majors (major_code, major_name, specialization_code, specialization_name, is_active, sort_order) VALUES
('7480201', 'Công nghệ thông tin', 'UDU', 'Cử nhân định hướng ứng dụng', 1, 1),
('7480201', 'Công nghệ thông tin', 'CLC', 'Chất lượng cao', 1, 2),
('7480101', 'Khoa học máy tính', 'DS', 'Khoa học dữ liệu', 1, 3),
('7480102', 'Mạng máy tính và truyền thông dữ liệu', 'KTDL', 'Kỹ thuật dữ liệu', 1, 4),
('7520207', 'Kỹ thuật điện tử viễn thông', NULL, NULL, 1, 5),
('7340301', 'Kế toán', 'ACCA', 'Chất lượng cao ACCA', 1, 6);

INSERT INTO application_guides (title, content, target_role, is_active) VALUES
('Hướng dẫn tạo hồ sơ', 'Bước 1: Cập nhật thông tin cá nhân. Bước 2: Chọn đợt tuyển sinh. Bước 3: Kiểm tra điểm và nộp hồ sơ.', 'CANDIDATE', 1),
('Hướng dẫn bổ sung giấy tờ', 'Khi hồ sơ ở trạng thái yêu cầu bổ sung, thí sinh đăng nhập và cập nhật thông tin trong thời hạn quy định.', 'CANDIDATE', 1),
('Thông tin vận hành admin', 'Admin có thể xem tổng quan, cập nhật trạng thái hồ sơ và xuất CSV theo bộ lọc hiện tại.', 'ADMIN', 1);

INSERT INTO notifications (user_id, title, content, notification_type, is_read) VALUES
(NULL, 'Thông báo hệ thống', 'Hệ thống xét tuyển mở cửa tiếp nhận hồ sơ đợt chính 2025.', 'SYSTEM', 0),
((SELECT id FROM users WHERE username = '037204009101'), 'Nhắc nhở hoàn thiện hồ sơ', 'Vui lòng kiểm tra và bổ sung minh chứng học bạ trước 15/06/2025.', 'PERSONAL', 0),
((SELECT id FROM users WHERE username = '037204009107'), 'Cần bổ sung giấy tờ', 'Hồ sơ của bạn đang ở trạng thái yêu cầu bổ sung. Vui lòng cập nhật sớm.', 'PERSONAL', 0),
((SELECT id FROM users WHERE username = 'nguyentuan'), 'Tài khoản admin sẵn sàng', 'Tài khoản admin mặc định đã được khởi tạo cho môi trường demo.', 'PERSONAL', 1);

INSERT INTO admission_applications (
  application_code, candidate_id, admission_year, admission_period_id, major_id,
  combination_code, application_score, status, note, created_at, updated_at
) VALUES
('HS2025001', (SELECT id FROM candidates WHERE candidate_code = 'TS2025001'), 2025, (SELECT id FROM admission_periods WHERE code = 'DOT2025-02'), (SELECT id FROM majors WHERE major_code = '7480201' AND specialization_code = 'UDU'), 'A00', 27.50, 'NEW', 'Mới tạo hồ sơ trên hệ thống', '2025-06-05 08:00:00', '2025-06-05 08:00:00'),
('HS2025002', (SELECT id FROM candidates WHERE candidate_code = 'TS2025002'), 2025, (SELECT id FROM admission_periods WHERE code = 'DOT2025-02'), (SELECT id FROM majors WHERE major_code = '7480101' AND specialization_code = 'DS'), 'A01', 26.10, 'PENDING', 'Đang chờ cán bộ kiểm tra', '2025-06-06 09:15:00', '2025-06-08 10:30:00'),
('HS2025003', (SELECT id FROM candidates WHERE candidate_code = 'TS2025003'), 2025, (SELECT id FROM admission_periods WHERE code = 'DOT2025-01'), (SELECT id FROM majors WHERE major_code = '7480201' AND specialization_code = 'CLC'), 'D01', 28.20, 'APPROVED', 'Hồ sơ đã duyệt', '2025-04-10 10:00:00', '2025-04-20 15:45:00'),
('HS2025004', (SELECT id FROM candidates WHERE candidate_code = 'TS2025004'), 2025, (SELECT id FROM admission_periods WHERE code = 'DOT2025-02'), (SELECT id FROM majors WHERE major_code = '7520207' AND specialization_code IS NULL), 'A00', 24.75, 'SUPPLEMENT_REQUIRED', 'Thiếu minh chứng ưu tiên', '2025-06-11 11:10:00', '2025-06-15 08:00:00'),
('HS2025005', (SELECT id FROM candidates WHERE candidate_code = 'TS2025005'), 2025, (SELECT id FROM admission_periods WHERE code = 'DOT2025-02'), (SELECT id FROM majors WHERE major_code = '7480201' AND specialization_code = 'CLC'), 'A01', 28.90, 'APPROVED', 'Đạt ngưỡng xét tuyển', '2025-06-12 08:30:00', '2025-06-20 13:00:00'),
('HS2025006', (SELECT id FROM candidates WHERE candidate_code = 'TS2025006'), 2025, (SELECT id FROM admission_periods WHERE code = 'DOT2025-02'), (SELECT id FROM majors WHERE major_code = '7480102' AND specialization_code = 'KTDL'), 'A00', 25.40, 'PENDING', 'Cần đối soát điểm học bạ', '2025-06-12 14:00:00', '2025-06-18 10:15:00'),
('HS2025007', (SELECT id FROM candidates WHERE candidate_code = 'TS2025007'), 2025, (SELECT id FROM admission_periods WHERE code = 'DOT2025-01'), (SELECT id FROM majors WHERE major_code = '7340301' AND specialization_code = 'ACCA'), 'D01', 23.30, 'REJECTED', 'Không đạt ngưỡng tối thiểu', '2025-03-21 07:45:00', '2025-04-05 16:00:00'),
('HS2025008', (SELECT id FROM candidates WHERE candidate_code = 'TS2025008'), 2025, (SELECT id FROM admission_periods WHERE code = 'DOT2025-02'), (SELECT id FROM majors WHERE major_code = '7480201' AND specialization_code = 'UDU'), 'D01', 26.80, 'NEW', 'Đang chờ thí sinh xác nhận', '2025-06-14 16:20:00', '2025-06-14 16:20:00'),
('HS2025009', (SELECT id FROM candidates WHERE candidate_code = 'TS2025009'), 2025, (SELECT id FROM admission_periods WHERE code = 'DOT2025-02'), (SELECT id FROM majors WHERE major_code = '7480201' AND specialization_code = 'CLC'), 'A01', 27.10, 'PENDING', 'Chờ đối soát khu vực ưu tiên', '2025-06-15 09:00:00', '2025-06-16 11:00:00'),
('HS2025010', (SELECT id FROM candidates WHERE candidate_code = 'TS2025010'), 2025, (SELECT id FROM admission_periods WHERE code = 'DOT2025-02'), (SELECT id FROM majors WHERE major_code = '7520207' AND specialization_code IS NULL), 'A00', 22.70, 'SUPPLEMENT_REQUIRED', 'Cần bổ sung học bạ kỳ 2', '2025-06-16 13:00:00', '2025-06-18 08:45:00'),
('HS2025011', (SELECT id FROM candidates WHERE candidate_code = 'TS2025001'), 2025, (SELECT id FROM admission_periods WHERE code = 'DOT2025-01'), (SELECT id FROM majors WHERE major_code = '7480101' AND specialization_code = 'DS'), 'A01', 27.10, 'APPROVED', 'Hồ sơ lịch sử của thí sinh TS2025001', '2025-03-15 09:30:00', '2025-03-25 17:00:00'),
('HS2025012', (SELECT id FROM candidates WHERE candidate_code = 'TS2025004'), 2025, (SELECT id FROM admission_periods WHERE code = 'DOT2025-01'), (SELECT id FROM majors WHERE major_code = '7340301' AND specialization_code = 'ACCA'), 'D01', 24.10, 'PENDING', 'Hồ sơ lịch sử đợt sớm', '2025-04-02 08:20:00', '2025-04-06 12:10:00');

INSERT INTO audit_logs (user_id, action_code, action_name, entity_type, entity_id, metadata_json, created_at) VALUES
((SELECT id FROM users WHERE username = 'nguyentuan'), 'ADMIN_LOGIN', 'Đăng nhập admin', 'USER', (SELECT CAST(id AS CHAR) FROM users WHERE username = 'nguyentuan'), '{"source":"seed"}', '2025-06-01 08:00:00'),
((SELECT id FROM users WHERE username = 'nguyentuan'), 'APPLICATION_STATUS_UPDATE', 'Cập nhật trạng thái hồ sơ', 'ADMISSION_APPLICATION', (SELECT CAST(id AS CHAR) FROM admission_applications WHERE application_code = 'HS2025004'), '{"from":"PENDING","to":"SUPPLEMENT_REQUIRED"}', '2025-06-15 08:00:00'),
((SELECT id FROM users WHERE username = '037204009107'), 'PASSWORD_CHANGE', 'Đổi mật khẩu', 'USER', (SELECT CAST(id AS CHAR) FROM users WHERE username = '037204009107'), '{"source":"seed-demo"}', '2025-06-10 09:45:00');
INSERT INTO admission_applications (
  application_code, candidate_id, admission_year, admission_period_id, major_id,
  combination_code, application_score, status, note, created_at, updated_at
) VALUES
('HS2026BS01', (SELECT id FROM candidates WHERE candidate_code = 'TS2026BS01'), 2025, (SELECT id FROM admission_periods WHERE code = 'DOT2025-02'), (SELECT id FROM majors WHERE major_code = '7480201' AND specialization_code = 'UDU'), 'A01', 25.60, 'SUPPLEMENT_REQUIRED', 'Bo sung minh chung hoc ba qua cong tai tep', '2025-06-20 08:00:00', '2025-06-20 08:00:00');

INSERT INTO support_recovery_requests (
  username,
  recovery_channel,
  contact_email,
  temporary_password,
  lookup_reference,
  status,
  notes
) VALUES
('037204009150', 'LEGACY_HELPDESK', 'bo-sung-hoso@ptit-demo.local', 'Portal!2026Support', 'SUPPORT-REF-2026-041', 'OPEN', 'Legacy helpdesk entry used for the support recovery flow.');

INSERT INTO internal_service_tokens (service_code, access_token, note) VALUES
('INTERNAL_REVIEW', 'OPS-ROOT-2026-5481', 'Token enumerate duoc tu internal review report va dung cho maintenance bootstrap.');
