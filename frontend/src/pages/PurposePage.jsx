import { Link } from "react-router-dom";

function ArrowRightIcon() {
  return (
    <svg viewBox="64 64 896 896" focusable="false" width="1em" height="1em" fill="currentColor" aria-hidden="true">
      <path d="M869 487.8L491.2 159.9c-2.9-2.5-6.6-3.9-10.5-3.9h-88.5c-7.4 0-10.8 9.2-5.2 14l350.2 304H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h585.1L386.9 854c-5.6 4.9-2.2 14 5.2 14h91.5c1.9 0 3.8-.7 5.2-2L869 536.2a32.07 32.07 0 000-48.4z" />
    </svg>
  );
}

const hotMajors = [
  {
    label: "Công nghệ thông tin",
    href: "https://daotao.ptit.edu.vn/nganhhoc/7480201"
  },
  {
    label: "Khoa học máy tính (định hướng Khoa học dữ liệu)",
    href: "https://daotao.ptit.edu.vn/nganhhoc/7480101"
  },
  {
    label: "Công nghệ thông tin (Cử nhân, định hướng ứng dụng)",
    href: "https://daotao.ptit.edu.vn/nganhhoc/7480201_UDU"
  },
  {
    label: "Kỹ thuật dữ liệu (ngành Mạng máy tính và truyền thông dữ liệu)",
    href: "https://daotao.ptit.edu.vn/nganhhoc/7480102"
  }
];

const newMajors = [
  {
    label: "Công nghệ thông tin (chất lượng cao)",
    href: "https://daotao.ptit.edu.vn/nganhhoc/7480201(CLC"
  },
  {
    label: "Công nghệ thông tin (Cử nhân, định hướng ứng dụng)",
    href: "https://daotao.ptit.edu.vn/nganhhoc/7480201_UDU"
  },
  {
    label: "Kỹ thuật dữ liệu (ngành Mạng máy tính và truyền thông dữ liệu)",
    href: "https://daotao.ptit.edu.vn/nganhhoc/7480102"
  },
  {
    label: "Kế toán chất lượng cao (chuẩn quốc tế ACCA)",
    href: "https://daotao.ptit.edu.vn/nganhhoc/734030"
  }
];

export function PurposePage({ user }) {
  const greetingName = user?.firstName || user?.fullName || user?.userName;
  const hotPrimary = hotMajors[0];
  const hotSecondary = hotMajors.slice(1);
  const newPrimary = newMajors[0];
  const newSecondary = newMajors.slice(1);

  return (
    <div className="md-page">
      <main className="md-wrap">
        <div className="md-greet">Xin chào {greetingName}</div>
        <div className="md-desc">
          Bạn đang tham gia hệ thống xét tuyển trực tuyến của PTIT
          <br />
          Vui lòng chọn mục đích để tiếp tục:
        </div>

        <div className="md-filters">
          <select defaultValue="Chính quy">
            <option>Chính quy</option>
            <option>Liên thông</option>
          </select>
          <select defaultValue="2026">
            <option>2025</option>
            <option>2026</option>
          </select>
        </div>

        <section className="md-cards">
          <Link to="/danhsachhoso" className="md-card md-card-link-block">
            <div className="md-card-head">Nộp hồ sơ trực tuyến</div>
            <div className="md-card-body">
              Bạn đang tham gia hệ thống xét tuyển trực tuyến đại học của PTIT
              <div className="md-illus">
                <img src="/images/mucdich-xet-tuyen.png" alt="Nộp hồ sơ trực tuyến" />
              </div>
              <div className="md-card-foot"><span>Xem chi tiết</span><span className="md-card-arrow"><ArrowRightIcon /></span></div>
            </div>
          </Link>
          <article className="md-card">
            <div className="md-card-head">Nhập học trực tuyến</div>
            <div className="md-card-body">
              Bạn đang tham gia hệ thống nhập học trực tuyến đại học của PTIT
              <div className="md-illus">
                <img src="/images/mucdich-nhap-hoc.png" alt="Nhập học trực tuyến" />
              </div>
              <div className="md-card-foot"><span>Xem chi tiết</span><span className="md-card-arrow"><ArrowRightIcon /></span></div>
            </div>
          </article>
        </section>

        <section className="md-trending">
          <article className="md-trend-panel hot-panel">
            <img src="/images/top-hot-corner.svg" alt="HOT" className="md-trend-deco" />
            <img src="/images/ptit-header-icon.png" alt="PTIT" className="md-trend-logo" />
            <div className="md-trend-title">Top ngành <span className="hot-word">HOT</span> nhất</div>
            <div className="md-trend-sub">Tổng hợp một số ngành được yêu thích nhất qua các năm tuyển sinh</div>
            <div className="md-trend-grid">
              <div className="md-trend-left">
                <a className="md-chip md-chip-large md-chip-link" href={hotPrimary.href} target="_blank" rel="noreferrer">
                  <span className="md-chip-sm">HOT</span>
                  <span className="md-chip-text">{hotPrimary.label}</span>
                </a>
              </div>
              <div className="md-trend-right">
                {hotSecondary.map((item) => (
                  <a key={item.href} className="md-chip md-chip-link" href={item.href} target="_blank" rel="noreferrer">
                    <span className="md-chip-sm">HOT</span>
                    <span className="md-chip-text">{item.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </article>
          <article className="md-trend-panel new-panel">
            <img src="/images/top-new-corner.svg" alt="NEW" className="md-trend-deco" />
            <img src="/images/ptit-header-icon.png" alt="PTIT" className="md-trend-logo" />
            <div className="md-trend-title">Top ngành <span className="new-word">MỚI</span> nhất</div>
            <div className="md-trend-sub">Tổng hợp một số ngành mới nhất hiện nay</div>
            <div className="md-trend-grid">
              <div className="md-trend-left">
                <a className="md-chip md-chip-large md-chip-link new" href={newPrimary.href} target="_blank" rel="noreferrer">
                  <span className="md-chip-sm new">NEW</span>
                  <span className="md-chip-text">{newPrimary.label}</span>
                </a>
              </div>
              <div className="md-trend-right">
                {newSecondary.map((item) => (
                  <a key={item.href} className="md-chip md-chip-link new" href={item.href} target="_blank" rel="noreferrer">
                    <span className="md-chip-sm new">NEW</span>
                    <span className="md-chip-text">{item.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
