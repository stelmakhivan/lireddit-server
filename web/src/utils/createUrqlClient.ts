import { dedupExchange, fetchExchange } from 'urql'
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation,
} from '../generated/graphql'
import { cacheExchange } from '@urql/exchange-graphcache'
import { updateQuery } from './updateQuery'

export const createUrqlClient = (ssrExchange: any) => {
  return {
    url: 'http://localhost:4000/graphql',
    fetchOptions: {
      credentials: 'include' as const,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        updates: {
          Mutation: {
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
      ssrExchange,
      fetchExchange,
    ],
  }
}
