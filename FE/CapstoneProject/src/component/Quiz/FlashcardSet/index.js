import React, { useEffect, useState } from "react";
import Flashcard from "./Flashcard";
import { getFlashcardSetsByUser, getVocabulary } from "../../../api/apiService/dataService";

const FlashcardSetComponent = ({ userId }) => {
    const [flashcardSets, setFlashcardSets] = useState([]);
    const [selectedSet, setSelectedSet] = useState(null);
    const [vocabularies, setVocabularies] = useState([]);

    useEffect(() => {
        const fetchSets = async () => {
            try {
                const sets = await getFlashcardSetsByUser(userId);
                setFlashcardSets(sets);
                if (sets.length > 0) {
                    setSelectedSet(sets[0]);
                    setVocabularies(sets[0].flashcards.map(flashcard => flashcard.vocabulary));
                }
            } catch (error) {
                console.error("Error fetching flashcard sets:", error);
            }
        };
        fetchSets();
    }, [userId]);

    const handleSetChange = (set) => {
        setSelectedSet(set);
        setVocabularies(set.flashcards.map(flashcard => flashcard.vocabulary));
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Your Flashcard Sets</h2>
            <div className="mb-6">
                {flashcardSets.map(set => (
                    <button 
                        key={set.id} 
                        onClick={() => handleSetChange(set)}
                        className={`px-4 py-2 mr-2 mb-2 rounded ${selectedSet && selectedSet.id === set.id ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700"}`}
                    >
                        {set.title}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
                {vocabularies.map(vocab => (
                    <Flashcard 
                        key={vocab.id} 
                        word={vocab.word} 
                        definition={vocab.definition} 
                        example={vocab.example} 
                    />
                ))}
            </div>
        </div>
    );
};

export default FlashcardSetComponent;
