"use client";

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Calendar } from "react-calendar";
import 'react-calendar/dist/Calendar.css'; 

import { useState } from "react";
import CalendarModal from "@/components/modals/calendar-modal";

const DocumetsPage = () => {
    const router = useRouter();
    const { user } = useUser();
    const create = useMutation(api.documents.create);

        // State for managing the selected date
        //const [selectedDate, setSelectedDate] = useState<Date>(new Date());
        const [selectedDate, setSelectedDate] = useState<Date | null>(null);
        const [showModal, setShowModal] = useState(false);
        const [events, setEvents] = useState<any[]>([]); // State variable to store events data

        // Dummy events data for demonstration purposes
        const dummyEvents = [
            { date: new Date(2024, 3, 17), title: "Event 1", time: "10:00 AM", description: "Description for Event 1" },
            { date: new Date(2024, 3, 17), title: "Event 2", time: "2:00 PM", description: "Description for Event 2" },
            { date: new Date(2024, 3, 18), title: "Event 3", time: "12:00 PM", description: "Description for Event 3" },
            // Add more events as needed
        ];

        // Function to filter events for a specific date
        const getEventsForDate = (date: Date): any[] => {
            return events.filter(event => event.date.toDateString() === date.toDateString());
        };

        // Function to handle date selection
        const onChange = (date: Date | Date[]) => {
            if (!Array.isArray(date)) {
                setSelectedDate(date);
                setShowModal(true); // Open the modal when a date is clicked
            }
        };

        const handleCloseModal = () => {
            setShowModal(false); //close the modal
        }

        const handleAddEvent = (eventDetails: any) => {
            // Implement logic to add the event to the calendar (e.g., send to backend)
            console.log("Adding event for date:", selectedDate);
            console.log("Event details:", eventDetails);
            // Update events data with the new event
            setEvents(prevEvents => [...prevEvents, { ...eventDetails, date: selectedDate }]);
            handleCloseModal(); // Close the modal after adding the event
        };

        // Render event indicators on calendar dates
        const tileContent = ({ date, view }: any) => {
            if (view === 'month') {
                const eventsForDate = getEventsForDate(date);
                if (eventsForDate.length > 0) {
                    return <p style={{ fontSize: '12px', margin: '0', lineHeight: '1.2' }}>{eventsForDate.length} event(s)</p>;
                }
            }
        };

    const onCreate = () => {
        const promise = create({ title: "Untitled" })
            .then((documentId) => router.push(`/documents/${documentId}`))

        toast.promise(promise, {
            loading: "Creating a new note...",
            success: "new note created!",
            error: "Failed to create a new note."
        });
    };

    return (
        <div className="h-full flex flex-col items-center justify-center space-y-4">
            <Image 
                src="/docs-empty-lightmode.png"
                height="300"
                width="300"
                alt="Empty"
                className="dark:hidden"
            />
            <Image 
                src="/docs-empty-darkmode.png"
                height="300"
                width="300"
                alt="Empty"
                className="hidden dark:block"
            />
            <h2 className="text-lg font-medium">
                Welcome to {user?.firstName}&apos;s UniSphere
            </h2>
            <Button onClick={onCreate}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Create a note
            </Button>
            <div className="h-full flex flex-col items-center justify-center space-y-4">
                <h2 className="text-lg font-medium">Calendar</h2>
                <Calendar
                    onChange={onChange}
                    value={selectedDate}
                    tileContent={tileContent} // Render event indicators on calendar dates
                />
                {/* Render the modal if showModal is true */}
                {showModal && (
                    <CalendarModal onClose={handleCloseModal} selectedDate={selectedDate} onAddEvent={handleAddEvent} />
                )}
            </div>
        </div>
    );
};

export default DocumetsPage;