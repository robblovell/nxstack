import { Answers, DistinctQuestion } from 'inquirer';
export declare type Questions<T extends Answers = Answers> = ReadonlyArray<DistinctQuestion<T>>;
