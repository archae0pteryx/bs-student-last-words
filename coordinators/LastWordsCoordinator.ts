import bs58 from 'bs58'
import * as web3 from '@solana/web3.js'
import { LastWordsModel } from '../models/LastWords'

const LAST_WORDS_PID = 'EGLjJCbRkdvcHq65ycNmjkWEsqLuPCSWEPkRZ5VPC7j5'

export class LastWordsCoordinator {
    static accounts: web3.PublicKey[] = []


    static async prefetchAccounts(connection: web3.Connection, search: string) {
        const accounts = await connection.getProgramAccounts(
            new web3.PublicKey(LAST_WORDS_PID),
            {
                dataSlice: { offset: 1, length: 12 },
                filters: search === '' ? [] : [
                    {
                        memcmp:
                            {
                                offset: 5,
                                bytes: bs58.encode(Buffer.from(search))
                            }
                    }
                ]
            }
        )

        accounts.sort( (a, b) => {
            const lengthA = a.account.data.readUInt32LE(0)
            const lengthB = b.account.data.readUInt32LE(0)
            const dataA = a.account.data.slice(4, 4 + lengthA)
            const dataB = b.account.data.slice(4, 4 + lengthB)
            return dataA.compare(dataB)
        })

        this.accounts = accounts.map(account => account.pubkey)
    }

    static async fetchPage(connection: web3.Connection, page: number, perPage: number, search: string, reload: boolean = false): Promise<LastWordsModel[]> {
        if (this.accounts.length === 0 || reload) {
            await this.prefetchAccounts(connection, search)
        }

        const paginatedPublicKeys = this.accounts.slice(
            (page - 1) * perPage,
            page * perPage,
        )

        if (paginatedPublicKeys.length === 0) {
            return []
        }

        const accounts = await connection.getMultipleAccountsInfo(paginatedPublicKeys)

        const movies = accounts.reduce((accum: LastWordsModel[], account) => {
            const movie = LastWordsModel.deserialize(account?.data)
            if (!movie) {
                return accum
            }

            return [...accum, movie]
        }, [])

        return movies
    }
}
