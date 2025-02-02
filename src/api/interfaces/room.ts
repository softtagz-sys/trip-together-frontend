import {Group} from "@/api/interfaces/group";

export interface Room {
    id: number;
    title: string;
    date: string;
    groups: Group[];
    code: string;
}