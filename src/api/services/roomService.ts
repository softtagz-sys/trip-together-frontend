import {Room} from "@/api/interfaces/room";
import {BASE_URL} from "@/config";


export const createRoom = async (title: string, date: Date) => {
    const response = await fetch(`${BASE_URL}/api/rooms/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, date: date.toISOString() }),
    });

    if (!response.ok) {
        throw new Error(`Failed to create room: ${response.statusText}`);
    }

    return response.json();
};

export const getRoomByCode = async (code: string): Promise<Room> => {
    const response = await fetch(`${BASE_URL}/api/rooms/${code}`);
    if (!response.ok) {
        throw new Error('Failed to fetch room information');
    }
    return response.json();
};