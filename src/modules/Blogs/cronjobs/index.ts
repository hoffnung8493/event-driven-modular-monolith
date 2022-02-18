import { CronJob } from 'cron'
import { RedisClientType } from 'redis'

const sampleCronJob = (client: RedisClientType<any, any>) =>
  new CronJob('*/10 * * * * *', () => {
    console.log('Blog service - sample cron running every 10 seconds')
    //execute publishers
  })

export const runBlogCronJobs = (client: RedisClientType<any, any>) => {
  // sampleCronJob(client).start()
}
