import React from "react";
import FlashcardSetComponent from "./FlashcardSet";
import VocabularyManager from "./VocabularyManager";

const VocabularyPage = () => {
    const userId = JSON.parse(sessionStorage.getItem("user"))?.id;

    return (
        <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">Vocabulary Learning</h1>
            <FlashcardSetComponent userId={userId} />
            <VocabularyManager userId={userId} />
        </div>
    );
};

export default VocabularyPage;
