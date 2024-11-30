import React, { useEffect, useState } from "react";
import { getAllVocabulary, addVocabulary, createFlashcardSet } from "../../../api/apiService/dataService";

const VocabularyManager = ({ userId }) => {
    const [vocabularies, setVocabularies] = useState([]);
    const [newWord, setNewWord] = useState("");
    const [newDefinition, setNewDefinition] = useState("");
    const [newExample, setNewExample] = useState("");
    const [selectedVocabIds, setSelectedVocabIds] = useState([]);
    const [setTitle, setSetTitle] = useState("");
    const [setDescription, setSetDescription] = useState("");

    useEffect(() => {
        const fetchVocabulary = async () => {
            try {
                const vocab = await getAllVocabulary();
                setVocabularies(vocab);
            } catch (error) {
                console.error("Error fetching vocabulary:", error);
            }
        };
        fetchVocabulary();
    }, []);

    const handleAddVocabulary = async () => {
        if (!newWord.trim() || !newDefinition.trim()) {
            alert("Please enter both word and definition.");
            return;
        }
        try {
            const addedVocab = await addVocabulary({
                word: newWord,
                definition: newDefinition,
                example: newExample,
            });
            setVocabularies([...vocabularies, addedVocab]);
            setNewWord("");
            setNewDefinition("");
            setNewExample("");
        } catch (error) {
            console.error("Error adding vocabulary:", error);
            alert("Failed to add vocabulary.");
        }
    };

    const handleCreateSet = async () => {
        if (!setTitle.trim()) {
            alert("Please enter a title for the flashcard set.");
            return;
        }
        try {
            const flashcardSet = await createFlashcardSet(userId, setTitle, setDescription, selectedVocabIds);
            alert("Flashcard set created successfully!");
            // Reset fields or update UI as needed
            setSetTitle("");
            setSetDescription("");
            setSelectedVocabIds([]);
        } catch (error) {
            console.error("Error creating flashcard set:", error);
            alert("Failed to create flashcard set.");
        }
    };

    const toggleSelectVocab = (id) => {
        if (selectedVocabIds.includes(id)) {
            setSelectedVocabIds(selectedVocabIds.filter(vocabId => vocabId !== id));
        } else {
            setSelectedVocabIds([...selectedVocabIds, id]);
        }
    };

    return (
        <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Manage Vocabulary</h2>
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Add New Vocabulary</h3>
                <input 
                    type="text" 
                    value={newWord} 
                    onChange={(e) => setNewWord(e.target.value)} 
                    placeholder="Word" 
                    className="border p-2 mr-2 rounded"
                />
                <input 
                    type="text" 
                    value={newDefinition} 
                    onChange={(e) => setNewDefinition(e.target.value)} 
                    placeholder="Definition" 
                    className="border p-2 mr-2 rounded"
                />
                <input 
                    type="text" 
                    value={newExample} 
                    onChange={(e) => setNewExample(e.target.value)} 
                    placeholder="Example (optional)" 
                    className="border p-2 mr-2 rounded"
                />
                <button 
                    onClick={handleAddVocabulary}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Add
                </button>
            </div>
            <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Select Vocabulary for New Flashcard Set</h3>
                <div className="max-h-64 overflow-y-auto border p-4 rounded">
                    {vocabularies.map(vocab => (
                        <div key={vocab.id} className="flex items-center mb-2">
                            <input 
                                type="checkbox" 
                                checked={selectedVocabIds.includes(vocab.id)} 
                                onChange={() => toggleSelectVocab(vocab.id)}
                                className="mr-2"
                            />
                            <span>{vocab.word} - {vocab.definition}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <input 
                        type="text" 
                        value={setTitle} 
                        onChange={(e) => setSetTitle(e.target.value)} 
                        placeholder="Flashcard Set Title" 
                        className="border p-2 mr-2 rounded"
                    />
                    <input 
                        type="text" 
                        value={setDescription} 
                        onChange={(e) => setSetDescription(e.target.value)} 
                        placeholder="Description (optional)" 
                        className="border p-2 mr-2 rounded"
                    />
                    <button 
                        onClick={handleCreateSet}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Create Flashcard Set
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VocabularyManager;
