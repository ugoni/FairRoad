// =======================================================================
// BACKEND API 연동 전 임시 함수
// 나중에 실제 백엔드 API로 이 부분을 교체
// =======================================================================

const DUMMY_TOKEN = 'dummy-jwt-token-for-testing';

/**
 * 사용자를 로그인시키는 가짜 API 함수
 * @param {{email: string, password: string}} credentials - 사용자 이메일과 비밀번호
 * @returns {Promise<{token: string}>} 로그인 성공 시 토큰을 포함한 Promise를 반환
 */
export const login = (credentials) => {
  console.log('Attempting to log in with:', credentials);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (credentials.email && credentials.password) {
        console.log('Login simulation successful');
        resolve({ token: DUMMY_TOKEN });
      } else {
        console.error('Login simulation failed: Missing credentials');
        reject(new Error('Invalid credentials'));
      }
    }, 1000); // 1초 지연을 시뮬레이션
  });
};

/**
 * 사용자를 등록하는 가짜 API 함수
 * @param {{email: string, password: string, nickname: string}} userInfo - 사용자 이메일과 비밀번호 및 닉네임
 * @returns {Promise<{success: boolean}>} 등록 성공 시 success: true를 포함한 Promise를 반환
 */
export const register = (userInfo) => {
  console.log('Attempting to register with:', userInfo);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userInfo.email && userInfo.password && userInfo.nickname) {
        console.log('Registration simulation successful');
        resolve({ success: true });
      } else {
        console.error('Registration simulation failed: Missing user info');
        reject(new Error('Invalid user info'));
      }
    }, 1000); // 1초 지연을 시뮬레이션
  });
};
