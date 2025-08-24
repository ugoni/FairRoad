from __future__ import annotations

import asyncio
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import AsyncSessionLocal
from app.models.review import Tag


GENRE_TAGS: Sequence[str] = [
    "예술 & 디자인",
    "패션 & 뷰티",
    "인테리어 & 홈데코",
    "수공예 / 핸드메이드",
    "생활용품 / 생활가전",
    "게임 / e스포츠",
    "스마트 팩토리 / 제조기술",
    "로봇 / 자동화",
    "3D 프린팅",
    "드론 / 항공 / 우주",
    "자동차 / 모빌리티",
    "인공지능(AI)",
    "사물인터넷(IoT)",
    "빅데이터 / 클라우드",
    "블록체인 / 핀테크",
    "사이버 보안",
    "메타버스 / XR / VR",
    "친환경 / 탄소중립 / ESG",
    "태양광 / 풍력 / 신재생에너지",
    "지속가능한 기술",
    "헬스케어 / 병원기기",
    "제약 / 바이오 기술",
    "뷰티 헬스 / 피부과 관련",
    "푸드테크 / 농식품 유통",
    "비건 / 대체식품",
    "고등교육 / 대학교 설명회",
    "코딩 / AI 교육",
    "어린이 교육 / STEAM",
    "도시개발 / 스마트시티",
    "부동산 / 재테크 / 금융",
    "콘텐츠 / 미디어 / 출판",
]


PREFERRED_TAGS: Sequence[str] = [
    "반려동물 / 애완동물",
    "웨딩 / 혼수 / 육아",
    "취미 / 레저 / 여행",
    "소재 / 부품 / 장비",
    "수처리 / 폐기물 관리",
    "재활 / 운동 치료",
    "가공식품 / 간편식",
    "건강기능식품",
    "커피 / 차 / 주류",
    "유학 / 어학연수",
    "직업 박람회 / 취업 박람회",
    "정부지원사업 박람회",
    "국제 교류 박람회",
    "NGO / 사회적기업",
    "프랜차이즈 / 창업",
]


async def seed_tags() -> None:
    async with AsyncSessionLocal() as db:  # type: AsyncSession
        # 장르 태그
        for raw in GENRE_TAGS:
            name = raw.strip().lower()
            if not name:
                continue
            exists = await db.execute(select(Tag).where((Tag.name == name) & (Tag.tag_type == "genre")))
            t = exists.scalar_one_or_none()
            if t is None:
                db.add(Tag(name=name, tag_type="genre"))
        # 선호 태그
        for raw in PREFERRED_TAGS:
            name = raw.strip().lower()
            if not name:
                continue
            exists = await db.execute(select(Tag).where((Tag.name == name) & (Tag.tag_type == "preference")))
            t = exists.scalar_one_or_none()
            if t is None:
                db.add(Tag(name=name, tag_type="preference"))
        await db.commit()


if __name__ == "__main__":
    asyncio.run(seed_tags())


