const Queue = require("bull");

const { createBullBoard } = require("@bull-board/api");
const { BullAdapter } = require("@bull-board/api/bullAdapter");

const { ExpressAdapter } = require("@bull-board/express");
const config = require("#mealplan/config.js");

let serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath("/queues");

let bullAdapters = [];
class BaseQueue {
  queue = Queue;
  constructor(queuename) {
    if (this.constructor === BaseQueue) {
      throw new Error("Cannot instantiate abstract class");
    }

    try {
      if (process.env.NODE_ENV === "development") {
        console.log("queue in development");
        this.queue = new Queue(queuename, {
          redis: { port: 6379, host: "localhost" },
        });
      } else if (process.env.NODE_ENV === "production") {
        console.log("que in production");
        this.queue = new Queue(queuename, {
          redis: { tls:true, enableTLSForSentinelMode:false, url: config.REDIS_HOST, port: config.REDIS_PORT },
        });
        console.log("Running in production mode");
      }

      bullAdapters.push(new BullAdapter(this.queue));
      bullAdapters = [...new Set(bullAdapters)];

      serverAdapter.setBasePath("/queues");

      createBullBoard({
        queues: bullAdapters,
        serverAdapter,
      });

      // this.log = config.createLogger(`${queuename}Queue`);

      this.queue.on("completed", (job) => {
        job.remove();
      });
      this.queue.on("global:completed", (jobId) => {
        console.log(`Job ${jobId} completed`);
      });
      this.queue.on("global:stalled", (jobId) => {
        console.log(`Job ${jobId} stalled`);
      });

      if (this.addJob === undefined) {
        throw new Error("getArea method must be implemented");
      }

      if (this.processJob === undefined) {
        throw new Error("getArea method must be implemented");
      }
    } catch (error) {
      console.error("base queue");
    }
  }

  addJob(name, data) {
    this.queue.add(name, data, {
      attempts: 3,
      backoff: { type: "fixed", delay: 5000 },
    });
  }

  processJob(name, concurrency, callback) {
    this.queue.process(name, concurrency, callback);
  }
}

module.exports = { serverAdapter, BaseQueue };
// module.exports = { BaseQueue };

// other configurations of your server
