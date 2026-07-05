import { useParams } from "react-router-dom";

const EditEvent = () => {
    const { id } = useParams();

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Edit Event</h1>
            <p>Editing Event ID: {id}</p>
        </div>
    );
};

export default EditEvent;