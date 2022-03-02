import { MyContext } from './context'
import { GraphQLResolveInfo } from 'graphql';
import { UserDoc } from '../../modules/Users/models';
import { BlogDoc } from '../../modules/Blogs/models';
import { CommentDoc } from '../../modules/Comments/models';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type RequireFields<T, K extends keyof T> = { [X in Exclude<keyof T, K>]?: T[X] } & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Blog = {
  __typename?: 'Blog';
  content: Scalars['String'];
  id: Scalars['ID'];
  title: Scalars['String'];
  user: BlogUserNested;
};

export type BlogUserNested = {
  __typename?: 'BlogUserNested';
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  user: User;
  username: Scalars['String'];
};

export type Comment = {
  __typename?: 'Comment';
  blogId: Scalars['String'];
  content: Scalars['String'];
  id: Scalars['ID'];
  user: CommentUserNested;
};

export type CommentUserNested = {
  __typename?: 'CommentUserNested';
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  user: User;
  username: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  blogCreate: Blog;
  commentCreate: Comment;
  userLogin: UserAuth;
  userRegister: UserAuth;
  userUpdateNames: User;
};


export type MutationBlogCreateArgs = {
  content: Scalars['String'];
  title: Scalars['String'];
};


export type MutationCommentCreateArgs = {
  blogId: Scalars['String'];
  content: Scalars['String'];
};


export type MutationUserLoginArgs = {
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationUserRegisterArgs = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};


export type MutationUserUpdateNamesArgs = {
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  blog: Blog;
  blogs: Array<Blog>;
  comments: Array<Comment>;
  user: User;
  users: Array<User>;
};


export type QueryBlogArgs = {
  id: Scalars['String'];
};


export type QueryCommentsArgs = {
  blogId: Scalars['String'];
};


export type QueryUserArgs = {
  id: Scalars['String'];
};


export type QueryUsersArgs = {
  ids: Array<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  firstName: Scalars['String'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  username: Scalars['String'];
};

export type UserAuth = {
  __typename?: 'UserAuth';
  accessToken: Scalars['String'];
  refreshToken: Scalars['String'];
  user: User;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Blog: ResolverTypeWrapper<BlogDoc>;
  BlogUserNested: ResolverTypeWrapper<Omit<BlogUserNested, 'user'> & { user: ResolversTypes['User'] }>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Comment: ResolverTypeWrapper<CommentDoc>;
  CommentUserNested: ResolverTypeWrapper<Omit<CommentUserNested, 'user'> & { user: ResolversTypes['User'] }>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  User: ResolverTypeWrapper<UserDoc>;
  UserAuth: ResolverTypeWrapper<Omit<UserAuth, 'user'> & { user: ResolversTypes['User'] }>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Blog: BlogDoc;
  BlogUserNested: Omit<BlogUserNested, 'user'> & { user: ResolversParentTypes['User'] };
  Boolean: Scalars['Boolean'];
  Comment: CommentDoc;
  CommentUserNested: Omit<CommentUserNested, 'user'> & { user: ResolversParentTypes['User'] };
  ID: Scalars['ID'];
  Mutation: {};
  Query: {};
  String: Scalars['String'];
  User: UserDoc;
  UserAuth: Omit<UserAuth, 'user'> & { user: ResolversParentTypes['User'] };
}>;

export type BlogResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Blog'] = ResolversParentTypes['Blog']> = ResolversObject<{
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['BlogUserNested'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BlogUserNestedResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['BlogUserNested'] = ResolversParentTypes['BlogUserNested']> = ResolversObject<{
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommentResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = ResolversObject<{
  blogId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['CommentUserNested'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CommentUserNestedResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['CommentUserNested'] = ResolversParentTypes['CommentUserNested']> = ResolversObject<{
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  blogCreate?: Resolver<ResolversTypes['Blog'], ParentType, ContextType, RequireFields<MutationBlogCreateArgs, 'content' | 'title'>>;
  commentCreate?: Resolver<ResolversTypes['Comment'], ParentType, ContextType, RequireFields<MutationCommentCreateArgs, 'blogId' | 'content'>>;
  userLogin?: Resolver<ResolversTypes['UserAuth'], ParentType, ContextType, RequireFields<MutationUserLoginArgs, 'password' | 'username'>>;
  userRegister?: Resolver<ResolversTypes['UserAuth'], ParentType, ContextType, RequireFields<MutationUserRegisterArgs, 'firstName' | 'lastName' | 'password' | 'username'>>;
  userUpdateNames?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUserUpdateNamesArgs, 'firstName' | 'lastName'>>;
}>;

export type QueryResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  blog?: Resolver<ResolversTypes['Blog'], ParentType, ContextType, RequireFields<QueryBlogArgs, 'id'>>;
  blogs?: Resolver<Array<ResolversTypes['Blog']>, ParentType, ContextType>;
  comments?: Resolver<Array<ResolversTypes['Comment']>, ParentType, ContextType, RequireFields<QueryCommentsArgs, 'blogId'>>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUsersArgs, 'ids'>>;
}>;

export type UserResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  firstName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lastName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UserAuthResolvers<ContextType = MyContext, ParentType extends ResolversParentTypes['UserAuth'] = ResolversParentTypes['UserAuth']> = ResolversObject<{
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MyContext> = ResolversObject<{
  Blog?: BlogResolvers<ContextType>;
  BlogUserNested?: BlogUserNestedResolvers<ContextType>;
  Comment?: CommentResolvers<ContextType>;
  CommentUserNested?: CommentUserNestedResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserAuth?: UserAuthResolvers<ContextType>;
}>;

