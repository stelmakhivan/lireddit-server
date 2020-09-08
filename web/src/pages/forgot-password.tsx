import React, { useState } from 'react'
import { Formik, Form } from 'formik'
import { Button, Box } from '@chakra-ui/core'
import { withUrqlClient } from 'next-urql'

import { Wrapper } from '../components/Wrapper'
import { InputField } from '../components/InputField'
import { createUrqlClient } from '../utils/createUrqlClient'
import { useForgotPasswordMutation } from '../generated/graphql'

export const ForgotPassword: React.FC<{}> = () => {
  const [complete, setComplete] = useState(false)
  const [, forgotPassword] = useForgotPasswordMutation()
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: '' }}
        onSubmit={async (values) => {
          await forgotPassword({ email: values.email })
          setComplete(true)
        }}
      >
        {({ isSubmitting }) =>
          complete ? (
            <Box>
              if an account with that email exists, we sent you an email
            </Box>
          ) : (
            <Form>
              <InputField
                name="email"
                placeholder="email"
                label="Email"
                type="email"
              />
              <Button
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                variantColor="teal"
              >
                forgot password
              </Button>
            </Form>
          )
        }
      </Formik>
    </Wrapper>
  )
}

export default withUrqlClient(createUrqlClient)(ForgotPassword)
