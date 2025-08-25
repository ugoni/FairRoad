from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from pydantic import AliasChoices


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=[".env", "../.env"],  # 현재 디렉토리와 상위 디렉토리에서 찾기
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # 애플리케이션 이름
    app_name: str = Field(validation_alias=AliasChoices("APP_NAME", "app_name"))

    # 데이터베이스 설정
    database_url: str = Field(validation_alias=AliasChoices("DATABASE_URL", "database_url"))

    # JWT 인증 설정
    jwt_secret_key: str = Field(validation_alias=AliasChoices("JWT_SECRET_KEY", "jwt_secret_key"))
    jwt_algorithm: str = Field(validation_alias=AliasChoices("JWT_ALGORITHM", "jwt_algorithm"))
    access_token_expire_minutes: int = Field(validation_alias=AliasChoices("ACCESS_TOKEN_EXPIRE_MINUTES", "access_token_expire_minutes"))

    # 데이터베이스 디버그 설정
    db_echo: bool = Field(validation_alias=AliasChoices("DB_ECHO", "db_echo"))

    # Redis 설정
    redis_url: str = Field(validation_alias=AliasChoices("REDIS_URL", "redis_url"))


settings = Settings()
