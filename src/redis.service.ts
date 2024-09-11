import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  onModuleInit() {
    // Initialize Redis client
    this.client = new Redis({
      host: 'localhost', // Replace with your Redis host
      port: 6379,        // Replace with your Redis port
      db: 0,             // Redis DB index
    });

    this.client.on('connect', () => {
      console.log('Connected to Redis');
    });

    this.client.on('error', (err) => {
      console.error('Redis error', err);
    });
  }

  onModuleDestroy() {
    // Gracefully close the Redis connection when the module is destroyed
    this.client.quit();
  }

  getClient(): Redis {
    return this.client;
  }
}

