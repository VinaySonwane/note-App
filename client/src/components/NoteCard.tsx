// client/src/components/NoteCard.tsx
import React, { useState } from "react";

interface NoteCardProps {
  note: {
    _id: string;
    content: string;
  };
  onDelete: (noteId: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const characterLimit = 200;
  const isLongNote = note.content.length > characterLimit;

  const displayContent = isExpanded
    ? note.content
    : `${note.content.substring(0, characterLimit)}${isLongNote ? "..." : ""}`;

  return (
    <div className="bg-white p-4 rounded-lg shadow flex justify-between items-start">
      <div className="flex-1">
        <p className="text-gray-800 whitespace-pre-wrap">{displayContent}</p>
        {isLongNote && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-blue-600 text-sm font-semibold mt-2"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
      <button
        onClick={() => onDelete(note._id)}
        className="ml-4 text-red-500 hover:text-red-700 text-sm font-bold flex-shrink-0"
      >
        Delete
      </button>
    </div>
  );
};

export default NoteCard;
