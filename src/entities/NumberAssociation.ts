import type { Card } from "ts-fsrs"

export interface NumberAssociation {
    word: string
    notes?: string
    numberToWordLearningData: Card
    wordToNumberLearningData: Card
}