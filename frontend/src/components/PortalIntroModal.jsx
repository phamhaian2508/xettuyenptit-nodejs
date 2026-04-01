const introSections = [
  "Học viện Công nghệ Bưu chính Viễn thông thành lập theo quyết định số 516/TTg của Thủ tướng Chính phủ ngày 11 tháng 7 năm 1997 trên cơ sở sắp xếp lại 4 đơn vị thành viên thuộc Tổng Công ty Bưu chính Viễn thông Việt Nam.",
  "Từ ngày 1/7/2014, Học viện được điều chuyển quyền quản lý từ Tập đoàn Bưu chính Viễn thông Việt Nam về Bộ Thông tin và Truyền thông, trở thành đơn vị sự nghiệp trực thuộc Bộ.",
  "Với vị thế là đơn vị đào tạo, nghiên cứu trọng điểm của ngành thông tin và truyền thông Việt Nam, Học viện tiếp tục đóng góp vào phát triển nguồn nhân lực, khoa học công nghệ và chuyển đổi số quốc gia."
];

function CloseIcon() {
  return (
    <svg fillRule="evenodd" viewBox="64 64 896 896" focusable="false" aria-hidden="true">
      <path d="M799.86 166.31c.02 0 .04.02.08.06l57.69 57.7c.04.03.05.05.06.08a.12.12 0 010 .06c0 .03-.02.05-.06.09L569.93 512l287.7 287.7c.04.04.05.06.06.09a.12.12 0 010 .07c0 .02-.02.04-.06.08l-57.7 57.69c-.03.04-.05.05-.07.06a.12.12 0 01-.07 0c-.03 0-.05-.02-.09-.06L512 569.93l-287.7 287.7c-.04.04-.06.05-.09.06a.12.12 0 01-.07 0c-.02 0-.04-.02-.08-.06l-57.69-57.7c-.04-.03-.05-.05-.06-.07a.12.12 0 010-.07c0-.03.02-.05.06-.09L454.07 512l-287.7-287.7c-.04-.04-.05-.06-.06-.09a.12.12 0 010-.07c0-.02.02-.04.06-.08l57.7-57.69c.03-.04.05-.05.07-.06a.12.12 0 01.07 0c.03 0 .05.02.09.06L512 454.07l287.7-287.7c.04-.04.06-.05.09-.06a.12.12 0 01.07 0z" />
    </svg>
  );
}

export function PortalIntroModal({ open, onClose }) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="site-modal-overlay"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="site-modal">
        <div className="site-modal-content">
          <button type="button" aria-label="Close" className="site-modal-close" onClick={onClose}>
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
                alt="Học viện Công nghệ Bưu chính Viễn thông"
              />
              <p>
                Học viện Công nghệ Bưu chính - Viễn thông là đơn vị sự nghiệp trực thuộc Bộ Thông tin và Truyền thông, thực hiện
                đồng thời hai chức năng: giáo dục đào tạo và nghiên cứu khoa học, chuyển giao công nghệ trong lĩnh vực bưu chính,
                viễn thông và công nghệ thông tin.
              </p>
            </div>
          </div>
          <div className="site-modal-footer">
            <button type="button" className="site-modal-ok" onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
