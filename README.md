# ExhibitionRoad 백엔드 (FastAPI + PostgreSQL)

이 레포는 전시/박람회 서비스의 백엔드 API입니다. FastAPI와 PostgreSQL, SQLAlchemy(Async)를 사용합니다. (확장) 항목은 제외한 MVP 범위로 구성되어 있습니다.

## 필수 구성 요소
- Python 3.11+
- PostgreSQL 14+
- (선택) Docker + Docker Compose

## 빠른 시작
1) 가상환경 활성화 (Windows PowerShell)
```
./venv/Scripts/Activate.ps1
```

2) 패키지 설치
```
pip install -r requirements.txt
```

3) 환경변수 파일 작성
`.env.example`을 `.env`로 복사하고 값(특히 `JWT_SECRET_KEY`)을 설정합니다.

4) DB 준비
- 로컬 PostgreSQL을 사용하거나, Docker를 사용할 수 있습니다.
```
docker compose up -d
```

5) 서버 실행
```
uvicorn app.main:app --reload
```

## 주요 디렉터리 구조
```
app/
  api/routes/        # 라우터 (auth, users, exhibitions, reviews, social, calendar, search)
  core/              # 설정
  db/                # DB 세션, Base
  models/            # SQLAlchemy 모델
  schemas/           # Pydantic 스키마
  services/          # 비즈니스 로직 (추천 등)
  utils/             # 보안/유틸
```

## 제공 기능 (MVP)
- 회원 관리: 회원가입(관심사 선택/동의 저장), 로그인(JWT), 프로필 조회/수정, 회원탈퇴
- 전시: 인기 리스트, 상세, 지도 마커, 검색
- 상호작용: 좋아요/북마크, 별점/리뷰(텍스트/이미지/해시태그)
- 해시태그 검색: 리뷰의 태그로 검색
- 소셜: 팔로우/언팔로우, 간단한 피드(팔로우한 유저의 최신 리뷰)
- 캘린더: 개인 일정 추가, 전시 예약(아웃링크 가정) 시 기간 자동 추가

## 주의 사항
- 마이그레이션 툴(Alembic)은 추후 도입 가능. 현재는 앱 시작 시 테이블을 자동 생성합니다.
- (확장)으로 표기된 기능(앱 내 결제/예매, DM 등)은 제외되었습니다.
