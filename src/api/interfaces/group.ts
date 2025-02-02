import {Participant} from "@/api/interfaces/participant";

export interface Group {
    id: number;
    destination: string;
    transportType: string;
    maxParticipants: number | null;
    participants: Participant[];
}