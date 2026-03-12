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

export function FilesPage() {
  return (
    <div className="hs-page">
      <main className="hs-wrap">
        <div className="hs-top">
          <h1 className="hs-title">Hồ sơ tuyển sinh</h1>
          <div className="hs-filters">
            <select defaultValue="Chính quy">
              <option>Chính quy</option>
              <option>Liên thông</option>
            </select>
            <select defaultValue="2026">
              <option>2025</option>
              <option>2026</option>
            </select>
          </div>
        </div>

        <section className="hs-trending-wrap">
          <div className="hs-trending">
            <article className="hs-panel hot-panel">
              <img src="/images/top-hot-corner.svg" alt="HOT" className="hs-panel-deco" />
              <img src="/images/ptit-header-icon.png" alt="PTIT" className="hs-panel-logo" />
              <div className="hs-panel-title">Top ngành <span className="hot">HOT</span> nhất</div>
              <div className="hs-panel-sub">Tổng hợp một số ngành được yêu thích nhất qua các năm tuyển sinh</div>
              <div className="hs-grid">
                <div className="hs-left">
                  <a className="hs-chip hs-chip-link" href={hotMajors[0].href} target="_blank" rel="noreferrer">
                    <span className="hs-chip-sm">HOT</span>
                    <span className="hs-chip-text">{hotMajors[0].label}</span>
                  </a>
                </div>
                <div className="hs-right">
                  {hotMajors.slice(1).map((item) => (
                    <a key={item.href} className="hs-chip hs-chip-link" href={item.href} target="_blank" rel="noreferrer">
                      <span className="hs-chip-sm">HOT</span>
                      <span className="hs-chip-text">{item.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </article>
            <article className="hs-panel new-panel">
              <img src="/images/top-new-corner.svg" alt="NEW" className="hs-panel-deco" />
              <img src="/images/ptit-header-icon.png" alt="PTIT" className="hs-panel-logo" />
              <div className="hs-panel-title">Top ngành <span className="new">MỚI</span> nhất</div>
              <div className="hs-panel-sub">Tổng hợp một số ngành mới nhất hiện nay</div>
              <div className="hs-grid">
                <div className="hs-left">
                  <a className="hs-chip hs-chip-link new" href={newMajors[0].href} target="_blank" rel="noreferrer">
                    <span className="hs-chip-sm new">NEW</span>
                    <span className="hs-chip-text">{newMajors[0].label}</span>
                  </a>
                </div>
                <div className="hs-right">
                  {newMajors.slice(1).map((item) => (
                    <a key={item.href} className="hs-chip hs-chip-link new" href={item.href} target="_blank" rel="noreferrer">
                      <span className="hs-chip-sm new">NEW</span>
                      <span className="hs-chip-text">{item.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}
