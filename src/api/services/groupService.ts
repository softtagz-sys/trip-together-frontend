import { BASE_URL } from "@/config";

export const createGroup = async (roomId: number, destination: string, transportType: string, maxParticipants: number | null) => {
    // Set maxParticipants to null if transportType is not 'car'
    const participantsLimit = transportType === 'car' ? maxParticipants : null;

    const response = await fetch(`${BASE_URL}/api/groups/create/${roomId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ destination, transportType, maxParticipants: participantsLimit }),
    });

    if (!response.ok) {
        throw new Error(`Failed to create group: ${response.statusText}`);
    }

    return response.json();
}

export const deleteGroup = async (groupId: number) => {
    const response = await fetch(`${BASE_URL}/api/groups/delete/${groupId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(`Failed to remove group: ${response.statusText}`);
    }
}