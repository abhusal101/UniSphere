import { useState } from "react";

interface CalendarModalProps {
    onClose: () => void;
    selectedDate: Date | null;
    onAddEvent: (eventDetails: any) => void;
}

const CalendarModal: React.FC<CalendarModalProps> = ({ onClose, selectedDate, onAddEvent }) => {
    const [eventDetails, setEventDetails] = useState({
        title: '',
        time: '',
        description: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEventDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddEvent = () => {
        // Pass event details to the parent component to handle event creation
        onAddEvent({
            ...eventDetails,
            date: selectedDate // Include the selected date in event details
        });
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Add Event</h2>
                <p>Date: {selectedDate?.toLocaleDateString()}</p>
                <input type="text" name="title" placeholder="Title" value={eventDetails.title} onChange={handleInputChange} />
                <input type="text" name="time" placeholder="Time" value={eventDetails.time} onChange={handleInputChange} />
                <textarea name="description" placeholder="Description" value={eventDetails.description} onChange={handleInputChange}></textarea>
                <button onClick={handleAddEvent}>Add Event</button>
            </div>
        </div>
    );
};

export default CalendarModal;
