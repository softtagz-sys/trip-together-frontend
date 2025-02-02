import { BASE_URL } from "@/config";

export const joinGroup = async (groupId: number, name: string, destination: string) => {
    const response = await fetch(`${BASE_URL}/api/participants/add/${groupId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, destination }),
    });

    if (!response.ok) {
        throw new Error(`Failed to join group: ${response.statusText}`);
    }

    return response.json();
};

export const leaveGroup = async (groupId: number, participantId: number) => {
    const response = await fetch(`${BASE_URL}/api/participants/remove/${participantId}/${groupId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Failed to leave group: ${response.statusText}`);
    }
};