import Redis from "ioredis";

class RedisManager {
    private connection: Redis;
    private static Instance: RedisManager
    private constructor() {
        this.connection = new Redis(process.env.REDIS_URL!,
            {
                maxRetriesPerRequest: null,
            }
        );
    }
    static getInstance() {
        if (!this.Instance) {
            this.Instance = new RedisManager();
            return this.Instance;
        }
        return this.Instance;
    }
    getConnection(){
        return this.connection;
    }
}

export const redis_class = RedisManager.getInstance();