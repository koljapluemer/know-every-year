import type { Card } from "ts-fsrs"

export interface Year {
    events: Event[]
    notes?: string 
    yearToEventsLearningData?: Card
}

export interface Event {
    id: string
    content: string
    mentalImage: string
    notes?: string 
    eventToYearLearningData?: Card
}