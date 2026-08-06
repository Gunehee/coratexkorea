import { useState, useEffect } from 'react';
import { En } from '../components/Layout';

/**
 * 리뷰 관리 — 내부 전용 페이지.
 * 리뷰는 이 브라우저의 LocalStorage 에만 저장되며 서버로 전송되지 않습니다.
 * 검색엔진 색인 제외: robots.txt + 빌드 시 noindex 메타 삽입.
 */
const STORE_KEY = 'coratex_reviews';

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY)) || [];
  } catch {
    return [];
  }
}

export default function Edit() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', company: '', rating: '5', text: '' });

  useEffect(() => {
    setItems(load());
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function save(next) {
    setItems(next);
    localStorage.setItem(STORE_KEY, JSON.stringify(next));
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;

    save([
      {
        name: form.name.trim(),
        company: form.company.trim(),
        rating: parseInt(form.rating, 10),
        text: form.text.trim(),
        date: new Date().toISOString().slice(0, 10),
      },
      ...items,
    ]);
    setForm({ name: '', company: '', rating: '5', text: '' });
  }

  function remove(i) {
    if (!window.confirm('이 리뷰를 삭제할까요?')) return;
    save(items.filter((_, idx) => idx !== i));
  }

  return (
    <section className="section">
      <div className="container">
        <div className="section-head">
          <h2>리뷰 관리 <En>Internal page</En></h2>
          <p>
            이 페이지는 <strong>내부용</strong>입니다. 리뷰는 이 브라우저의 저장소(LocalStorage)에만
            저장되며 서버로 전송되지 않습니다.
          </p>
        </div>

        <div className="note">
          <p>검색엔진에 노출되지 않도록 <code>noindex</code>가 설정되어 있습니다. 외부에 공유하지 마십시오.</p>
        </div>

        <div className="grid grid-2" style={{ marginTop: 30 }}>
          <div className="card buy-card">
            <h3>리뷰 등록</h3>
            <form onSubmit={onSubmit} noValidate>
              <div className="form-field">
                <label htmlFor="r-name">이름</label>
                <input type="text" id="r-name" value={form.name} onChange={set('name')} required />
              </div>
              <div className="form-field">
                <label htmlFor="r-company">회사</label>
                <input type="text" id="r-company" value={form.company} onChange={set('company')} />
              </div>
              <div className="form-field">
                <label htmlFor="r-rating">평점</label>
                <select id="r-rating" value={form.rating} onChange={set('rating')}>
                  <option value="5">★★★★★ (5)</option>
                  <option value="4">★★★★☆ (4)</option>
                  <option value="3">★★★☆☆ (3)</option>
                  <option value="2">★★☆☆☆ (2)</option>
                  <option value="1">★☆☆☆☆ (1)</option>
                </select>
              </div>
              <div className="form-field">
                <label htmlFor="r-text">내용</label>
                <textarea id="r-text" value={form.text} onChange={set('text')} required />
              </div>
              <button type="submit" className="btn btn-primary">등록</button>
            </form>
          </div>

          <div className="card buy-card">
            <h3>등록된 리뷰</h3>
            {items.length === 0 ? (
              <p className="review-empty">등록된 리뷰가 없습니다.</p>
            ) : (
              items.map((r, i) => (
                <article className="review-item" key={`${r.date}-${i}`}>
                  <div className="review-head">
                    <span className="review-name">{r.name}</span>
                    <span className="review-meta">{r.company || '-'} · {r.date}</span>
                    <span className="review-stars" aria-label={`평점 ${r.rating}점`}>
                      {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    </span>
                    <button type="button" className="btn-del" onClick={() => remove(i)}>삭제</button>
                  </div>
                  <p className="review-text">{r.text}</p>
                </article>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
