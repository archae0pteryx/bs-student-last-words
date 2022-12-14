import * as borsh from '@project-serum/borsh'

export class LastWordsModel {
    name: string;
    message: string;

    constructor(name: string, message: string) {
        this.name = name;
        this.message = message;
    }

    static mocks: LastWordsModel[] = [
        new LastWordsModel('Jo blow', `I like toast`),
        new LastWordsModel('Jack fact', `Bees and dogs can smell fear`),
        new LastWordsModel('Waffle crisp', `syrup is the best`),
    ]

    borshInstructionSchema = borsh.struct([
        borsh.u8('variant'),
        borsh.str('name'),
        borsh.str('message'),
    ])

    static borshAccountSchema = borsh.struct([
        borsh.bool('initialized'),
        borsh.str('name'),
        borsh.str('message'),
    ])

    serialize(): Buffer {
        const buffer = Buffer.alloc(1000)
        this.borshInstructionSchema.encode({ ...this, variant: 0 }, buffer)
        return buffer.slice(0, this.borshInstructionSchema.getSpan(buffer))
    }

    static deserialize(buffer?: Buffer): LastWordsModel|null {
        if (!buffer) {
            return null
        }

        try {
            const { name, message } = this.borshAccountSchema.decode(buffer)
            return new LastWordsModel(name, message)
        } catch(e) {
            console.log('Deserialization error:', e)
            return null
        }
    }
}
