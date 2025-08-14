from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from pydantic import AliasChoices


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = Field(default="ExhibitionRoad API")

    # allow both DATABASE_URL and database_url
    database_url: str = Field(
        default="postgresql+psycopg://postgres:postgres@localhost:5432/exhibitionroad",
        validation_alias=AliasChoices("DATABASE_URL", "database_url"),
    )

    jwt_secret_key: str = Field(default="change-this-secret", validation_alias=AliasChoices("JWT_SECRET_KEY", "jwt_secret_key"))
    jwt_algorithm: str = Field(default="HS256", validation_alias=AliasChoices("JWT_ALGORITHM", "jwt_algorithm"))
    access_token_expire_minutes: int = Field(default=60 * 24 * 7, validation_alias=AliasChoices("ACCESS_TOKEN_EXPIRE_MINUTES", "access_token_expire_minutes"))

    db_echo: bool = Field(default=False, validation_alias=AliasChoices("DB_ECHO", "db_echo"))

    # Redis connection URL for WebSocket fan-out
    redis_url: str = Field(default="redis://localhost:6379/0", validation_alias=AliasChoices("REDIS_URL", "redis_url"))


settings = Settings()
