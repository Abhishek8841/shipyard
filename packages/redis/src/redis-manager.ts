import Redis from "ioredis";

class RedisManager {
    private readonly connection: Redis;
    private readonly queue_connection: Redis;

    private static Instance: RedisManager | null = null;

    private constructor() {
        this.connection = new Redis(process.env.REDIS_URL!);
        this.queue_connection = new Redis(process.env.REDIS_URL!,
            {
                maxRetriesPerRequest: null,
            }
        );
    }

    static getInstance(): RedisManager {
        if (!this.Instance) {
            this.Instance = new RedisManager();
            return this.Instance;
        }
        return this.Instance;
    }

    getConnection() {
        return this.connection;
    }

    getQueueConnection() {
        return this.queue_connection;
    }

}

export const redis_class = RedisManager.getInstance();