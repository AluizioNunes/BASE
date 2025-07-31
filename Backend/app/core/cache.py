import redis
from .config import settings
import json
from typing import Any, Optional

# Configuração do Redis com fallback
try:
    redis_client = redis.Redis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        db=settings.REDIS_DB,
        password=settings.REDIS_PASSWORD,
        decode_responses=True,
        socket_connect_timeout=5,
        socket_timeout=5
    )
    # Testa conexão
    redis_client.ping()
except Exception as e:
    # Redis não disponível - usando fallback
    redis_client = None

def cache_set(key: str, value: Any, ex: int = 3600) -> bool:
    """Define um valor no cache com TTL"""
    if not redis_client:
        return False
    try:
        if isinstance(value, (dict, list)):
            value = json.dumps(value)
        return redis_client.set(key, value, ex=ex)
    except Exception:
        return False

def cache_get(key: str) -> Optional[Any]:
    """Obtém um valor do cache"""
    if not redis_client:
        return None
    try:
        value = redis_client.get(key)
        if value:
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return value
        return None
    except Exception:
        return None

def cache_delete(key: str) -> bool:
    """Remove um valor do cache"""
    if not redis_client:
        return False
    try:
        return bool(redis_client.delete(key))
    except Exception:
        return False

def cache_exists(key: str) -> bool:
    """Verifica se uma chave existe no cache"""
    if not redis_client:
        return False
    try:
        return bool(redis_client.exists(key))
    except Exception:
        return False 