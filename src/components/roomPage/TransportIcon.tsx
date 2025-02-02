import React from 'react';
import { Bike, Bus, Car, Footprints } from 'lucide-react';
import { Group } from '@/api/interfaces/group';

const TransportIcon = ({ type }: { type: Group["transportType"] }) => {
    switch (type) {
        case "PUBLIC_TRANSPORT":
            return <Bus className="w-6 h-6" />;
        case "CAR":
            return <Car className="w-6 h-6" />;
        case "BIKE":
            return <Bike className="w-6 h-6" />;
        case "FOOT":
            return <Footprints className="w-6 h-6" />;
        default:
            return null;
    }
};

export default TransportIcon;