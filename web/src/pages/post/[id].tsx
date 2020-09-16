import React from 'react'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'

import { createUrqlClient } from '../../utils/createUrqlClient'
import { usePostQuery } from '../../generated/graphql'
import { Layout } from '../../components/Layout'
import { Box, Heading } from '@chakra-ui/core'

export const Post: React.FC = () => {
  const router = useRouter()
  const id =
    typeof router.query.id === 'string' ? parseInt(router.query.id) : -1
  const [{ data, error, fetching }] = usePostQuery({
    pause: id === -1,
    variables: {
      id,
    },
  })

  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    )
  }

  if (error) {
    return <div>{error.message}</div>
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    )
  }
  return (
    <Layout>
      <Heading mb={4}>{data.post.title}</Heading>
      {data.post.text}
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post)
