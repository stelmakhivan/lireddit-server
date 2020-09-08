import React from 'react'
import { withUrqlClient } from 'next-urql'

import { NavBar } from '../components/NavBar'
import { createUrqlClient } from '../utils/createUrqlClient'
import { usePostsQuery } from '../generated/graphql'

const Index = () => {
  const [{ data }] = usePostsQuery()
  return (
    <>
      <NavBar />
      {!data ? (
        <div>loading...</div>
      ) : (
        data.posts.map((p) => {
          return <div key={p.id}>{p.title}</div>
        })
      )}
    </>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
