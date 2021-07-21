import { Answers, DistinctQuestion } from 'inquirer'

export type Questions<T extends Answers = Answers> = ReadonlyArray<DistinctQuestion<T>>

interface TerminalUI {

}