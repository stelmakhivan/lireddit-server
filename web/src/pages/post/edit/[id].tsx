import { withUrqlClient } from 'next-urql'
import React from 'react'

import { createUrqlClient } from '../../../utils/createUrqlClient'

export const EditPost: React.FC = () => {
  return <div>edit post</div>
}

export default withUrqlClient(createUrqlClient, { ssr: true })(EditPost)
