import {
  dedupExchange,
  fetchExchange,
  Exchange,
  stringifyVariables,
} from 'urql'
import gql from 'graphql-tag'
import { cacheExchange, Resolver } from '@urql/exchange-graphcache'
import { pipe, tap } from 'wonka'
import Router from 'next/router'

import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
  CreatePostMutation,
  VoteMutation,
  VoteMutationVariables,
} from '../generated/graphql'

import { updateQuery } from './updateQuery'
import { isServer } from './isServer'

export const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error?.message.includes('not authenticated')) {
        Router.replace('/login')
      }
    })
  )
}

const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info

    const allFields = cache.inspectFields(entityKey)

    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName)
    const size = fieldInfos.length

    if (size === 0) {
      return undefined
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`
    const isItInTheCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      'posts'
    )
    info.partial = !isItInTheCache

    let hasMore = true

    const results: string[] = []

    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string
      const data = cache.resolve(key, 'posts') as string[]
      const _hasMore = cache.resolve(key, 'hasMore') as boolean

      if (!_hasMore) {
        hasMore = _hasMore
      }

      results.push(...data)
    })

    return {
      __typename: 'PaginatedPosts', // https://formidable.com/open-source/urql/docs/graphcache/errors/#8-invalid-resolver-data
      posts: results,
      hasMore,
    }
  }
}

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = ''
  if (isServer()) {
    cookie = ctx.req.headers.cookie
  }
  return {
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
      credentials: 'include' as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
        },
        resolvers: {
          Query: {
            posts: cursorPagination(),
          },
        },
        updates: {
          Mutation: {
            vote: (_result: VoteMutation, args, cache, info) => {
              const { postId, value } = args as VoteMutationVariables
              const data = cache.readFragment(
                gql`
                  fragment _ on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: postId } as any
              )
              if (data) {
                if (data.voteStatus === value) {
                  return
                }
                const newPoints =
                  +(data.points as number) + (!data.voteStatus ? 1 : 2) * value
                cache.writeFragment(
                  gql`
                    fragment __ on Post {
                      points
                      voteStatus
                    }
                  `,
                  { id: postId, points: newPoints, voteStatus: value } as any
                )
              }
            },
            createPost: (_result: CreatePostMutation, args, cache, info) => {
              const allFields = cache.inspectFields('Query')
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === 'posts'
              )

              fieldInfos.forEach((fi) => {
                cache.invalidate('Query', 'posts', fi.arguments || {})
              })
            },
            logout: (_result: LogoutMutation, args, cache, info) => {
              updateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({
                  me: null,
                })
              )
            },
            login: (_result: LoginMutation, args, cache, info) => {
              updateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query
                  } else {
                    return {
                      me: result.login.user,
                    }
                  }
                }
              )
            },
            register: (_result: LoginMutation, args, cache, info) => {
              updateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query
                  } else {
                    return {
                      me: result.register.user,
                    }
                  }
                }
              )
            },
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  }
}
