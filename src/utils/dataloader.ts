import { User } from '../modules/Users/models'
import { Blog } from '../modules/Blogs/models'
import dataloader from 'dataloader'
import { Model } from 'mongoose'

const loader = (model: Model<any>) => () =>
  new dataloader(async (ids: readonly string[]) => {
    let docs = await model.find({ _id: { $in: ids } })
    return ids.map((id) => docs.find((v) => v._id.toString() === id.toString()))
  })

const userLoader = loader(User)
const blogLoader = loader(Blog)

export const dataLoaderInit = () => ({
  userLoader: userLoader(),
  blogLoader: blogLoader(),
})
