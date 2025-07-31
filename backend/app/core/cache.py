import os
import json
from typing import Any, Optional
from datetime import datetime, timedelta

# Cache TTL configuration
CACHE_TTL = int(os.getenv("CACHE_TTL", "3600"))  # 1 hour default

class CacheService:
    def __init__(self):
        # Use in-memory cache only for Railway deployment
        self.memory_cache = {}
        self.cache_timestamps = {}
        self.enabled = True
        print("Info: Using in-memory cache (Redis not available)")

    def _is_expired(self, key: str) -> bool:
        """Check if cache entry is expired"""
        if key not in self.cache_timestamps:
            return True
        
        timestamp = self.cache_timestamps[key]
        expiry_time = timestamp + timedelta(seconds=CACHE_TTL)
        return datetime.now() > expiry_time

    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        try:
            if key in self.memory_cache and not self._is_expired(key):
                return self.memory_cache[key]
            elif key in self.memory_cache:
                # Remove expired entry
                del self.memory_cache[key]
                del self.cache_timestamps[key]
        except Exception as e:
            print(f"Cache get error: {e}")
        return None

    def set(self, key: str, value: Any, ttl: int = CACHE_TTL) -> bool:
        """Set value in cache"""
        try:
            self.memory_cache[key] = value
            self.cache_timestamps[key] = datetime.now()
            return True
        except Exception as e:
            print(f"Cache set error: {e}")
            return False

    def delete(self, key: str) -> bool:
        """Delete key from cache"""
        try:
            if key in self.memory_cache:
                del self.memory_cache[key]
            if key in self.cache_timestamps:
                del self.cache_timestamps[key]
            return True
        except Exception as e:
            print(f"Cache delete error: {e}")
            return False

    def clear(self) -> bool:
        """Clear all cache"""
        try:
            self.memory_cache.clear()
            self.cache_timestamps.clear()
            return True
        except Exception as e:
            print(f"Cache clear error: {e}")
            return False

    def get_cache_key(self, prefix: str, *args) -> str:
        """Generate standardized cache key"""
        return f"{prefix}:{'_'.join(map(str, args))}"

# Global cache instance
cache = CacheService()