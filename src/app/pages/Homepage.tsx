'use client'

import React, { useState } from "react"
import { useNavigate } from 'react-router-dom';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { createRoom, getRoomByCode } from "@/api/services/roomService";

export default function Homepage() {
    const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [roomCode, setRoomCode] = useState("");
    const [roomTitle, setRoomTitle] = useState("");
    const [roomDate, setRoomDate] = useState<Date | undefined>(undefined);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleJoinRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (roomCode.length !== 8) {
            setError("RoomPage code must be 8 characters long");
        } else {
            setError("");
            try {
                const room = await getRoomByCode(roomCode);
                navigate(`/${room.code}`);
            } catch {
                setError("Failed to join room. Please check the room code and try again.");
            }
            setIsJoinDialogOpen(false);
        }
    };

    const handleCreateRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomTitle.trim()) {
            setError("Room title is required");
        } else if (!roomDate) {
            setError("Please select a date");
        } else {
            setError("");
            try {
                const room = await createRoom(roomTitle, roomDate);
                navigate(`/${room.code}`);
            } catch {
                setError("Failed to create room. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-3xl mx-auto text-center">
                    <h1 className="text-4xl font-extrabold text-primary sm:text-5xl md:text-6xl">
                        Plan your commute with Trip Together
                    </h1>
                    <p className="mt-6 text-xl text-muted-foreground">
                        TripTogether makes group commutes easy to plan and organize. Create a room for your trip, share a link or code, and form groups by destination and transport type - no accounts required! See all your travel companions in one place and enjoy a simpler, shared journey.
                    </p>
                    <div className="mt-10 space-x-4">
                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="text-lg px-8 py-3">
                                    Create New Room
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create a New Room</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleCreateRoom} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="room-title">Room Title</Label>
                                        <Input
                                            id="room-title"
                                            placeholder="Enter room title"
                                            value={roomTitle}
                                            onChange={(e) => setRoomTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Select Date</Label>
                                        <div className="flex justify-start">
                                            <Calendar
                                                mode="single"
                                                selected={roomDate}
                                                onSelect={setRoomDate}
                                                className="rounded-md border"
                                            />
                                        </div>
                                    </div>
                                    {error && <p className="text-sm text-red-500">{error}</p>}
                                    <Button type="submit" className="w-full">Create Room</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                        <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                                    Join Room
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Join a Room</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleJoinRoom} className="space-y-4">
                                    <Input
                                        placeholder="Enter 8-character room code"
                                        value={roomCode}
                                        onChange={(e) => setRoomCode(e.target.value)}
                                        maxLength={8}
                                    />
                                    {error && <p className="text-sm text-red-500">{error}</p>}
                                    <Button type="submit" className="w-full">Join Room</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </main>
        </div>
    );
}