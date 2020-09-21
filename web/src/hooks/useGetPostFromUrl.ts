import { useGetIntId } from './useGetIntId'
import { usePostQuery } from '../generated/graphql'

export const useGetPostFromUrl = () => {
  const id = useGetIntId()
  return usePostQuery({
    pause: id === -1,
    variables: {
      id,
    },
  })
}
