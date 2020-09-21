import React from 'react'
import { Box, Button } from '@chakra-ui/core'
import { Formik, Form } from 'formik'
import { withUrqlClient } from 'next-urql'
import { useRouter } from 'next/router'

import { usePostQuery, useUpdatePostMutation } from '../../../generated/graphql'

import { createUrqlClient } from '../../../utils/createUrqlClient'
import { useGetIntId } from '../../../hooks/useGetIntId'

import { InputField } from '../../../components/InputField'
import { Layout } from '../../../components/Layout'

export const EditPost: React.FC = () => {
  const router = useRouter()
  const id = useGetIntId()

  const [{ data, fetching }] = usePostQuery({
    pause: id === -1,
    variables: {
      id,
    },
  })
  const [, updatePost] = useUpdatePostMutation()

  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    )
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    )
  }

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          await updatePost({
            id,
            ...values,
          })
          router.back()
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />
            <Box mt={4}>
              <InputField
                name="text"
                placeholder="text..."
                label="Body"
                textarea
              />
            </Box>
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              variantColor="teal"
            >
              update post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default withUrqlClient(createUrqlClient)(EditPost)
