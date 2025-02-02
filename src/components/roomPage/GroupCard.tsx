import React from 'react';
import { Group } from '@/api/interfaces/group';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import TransportIcon from './TransportIcon';

const GroupCard = ({ group, onJoin, onLeave, onDelete }: { group: Group; onClose: () => void; onJoin: () => void; onLeave: (participantId: number) => void; onDelete: (groupId: number) => void }) => {
    return (
        <div className="relative">
            <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                    {group.destination}
                    <TransportIcon type={group.transportType} />
                </DialogTitle>
                <DialogDescription>
                    Transport: {group.transportType.toLowerCase()}
                </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
                {group.maxParticipants !== null ? (
                    <p className="text-lg font-semibold">
                        {group.participants.length} / {group.maxParticipants} commuters joined
                    </p>
                ) : (
                    <p className="text-lg font-semibold">
                        {group.participants.length} commuters joined
                    </p>
                )}
                <h3 className="text-xl font-semibold mt-6 mb-2">Participants:</h3>
                <ScrollArea className="h-[200px]">
                    <ul className="space-y-2">
                        {group.participants.map((participant, index) => (
                            <li key={index} className="text-sm flex items-center">
                                <Button onClick={() => onLeave(participant.id)} className="mr-2 p-1" variant="ghost">
                                    <X className="w-3 h-3" />
                                </Button>
                                {participant.name} - {participant.destination}
                            </li>
                        ))}
                    </ul>
                </ScrollArea>
                <Button onClick={onJoin} className="mt-4 w-full">Join Group</Button>
                {group.participants.length === 0 && (
                    <Button onClick={() => onDelete(group.id)} className="mt-4 w-full" variant="destructive">Delete Group</Button>
                )}
            </div>
        </div>
    );
};

export default GroupCard;