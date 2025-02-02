import React, { useEffect, useState } from 'react';
import { getRoomByCode } from '@/api/services/roomService';
import {createGroup, deleteGroup} from '@/api/services/groupService';
import { Room } from '@/api/interfaces/room';
import { Group } from '@/api/interfaces/group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Plus, Copy } from 'lucide-react';
import TransportIcon from '@/components/roomPage/TransportIcon';
import GroupCard from '@/components/roomPage/GroupCard';
import JoinGroupForm from '@/components/roomPage/JoinGroupForm';
import CreateGroupForm from '@/components/roomPage/CreateGroupForm';
import { joinGroup, leaveGroup } from "@/api/services/participantService";

const RoomPage = ({ code }: { code: string }) => {
    const [room, setRoom] = useState<Room | null>(null);
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [isJoining, setIsJoining] = useState(false);
    const [isCreatingGroup, setIsCreatingGroup] = useState(false);

    useEffect(() => {
        const fetchRoom = async () => {
            if (!code) return;
            try {
                const room: Room = await getRoomByCode(code);
                setRoom(room);
                setGroups(room.groups);
            } catch (error) {
                console.error("Failed to fetch room:", error);
            }
        };

        fetchRoom();
    }, [code]);

    const handleJoin = async (name: string, destination: string) => {
        if (!selectedGroup || !selectedGroup.participants) return;

        if (selectedGroup.maxParticipants !== null && selectedGroup.participants.length >= selectedGroup.maxParticipants) {
            console.error("Cannot join group: maximum number of participants reached");
            return;
        }

        try {
            const newParticipant = await joinGroup(selectedGroup.id, name, destination);
            const updatedGroup = {
                ...selectedGroup,
                participants: [
                    ...selectedGroup.participants,
                    newParticipant
                ]
            };
            setGroups(groups.map(group => group.id === selectedGroup.id ? updatedGroup : group));
            setSelectedGroup(updatedGroup);
            setIsJoining(false);
        } catch (error) {
            console.error("Failed to join group:", error);
        }
    };

    const handleLeave = async (participantId: number) => {
        if (!selectedGroup) return;

        try {
            await leaveGroup(selectedGroup.id, participantId);
            const updatedGroup = {
                ...selectedGroup,
                participants: selectedGroup.participants.filter(participant => participant.id !== participantId)
            };
            setGroups(groups.map(group => group.id === selectedGroup.id ? updatedGroup : group));
            setSelectedGroup(updatedGroup);
        } catch (error) {
            console.error("Failed to leave group:", error);
        }
    };

    const handleCreateGroup = async (newGroup: Omit<Group, 'id' | 'participants'>) => {
        if (!room) return;
        try {
            const maxParticipants = newGroup.transportType === 'car' ? newGroup.maxParticipants : null;
            const createdGroup = await createGroup(room.id, newGroup.destination, newGroup.transportType, maxParticipants);
            const updatedGroup = { ...createdGroup, participants: [] };
            setGroups([...groups, updatedGroup]);
            setIsCreatingGroup(false);
        } catch (error) {
            console.error("Failed to create group:", error);
        }
    };

    const handleDeleteGroup = async (groupId : number) => {
        try {
            await deleteGroup(groupId);
            setGroups(groups.filter(group => group.id !== groupId));
            setSelectedGroup(null);
        } catch (error) {
            console.error('Failed to delete group:', error);
        }
    };

    const handleCopyToClipboard = () => {
        const roomUrl = `${window.location.origin}/${code}`;
        navigator.clipboard.writeText(roomUrl)
            .then(() => {
                console.log('Room URL copied to clipboard');
            })
            .catch((error) => {
                console.error('Failed to copy room URL:', error);
            });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-2">{room?.title}</h1>
                <p className="text-xl text-muted-foreground mb-1 cursor-pointer flex items-center justify-center" onClick={handleCopyToClipboard}>
                    Room Code: {code} <Copy className="ml-2 w-5 h-5" />
                </p>
            </header>

            <div className="mb-6 flex justify-center">
                <Button onClick={() => setIsCreatingGroup(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Group
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groups.map((group) => (
                    <Card key={group.id} className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                          onClick={() => setSelectedGroup(group)}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-2xl font-bold">{group.destination}</CardTitle>
                            <TransportIcon type={group.transportType} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground mb-4">
                                Transport: {group.transportType.toLowerCase()}
                            </div>
                            <div className="flex justify-between items-center">
                                {group.maxParticipants !== null ? (
                                    <span className="text-lg font-semibold">
                                        {group.participants.length} / {group.maxParticipants} commuters joined
                                    </span>
                                ) : (
                                    <span className="text-lg font-semibold">
                                        {group.participants.length} commuters joined
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={selectedGroup !== null} onOpenChange={(open) => !open && setSelectedGroup(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    {selectedGroup && (
                        <GroupCard
                            group={selectedGroup}
                            onClose={() => setSelectedGroup(null)}
                            onJoin={() => setIsJoining(true)}
                            onLeave={handleLeave}
                            onDelete={handleDeleteGroup}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Dialog open={isJoining} onOpenChange={(open) => !open && setIsJoining(false)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Join Group</DialogTitle>
                        <DialogDescription>
                            Enter your details to join the group
                        </DialogDescription>
                    </DialogHeader>
                    <JoinGroupForm
                        onSubmit={handleJoin}
                        onCancel={() => setIsJoining(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={isCreatingGroup} onOpenChange={(open) => !open && setIsCreatingGroup(false)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create New Group</DialogTitle>
                        <DialogDescription>
                            Enter the details for the new group
                        </DialogDescription>
                    </DialogHeader>
                    <CreateGroupForm
                        onSubmit={handleCreateGroup}
                        onCancel={() => setIsCreatingGroup(false)}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default RoomPage;