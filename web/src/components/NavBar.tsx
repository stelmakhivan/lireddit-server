import React from 'react'
import { Box, Link, Flex, Button } from '@chakra-ui/core'
import NextLink from 'next/link'
import { useMeQuery, useLogoutMutation } from '../generated/graphql'
import { isServer } from '../utils/isServer'

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = () => {
  const [{ data, fetching }] = useMeQuery({
    pause: isServer(),
  })

  const [{ fetching: logoutFetching }, logout] = useLogoutMutation()
  let body = null

  if (fetching) {
    body = null
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    )
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          variant="link"
          onClick={() => {
            logout()
          }}
          isLoading={logoutFetching}
        >
          logout
        </Button>
      </Flex>
    )
  }

  return (
    <Flex bg="tan" p={4}>
      <Box ml="auto">{body}</Box>
    </Flex>
  )
}