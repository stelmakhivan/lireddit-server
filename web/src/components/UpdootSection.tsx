import React, { useState } from 'react'
import { Flex, IconButton } from '@chakra-ui/core'
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql'

interface UpdootSectionProps {
  post: PostSnippetFragment
}

export const UpdootSection: React.FC<UpdootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    'updoot-loading' | 'downdoot-loading' | 'not-loading'
  >('not-loading')
  const [, vote] = useVoteMutation()
  return (
    <Flex direction="column" justifyContent="center" alignItems="center" mr={4}>
      <IconButton
        onClick={async () => {
          setLoadingState('updoot-loading')
          await vote({
            value: 1,
            postId: post.id,
          })
          setLoadingState('not-loading')
        }}
        aria-label="updoot post"
        icon="chevron-up"
        size="sm"
        isLoading={loadingState === 'updoot-loading'}
      />
      {post.points}
      <IconButton
        onClick={async () => {
          setLoadingState('downdoot-loading')
          await vote({
            value: -1,
            postId: post.id,
          })
          setLoadingState('not-loading')
        }}
        aria-label="downdoot post"
        icon="chevron-down"
        size="sm"
        isLoading={loadingState === 'downdoot-loading'}
      />
    </Flex>
  )
}
