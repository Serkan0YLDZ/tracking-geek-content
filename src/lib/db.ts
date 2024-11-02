import {Redis} from "@upstash/redis";
export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const testConnection = async () => {
    try {
        await redis.ping(); 
        console.log('Redis bağlantısı başarılı.');
    } catch (error) {
        console.error('Redis bağlantı hatası:', error);
    }
};

testConnection();