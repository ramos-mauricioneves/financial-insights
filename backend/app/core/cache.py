import os
import json
import redis
from typing import Any, Optional
from datetime import timedelta

# Redis configuration
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")
CACHE_TTL = int(os.getenv("CACHE_TTL", "3600"))  # 1 hour default

class CacheService:
    def __init__(self):
        try:
            self.redis_client = redis.from_url(REDIS_URL, decode_responses=True)
            # Test connection
            self.redis_client.ping()
            self.enabled = True
        except (redis.ConnectionError, redis.TimeoutError):
            # Fallback to in-memory cache if Redis is not available
            self.memory_cache = {}
            self.enabled = False
            print("Warning: Redis not available, using in-memory cache")

    def get(self, key: str) -> Optional[Any]:
        """Obter valor do cache"""
        try:
            if self.enabled:
                value = self.redis_client.get(key)
                if value:
                    return json.loads(value)
            else:
                return self.memory_cache.get(key)
        except Exception as e:
            print(f"Cache get error: {e}")
        return None

    def set(self, key: str, value: Any, ttl: int = CACHE_TTL) -> bool:
        """Definir valor no cache"""
        try:
            if self.enabled:
                serialized = json.dumps(value, default=str)
                return self.redis_client.setex(key, ttl, serialized)
            else:
                self.memory_cache[key] = value
                return True
        except Exception as e:
            print(f"Cache set error: {e}")
            return False

    def delete(self, key: str) -> bool:
        """Deletar chave do cache"""
        try:
            if self.enabled:
                return bool(self.redis_client.delete(key))
            else:
                return self.memory_cache.pop(key, None) is not None
        except Exception as e:
            print(f"Cache delete error: {e}")
            return False

    def clear(self) -> bool:
        """Limpar todo o cache"""
        try:
            if self.enabled:
                return self.redis_client.flushdb()
            else:
                self.memory_cache.clear()
                return True
        except Exception as e:
            print(f"Cache clear error: {e}")
            return False

    def get_cache_key(self, prefix: str, *args) -> str:
        """Gerar chave de cache padronizada"""
        return f"{prefix}:{'_'.join(map(str, args))}"

# Global cache instance
cache = CacheService()