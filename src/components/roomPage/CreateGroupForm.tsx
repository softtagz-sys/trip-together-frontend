import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Group } from '@/api/interfaces/group';

const CreateGroupForm = ({ onSubmit, onCancel }: { onSubmit: (group: Omit<Group, 'id' | 'participants'>) => void; onCancel: () => void }) => {
    const [destination, setDestination] = useState("");
    const [transportationType, setTransportationType] = useState<Group['transportType']>("bus");
    const [totalSlots, setTotalSlots] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            destination,
            transportType: transportationType,
            maxParticipants: transportationType === 'car' ? parseInt(totalSlots) : null
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="destination">Destination</Label>
                <Input
                    id="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                />
            </div>
            <div>
                <Label htmlFor="transportationType">Transport Type</Label>
                <Select value={transportationType} onValueChange={(value: Group['transportType']) => setTransportationType(value)}>
                    <SelectTrigger id="transportationType">
                        <SelectValue placeholder="Select transport type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="public transport">Public Transport</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="bike">Bike</SelectItem>
                        <SelectItem value="foot">Walk</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {transportationType === 'car' && (
                <div>
                    <Label htmlFor="totalSlots">Total Slots</Label>
                    <Input
                        id="totalSlots"
                        type="number"
                        min="1"
                        value={totalSlots}
                        onChange={(e) => setTotalSlots(e.target.value)}
                        required
                    />
                </div>
            )}
            <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">Create Group</Button>
            </div>
        </form>
    );
};

export default CreateGroupForm;