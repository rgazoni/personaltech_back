import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';

@Injectable()
export class BullBoardService implements OnModuleInit {
  constructor(@InjectQueue('cref') private readonly crefQueue: Queue) { }

  onModuleInit() {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/admin/queues');

    createBullBoard({
      queues: [new BullAdapter(this.crefQueue)],
      serverAdapter,
    });

    return serverAdapter.getRouter();
  }
}

