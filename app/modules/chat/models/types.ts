export interface IMessageSequenceProps {
    id: string
    submittedBy: {
        id: string
        name: string
    } 
    avatarUrl: string | null
    messages: {
        text: string
        submittedAt: string
    }[]
}