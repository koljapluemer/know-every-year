import type { Card } from "ts-fsrs"

export interface DigitAssociation {
    sounds: string[]
    notes?: string 
    soundToNumberLearningData?: Card
    numberToSoundLearningData?: Card
}

