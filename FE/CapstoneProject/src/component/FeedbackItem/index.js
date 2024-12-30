// src/components/FeedbackItem.js
import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronUp, FaVolumeUp, FaHeadphones, FaCheckCircle, FaExclamationTriangle, FaBookOpen } from "react-icons/fa";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

function FeedbackItem({ fb, parseFeedback }) {
  const [isOpen, setIsOpen] = useState(false);
  const fbData = parseFeedback(fb.feedbackJson);

  useEffect(() => {
    if (fbData) {
      tippy('[data-tippy-content]', {
        allowHTML: true,
        theme: 'light-border',
        interactive: true,
        arrow: true,
      });
    }
  }, [fbData]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const renderErrorList = (title, icon, errors, typeColor) => {
    if (!errors || errors.length === 0) {
      return (
        <div className="mt-3">
          <h3 className={`font-semibold text-sm flex items-center space-x-2 text-${typeColor}-700`}>
            {icon}
            <span>{title}</span>
          </h3>
          <p className="text-sm text-gray-600 ml-6">No {title.toLowerCase()} errors</p>
        </div>
      );
    }

    return (
      <div className="mt-3">
        <h3 className={`font-semibold text-sm flex items-center space-x-2 text-${typeColor}-700`}>
          {icon}
          <span>{title}</span>
        </h3>
        <ul className="mt-2 space-y-2 ml-6">
          {errors.map((err, i) => (
            <li 
              key={i} 
              className="bg-white border border-gray-200 rounded p-2 text-sm relative flex flex-col space-y-1"
            >
              {/* Original */}
              {err.sentence && (
                <div 
                  data-tippy-content={`<strong>Gốc:</strong> ${err.sentence}<br/><strong>Lỗi:</strong> ${err.error}`}
                  className="text-gray-800"
                >
                  <span className="font-bold text-red-600 mr-1">Gốc:</span>{err.sentence}
                </div>
              )}
              {err.word && (
                <div
                  data-tippy-content={`<strong>Từ:</strong> ${err.word}<br/><strong>Lỗi:</strong> ${err.error}`}
                  className="text-gray-800"
                >
                  <span className="font-bold text-red-600 mr-1">Word:</span>{err.word}
                </div>
              )}

              {/* Recommendation */}
              <div
                data-tippy-content={`<strong>Sửa:</strong> ${err.recommendation}`}
                className="text-gray-800"
              >
                <span className="font-bold text-green-700 mr-1">Sửa:</span>{err.recommendation}
              </div>

              {/* Error description */}
              {err.error && (
                <div className="text-gray-600 text-xs">
                  <span className="font-semibold text-red-500 mr-1">Error:</span>{err.error}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 p-4 rounded border border-gray-200 text-sm text-gray-700">
      <div
        className="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors"
        onClick={toggleOpen}
      >
        <div>
          <h3 className="font-semibold text-gray-800">Feedback ID: {fb.id}</h3>
          {fb.submissionTime && (
            <p className="text-xs text-gray-500 mt-1">
              {new Date(fb.submissionTime).toLocaleString()}
            </p>
          )}
        </div>
        <div className="ml-4 text-gray-500">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>

      {isOpen && fbData && (
        <div className="mt-4 space-y-4">
          {/* Transcript */}
          {fb.transcript && (
            <div className="bg-white p-3 rounded border border-gray-200">
              <h4 className="flex items-center space-x-2 text-gray-700 font-semibold">
                <FaVolumeUp className="text-indigo-500"/>
                <span>Transcript</span>
              </h4>
              <p className="text-sm text-gray-700 mt-1 leading-relaxed">{fb.transcript}</p>
            </div>
          )}

          {/* Audio */}
          {fb.audioUrl && (
            <div className="bg-white p-3 rounded border border-gray-200">
              <h4 className="flex items-center space-x-2 text-gray-700 font-semibold">
                <FaHeadphones className="text-indigo-500"/>
                <span>Audio</span>
              </h4>
              <audio controls src={fb.audioUrl} className="w-full mt-2" />
            </div>
          )}

          {/* Errors */}
          <div>
            {renderErrorList("Pronunciation Errors", <FaExclamationTriangle/>, fbData.pronunciationErrors, "blue")}
            {renderErrorList("Grammar Errors", <FaCheckCircle/>, fbData.grammarErrors, "red")}
            {renderErrorList("Vocabulary Errors", <FaBookOpen/>, fbData.vocabularyErrors, "yellow")}
          </div>

          {/* Overall Feedback */}
          {fbData.overallFeedback && (
            <div className="bg-white p-3 rounded border border-gray-200">
              <h4 className="text-gray-800 font-semibold flex items-center space-x-2">
                <FaCheckCircle className="text-green-500"/>
                <span>Overall Feedback</span>
              </h4>
              <p className="text-sm text-gray-700 mt-1 leading-relaxed">{fbData.overallFeedback}</p>
            </div>
          )}
        </div>
      )}

      {isOpen && !fbData && (
        <p className="text-gray-500 mt-4">No detailed feedback data</p>
      )}
    </div>
  );
}

export default FeedbackItem;
