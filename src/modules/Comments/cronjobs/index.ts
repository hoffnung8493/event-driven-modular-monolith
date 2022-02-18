import { CronJob } from 'cron'
import { RedisClientType } from 'redis'

const sampleCronJob = (client: RedisClientType<any, any>) =>
  new CronJob('*/10 * * * * *', () => {
    console.log('Comment service - sample cron running every 10 seconds')
    //execute publishers
  })

export const runCommentCronJobs = (client: RedisClientType<any, any>) => {
  // sampleCronJob(client).start()
}
