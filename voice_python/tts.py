import pyttsx3

# Initialize the TTS engine
engine = pyttsx3.init()

# Set properties (optional)
engine.setProperty('rate', 150)  # Speed of speech
engine.setProperty('volume', 1)  # Volume level (0.0 to 1.0)

# The text you want to convert to speech
text = """Server response: This code defines two asynchronous JavaScript functions, `generateMCQs` and `generateLearningPath`, both designed to interact with a Flask backend API.

* **`generateMCQs(topic, timeframe)`**: This function sends a POST request to the `/generate_mcqs` endpoint of the API.  It sends the `topic` and `timeframe` parameters as a JSON payload in the request body. The function expects the API to respond with JSON data containing an `mcqs` field, which it then returns.  Presumably, this endpoint generates multiple-choice questions (MCQs) related to the given `topic` and `timeframe`.

* **`generateLearningPath(topic, timeframe, userResponses)`**: This function sends a POST request to the `/generate_learning_path` endpoint.  Similar to `generateMCQs`, it sends `topic` and `timeframe`, but also includes `userResponses` (presumably answers to previously presented MCQs) in the JSON payload.  It expects the API to return JSON data containing a `learning_path` field, which it then returns. This endpoint likely uses the user's responses to generate a personalized learning path.

Both functions use the `API_BASE_URL` constant to construct the full URL for the API requests.  This allows for easy configuration of the API's base URL, especially useful when switching between development and production environments.  The code is duplicated, but the functionality is the same.  It's designed to fetch data from a backend API and return specific parts of the JSON response."""

# Convert text to speech
engine.say(text)

# Wait for the speech to finish
engine.runAndWait()
