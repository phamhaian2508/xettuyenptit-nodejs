-- =========================================
-- PTIT Online Admission - Single DB Script
-- Store name by middle_name + first_name (no fullname column)
-- =========================================

DROP DATABASE IF EXISTS estateadvance;
CREATE DATABASE estateadvance CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE estateadvance;

CREATE TABLE `role` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `createddate` DATETIME NULL,
  `createdby` VARCHAR(255) NULL,
  `modifieddate` DATETIME NULL,
  `modifiedby` VARCHAR(255) NULL,
  `name` VARCHAR(255) NULL,
  `code` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `user` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `createddate` DATETIME NULL,
  `createdby` VARCHAR(255) NULL,
  `modifieddate` DATETIME NULL,
  `modifiedby` VARCHAR(255) NULL,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `status` INT NOT NULL,
  `email` VARCHAR(255) NULL,
  `middle_name` VARCHAR(255) NULL,
  `first_name` VARCHAR(255) NULL,
  `phone` VARCHAR(20) NULL,
  `gender` VARCHAR(20) NULL,
  `date_of_birth` VARCHAR(20) NULL,
  `identity_number` VARCHAR(50) NULL,
  `identity_issue_date` VARCHAR(20) NULL,
  `identity_issue_place` VARCHAR(255) NULL,
  `permanent_province` VARCHAR(255) NULL,
  `permanent_district` VARCHAR(255) NULL,
  `permanent_ward` VARCHAR(255) NULL,
  `permanent_address` VARCHAR(500) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_username` (`username`),
  UNIQUE KEY `uk_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `user_role` (
  `user_id` BIGINT NOT NULL,
  `role_id` BIGINT NOT NULL,
  PRIMARY KEY (`user_id`, `role_id`),
  CONSTRAINT `fk_user_role_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_role_role` FOREIGN KEY (`role_id`) REFERENCES `role` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `role` (`name`, `code`) VALUES
('Thí sinh', 'MANAGER');

-- Login account:
-- username: 037204009534
-- password: Tuan0303#
-- {noop} is required by current Spring Security config
INSERT INTO `user` (
  `username`, `password`, `status`, `email`,
  `middle_name`, `first_name`, `phone`, `gender`, `date_of_birth`,
  `identity_number`, `identity_issue_date`, `identity_issue_place`,
  `permanent_province`, `permanent_district`, `permanent_ward`, `permanent_address`
) VALUES (
  '037204009534', '{noop}Tuan0303#', 1, 'tuanhb2k4@gmail.com',
  'Nguyễn Anh', 'Tuấn', '0823928782', 'Nam', '03/03/2004',
  '037204009534', '10/05/2021', 'Hòa Bình',
  'Tỉnh Hòa Bình (17)', 'Huyện Lạc Sơn', 'Xã Thượng Cốc', 'Xóm mới'
);

INSERT INTO `user_role` (`user_id`, `role_id`)
SELECT u.id, r.id
FROM `user` u
JOIN `role` r ON r.code = 'MANAGER'
WHERE u.username = '037204009534';
