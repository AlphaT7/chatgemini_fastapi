import UI from "./ui.js";
const userState = new UI();


export default class AudioInput {
  constructor(audioOutput, AppState, websocket) {
    this.audioOutput = audioOutput;
    this.SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    this.AudioAnalysis = new this.SpeechRecognition();
    this.AppState = AppState;
    this.websocket = websocket;
  }

  async submitQuery(input) {
    await userState.update("aiProcessing");
    this.websocket.send(input);
  }

  async start() {
    if (this.AppState.getListeningState()) return;
    this.AppState.setListeningState(true);
    this.AudioAnalysis.onresult = (e) => {
      let transcript = e.results[0][0].transcript.toString().toLowerCase();
      userState.update("userTranscript", transcript);
      this.AppState.setAiProcessingState(true);
      this.submitQuery(transcript);
    };

    this.AudioAnalysis.addEventListener("start", () => {
      userState.update("isListening");
    });

    this.AudioAnalysis.addEventListener("end", async (e) => {
      if (!this.AppState.getAiProcessingState()) {
        userState.update("isNotListening");
        this.AppState.setListeningState(false);
      }
    });

    this.AudioAnalysis.onerror = (e) => {
      console.log(`Recognition Error: ${e.error}`);
      userState.update("aiTranscript", "Sorry, I didn't catch that.");
      userState.update("isNotListening");
      this.AppState.setListeningState(false);
    };

    this.AudioAnalysis.start();
  }
}
