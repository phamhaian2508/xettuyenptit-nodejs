import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function InfoCircleIcon() {
  return (
    <svg viewBox="64 64 896 896" focusable="false" aria-hidden="true">
      <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
      <path d="M464 336a48 48 0 1 0 96 0 48 48 0 0 0-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg fillRule="evenodd" viewBox="64 64 896 896" focusable="false" aria-hidden="true">
      <path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z" />
    </svg>
  );
}

function UserOutlinedIcon() {
  return (
    <svg viewBox="64 64 896 896" focusable="false" aria-hidden="true">
      <path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z" />
    </svg>
  );
}

function LogoutOutlinedIcon() {
  return (
    <svg viewBox="64 64 896 896" focusable="false" aria-hidden="true">
      <path d="M868 732h-70.3c-4.8 0-8.7 3.9-8.7 8.7V794H194V230h595v53.3c0 4.8 3.9 8.7 8.7 8.7H868c4.8 0 8.7-3.9 8.7-8.7V184c0-17.7-14.3-32-32-32H138c-17.7 0-32 14.3-32 32v656c0 17.7 14.3 32 32 32h706.7c17.7 0 32-14.3 32-32v-99.3c0-4.8-3.9-8.7-8.7-8.7z" />
      <path d="M905.6 505l-137.9-138c-6.5-6.5-17-6.6-23.5-.1l-45.3 45.2c-6.6 6.6-6.6 17.4 0 24l63.8 63.8H432c-9.4 0-17 7.6-17 17v64c0 9.4 7.6 17 17 17h330.7l-63.8 63.8c-6.6 6.6-6.6 17.4 0 24l45.3 45.2c6.5 6.5 17 6.4 23.5-.1l137.9-138c6.7-6.6 6.7-17.4 0-24z" />
    </svg>
  );
}

const introSections = [
  "Học viện Công nghệ Bưu chính Viễn thông thành lập theo quyết định số 516/TTg của Thủ tướng Chính phủ ngày 11 tháng 7 năm 1997 trên cơ sở sắp xếp lại 4 đơn vị thành viên thuộc Tổng Công ty Bưu chính Viễn thông Việt Nam, nay là Tập đoàn Bưu chính Viễn thông Việt Nam là Viện Khoa học Kỹ thuật Bưu điện, Viện Kinh tế Bưu điện, Trung tâm đào tạo Bưu chính Viễn thông 1 và 2. Các đơn vị tiền thân của Học viện là những đơn vị có bề dày lịch sử hình thành và phát triển với xuất phát điểm từ Trường Đại học Bưu điện 1953.",
  "Từ ngày 1/7/2014, thực hiện Quyết định của Thủ tướng Chính phủ, Bộ trưởng Bộ Thông tin và Truyền thông đã ban hành Quyết định số 878/QĐ-BTTTT điều chuyển quyền quản lý Học viện từ Tập đoàn Bưu chính Viễn thông Việt Nam về Bộ Thông tin và Truyền thông. Học viện Công nghệ Bưu chính Viễn thông là đơn vị sự nghiệp trực thuộc Bộ. Là trường đại học, đơn vị nghiên cứu, phát triển nguồn nhân lực trọng điểm của Ngành thông tin và truyền thông.",
  "Với vị thế là đơn vị đào tạo, nghiên cứu trọng điểm, chủ lực của Ngành thông tin và truyền thông Việt Nam, là trường đại học trọng điểm quốc gia trong lĩnh vực ICT, những thành tựu trong gắn kết giữa Nghiên cứu - Đào tạo - Sản xuất kinh doanh năng lực, quy mô phát triển của Học viện hôm nay, Học viện sẽ có những đóng góp hiệu quả phục vụ sự phát triển chung của Ngành Thông tin và truyền thông và sự nghiệp xây dựng, bảo vệ tổ quốc, góp phần để đất nước, để Ngành Thông tin và truyền thông Việt Nam có sự tự chủ, độc lập về khoa học công nghệ và nguồn nhân lực, qua đó tự tin cạnh tranh với các đối thủ lớn và sánh vai với các cường quốc trên thế giới.",
];

export function AppShell({ user, onLogout, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const displayFullName = user?.fullName || user?.userName || "Thí sinh";
  const isAccountCenter = location.pathname === "/account/center";
  const [showIntroModal, setShowIntroModal] = useState(false);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setShowIntroModal(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleLogout() {
    onLogout();
    navigate("/user/login");
  }

  return (
    <div className="app-shell-page">
      <header className="app-shared-header">
        <Link to="/mucdich" className="app-shared-brand">
          <img src="/images/ptit-header-icon.png" className="app-shared-logo" alt="PTIT" />
          {isAccountCenter ? (
            <span className="app-shared-brand-link-simple">Xét tuyển PTIT</span>
          ) : (
            <div>
              <div className="app-shared-brand-top">HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH VIỄN THÔNG</div>
              <div className="app-shared-brand-bottom">HỆ THỐNG XÉT TUYỂN TRỰC TUYẾN</div>
            </div>
          )}
        </Link>

        <div className="app-shared-right">
          <button type="button" className="app-shared-action app-shared-info-button" onClick={() => setShowIntroModal(true)}>
            <InfoCircleIcon />
          </button>
          <div className="app-shared-user">
            <div className="app-shared-user-trigger">
              <img src="/images/ptit-header-icon.png" alt="PTIT" className="app-shared-user-ptit" />
              <span className="app-shared-user-name">{displayFullName}</span>
            </div>
            <div className="app-shared-user-menu">
              <Link to="/account/center">
                <UserOutlinedIcon />
                <span>Trang cá nhân</span>
              </Link>
              <button type="button" className="app-shared-logout" onClick={handleLogout}>
                <LogoutOutlinedIcon />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="app-shell-content">{children}</div>

      <footer className="app-shared-footer">
        <div className="app-shared-footer-grid">
          <div>
            <img src="/images/ptit-header-icon.png" alt="PTIT" className="app-shared-foot-logo" />
            <div className="app-shared-foot-big">HỌC VIỆN CÔNG NGHỆ BƯU CHÍNH<br />VIỄN THÔNG</div>
            <div className="app-shared-foot-txt">
              Là đơn vị đào tạo, nghiên cứu trọng điểm, chủ lực của ngành thông tin và truyền thông tại Việt Nam.
            </div>
          </div>
          <div>
            <div className="app-shared-foot-title">THÔNG TIN LIÊN HỆ</div>
            <div className="app-shared-foot-txt">Email: tuyensinh@ptit.edu.vn</div>
            <div className="app-shared-foot-txt">Website: https://portal.ptit.edu.vn</div>
            <div className="app-shared-foot-txt">Website tuyển sinh: https://tuyensinh.ptit.edu.vn</div>
            <div className="app-shared-foot-txt">Số điện thoại liên hệ: 024 3756 2186</div>
          </div>
          <div>
            <div className="app-shared-foot-title">ĐỊA CHỈ HỌC VIỆN</div>
            <div className="app-shared-foot-txt">Trụ sở chính: 122 Hoàng Quốc Việt, Cầu Giấy, Hà Nội</div>
            <div className="app-shared-foot-txt">Cơ sở Hà Nội: Km10 Nguyễn Trãi, Hà Đông, Hà Nội</div>
            <div className="app-shared-foot-txt">Học viện cơ sở TP.HCM: 11 Nguyễn Đình Chiểu, Quận 1</div>
            <div className="app-shared-foot-txt">Cơ sở TP.HCM: Đường Man Thiện, P. Hiệp Phú, Quận 9</div>
          </div>
        </div>
      </footer>

      {showIntroModal ? (
        <div
          className="site-modal-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowIntroModal(false);
            }
          }}
        >
          <div className="site-modal">
            <div className="site-modal-content">
              <button type="button" aria-label="Close" className="site-modal-close" onClick={() => setShowIntroModal(false)}>
                <span className="site-modal-close-x">
                  <CloseIcon />
                </span>
              </button>
              <div className="site-modal-header">
                <div className="site-modal-title">Giới thiệu chung</div>
              </div>
              <div className="site-modal-body">
                <div className="site-intro-content">
                  <h2 className="site-intro-heading">GIỚI THIỆU</h2>
                  {introSections.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  <p className="site-intro-section-title">Chức năng và nhiệm vụ</p>
                  <img
                    className="site-intro-image"
                    src="https://portal.ptit.edu.vn/wp-content/uploads/2016/04/hocvienHQV.jpg"
                    alt="hocvienHQV"
                  />
                  <p>
                    Học viện Công nghệ Bưu chính - Viễn thông là đơn vị sự nghiệp trực thuộc Bộ Thông tin và truyền thông, Học viện
                    thực hiện hai chức năng cơ bản: Giáo dục, đào tạo cho xã hội và cho nhu cầu của Ngành thông tin và truyền thông
                    Việt Nam. Nghiên cứu khoa học, tư vấn, chuyển giao công nghệ trong lĩnh vực Bưu chính, Viễn thông và công nghệ
                    thông tin đáp ứng nhu cầu xã hội và nhu cầu của Ngành thông tin và truyền thông Việt Nam.
                  </p>
                  <p className="site-intro-section-title">Đào tạo</p>
                  <p>
                    Hệ thống đào tạo và cấp bằng của Học viện bao gồm nhiều cấp độ tuỳ thuộc vào thời gian đào tạo và chất lượng đầu
                    vào của các học viên. Hiện nay Học viện cung cấp các dịch vụ giáo dục, đào tạo chủ yếu sau đây: Thực hiện các
                    khoá đào tạo bậc Đại học, Thạc sĩ và Tiến sĩ theo chương trình chuẩn quốc gia và quốc tế theo các hình thức khác
                    nhau như tập trung, phi tập trung, liên thông, đào tạo từ xa... Tổ chức các khoá đào tạo bồi dưỡng ngắn hạn cấp
                    chứng chỉ trong các lĩnh vực Bưu chính, Viễn thông, công nghệ thông tin, quản trị kinh doanh, an toàn thông tin,
                    công nghệ đa phương tiện... Tổ chức các chương trình đào tạo cho nước thứ ba. Sẵn sàng liên danh, liên kết với
                    các đối tác trong nước và quốc tế trong lĩnh vực giáo dục, đào tạo.
                  </p>
                  <p className="site-intro-section-title">Nghiên cứu khoa học và tư vấn chuyển giao công nghệ</p>
                  <p>
                    Tổ chức nghiên cứu về chiến lược, quy hoạch phát triển mạng và dịch vụ bưu chính, viễn thông và công nghệ thông
                    tin. Tổ chức nghiên cứu về công nghệ, giải pháp và phát triển dịch vụ trong lĩnh vực bưu chính, viễn thông và
                    công nghệ thông tin. Tổ chức nghiên cứu và phát triển các sản phẩm, bán sản phẩm trong lĩnh vực điện tử - viễn
                    thông. Tổ chức nghiên cứu về quản lý, điều hành doanh nghiệp và các lĩnh vực kinh tế khác. Cung cấp các dịch vụ
                    tư vấn về công nghệ, giải pháp và phát triển dịch vụ trong lĩnh vực bưu chính, viễn thông, công nghệ thông tin
                    và lĩnh vực kinh tế cho các đơn vị trong và ngoài Ngành Thông tin và truyền thông Việt Nam. Cung cấp các dịch vụ
                    đo lường, kiểm chuẩn, tư vấn thẩm định các công trình, dự án thuộc lĩnh vực bưu chính viễn thông và công nghệ
                    thông tin.
                  </p>
                </div>
              </div>
              <div className="site-modal-footer">
                <button type="button" className="site-modal-ok" onClick={() => setShowIntroModal(false)}>
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
