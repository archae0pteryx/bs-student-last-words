import { Card } from './Card'
import { FC, useEffect, useState } from 'react'
import { LastWordsModel } from '../models/StudenLastWords'
import * as web3 from '@solana/web3.js'
import { Button, Center, HStack, Input, Spacer } from '@chakra-ui/react'
import { LastWordsCoordinator } from '../coordinators/LastWordsCoordinator'

export const StudentsLastWords: FC = () => {
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
    const [studentLastWords, setStudentsLastWords] = useState<LastWordsModel[]>([])
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState('')

    useEffect(() => {
        LastWordsCoordinator.fetchPage(
            connection,
            page,
            5,
            search,
            search !== ''
        ).then(setStudentsLastWords)
        // eslint-disable-next-line
    }, [page, search])

    return (
        <div>
            <Center>
                <Input
                    id='search'
                    color='gray.400'
                    onChange={event => setSearch(event.currentTarget.value)}
                    placeholder='Search'
                    w='97%'
                    mt={2}
                    mb={2}
                />
            </Center>
            {
                studentLastWords.map((studentIntro, i) => <Card key={i} studentIntro={studentIntro} />)
            }
            <Center>
                <HStack w='full' mt={2} mb={8} ml={4} mr={4}>
                    {
                        page > 1 && <Button onClick={() => setPage(page - 1)}>Previous</Button>
                    }
                    <Spacer />
                    {
                        LastWordsCoordinator.accounts.length > page * 5 &&
                        <Button onClick={() => setPage(page + 1)}>Next</Button>
                    }
                </HStack>
            </Center>
        </div>
    )
}
