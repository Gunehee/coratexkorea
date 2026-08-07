import { Link } from 'react-router-dom';
import { En, Kr } from '../components/Layout';
import { href, company, telHref } from '../data/site';

/** 404 — 원본 404.html 문구를 그대로 보존합니다. */
export default function NotFound() {
  return (
    <section className="section section--notfound">
      <div className="container">
        <h1>
          <Kr>페이지를 찾을 수 없습니다 (404)</Kr>
          <En>Page Not Found (404)</En>
        </h1>
        <p className="lead">
          <Kr>요청하신 페이지가 삭제되었거나 주소가 변경되었을 수 있습니다. 아래 버튼으로 이동해주세요.</Kr>
          <En>The page may have been moved or deleted. Please use the buttons below.</En>
        </p>

        <div className="btn-row">
          <Link className="btn btn-primary" to={href('/')}>
            <Kr>홈으로</Kr><En>Go Home</En>
          </Link>
          <Link className="btn btn-outline" to={href('/about')}>
            <Kr>소개</Kr><En>About</En>
          </Link>
          <Link className="btn btn-outline" to={href('/use')}>
            <Kr>사용 방법</Kr><En>How to use</En>
          </Link>
          <a className="btn btn-navy" href={telHref}>
            <Kr>전화</Kr><En>Call</En> {company.mobile}
          </a>
        </div>
      </div>
    </section>
  );
}
