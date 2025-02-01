// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import TextToSpeech from './TextToSpeech'; // Import the TextToSpeech component


export default function SpeechToText() {
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');  // To store the server response

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {

    // Results updated:
    // console.log('Results updated:', results);
  }, [results]); // log the results when they change

  useEffect(() => {
    // Check if the response has changed and automatically trigger text-to-speech
    if (response) {
      console.log('Server response:', response);
    }
  }, [response]); // log the response when it changes

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  // Handle the stop action and send the transcript to the server
  const handleStop = async () => {
    stopSpeechToText(); // Stop speech recognition
    
    // Give some time for the recognition to finish processing
    setTimeout(() => {
      console.log('Results after stopping:', results);

      // Assuming the final result is the last entry in the `results` array
      const finalTranscript = results.slice(-1)[0].transcript;
      setTranscript(finalTranscript);
      // console.log('Final transcript:', finalTranscript);

      // You can uncomment and implement the server request if needed:
      sendTranscriptToServer(finalTranscript);
    }, 500); // Wait a little for the results to update
  };

  // Optional: Function to send the transcript to the server
  const sendTranscriptToServer = async (finalTranscript) => {
    try {
      const response = await fetch('http://localhost:5000/process-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript: finalTranscript }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Server response:', data);

        // Update state with the response from the server
        setResponse(data.response);  // Set the response text to trigger text-to-speech
      } else {
        console.error('Failed to send transcript to server');
      }
    } catch (error) {
      console.error('Error sending transcript to server:', error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 dark:text-white rounded-lg shadow-md mt-5">
      <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
        Recording: {isRecording ? 'ON' : 'OFF'}
      </h1>
      
      <button
        onClick={isRecording ? handleStop : startSpeechToText}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-blue-700 dark:hover:bg-blue-600"
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      
      <ul className="mt-4 space-y-2">
        {results.map((result) => (
          <li key={result.timestamp} className="text-gray-700 dark:text-gray-200">
            {result.transcript}
          </li>
        ))}
        {interimResult && (
          <li className="text-gray-700 dark:text-gray-200">{interimResult}</li>
        )}
      </ul>

      {transcript && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Final Transcript:</h2>
          <p className="text-gray-700 dark:text-gray-200">{transcript}</p>
        </div>
      )}

      {/* Only trigger TextToSpeech component if response is available */}
      {response && <TextToSpeech text={response} />}
    </div>
  );
}
