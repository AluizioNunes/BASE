import redis

redis_client = redis.Redis(host='localhost', port=6379, db=0)

def cache_set(key, value, ex=60):
    redis_client.set(key, value, ex=ex)

def cache_get(key):
    return redis_client.get(key) 