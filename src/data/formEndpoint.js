/**
 * 문의·발주 폼 전송 방식 — 백엔드 없이 Web3Forms(무료 정적 폼 전송 서비스)로
 * 이메일을 즉시 발송합니다. 방문자는 버튼 한 번만 누르면 됩니다.
 *
 * ACCESS_KEY 가 비어 있으면 자동으로 mailto: 방식으로 폴백합니다.
 * (메일 앱이 열리고 방문자가 한 번 더 보내야 하는 기존 방식)
 *
 * 키 발급 방법 (무료, 가입 없이 즉시):
 *   1) https://web3forms.com 접속
 *   2) 코라텍스 수신 이메일(0822gblessy@naver.com)을 입력해 액세스 키 발급
 *   3) 발급된 키를 아래 ACCESS_KEY 에 붙여넣기
 *
 * 이메일 계정 소유 확인이 필요한 절차라 코드로 대신 발급할 수 없습니다.
 */
export const WEB3FORMS_ACCESS_KEY = '';

export const hasFormEndpoint = Boolean(WEB3FORMS_ACCESS_KEY);
