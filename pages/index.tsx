
import { Center, Box, Heading } from '@chakra-ui/react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { AppBar } from '../components/AppBar'
import { StudentsLastWords } from '../components/StudentsLastWords'
import { Form } from '../components/Form'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.App}>
      <Head>
        <title>You will die</title>
      </Head>
      <AppBar />
      <Center>
        <Box>
          <Heading as="h1" size="l" color="white" ml={4} mt={8}>
            You are about to die
          </Heading>
          <Form />
          <Heading as="h1" size="l" color="white" ml={4} mt={8}>
            Last words
          </Heading>
          <StudentsLastWords />
        </Box>
      </Center>
    </div>
  )
}

export default Home
