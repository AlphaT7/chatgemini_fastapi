import UI from "./ui.js";
const userState = new UI();

export default class audioOutput {
  constructor(synthObj, appState) {
    this.synth = synthObj.synth;
    this.defaultVoice = synthObj.defaultVoice;
    this.speaking = false;
    this.count = 0;
    this.AppState = appState;
  }

  async speechInProgress() {
    setTimeout(async () => {
      // necessary to poll the synth.speaking property to check if the speech synthesis is still in progress;
      // the builtin start/stop events for the speech synthesis are not reliable;
      if (await this.isSpeaking()) {
        this.speechInProgress();
      } else {
        this.speaking = false;
        await userState.update("hideCancelSpeech");
        await userState.update("isNotListening");
        this.AppState.setListeningState(false);
      }
    }, 300);
  }

  async speak(output) {
    if (output === "" && this.defaultVoice.name !== "Daniel") return; // returns if the device is not IOS; ("Daniel" is a voice that is only available on IOS devices);
    const text = new SpeechSynthesisUtterance(output);
    text.voice = this.defaultVoice;
    this.synth.speak(text);
    this.speechInProgress();
    this.AppState.setAiProcessingState(false);
  }

  async stop() {
    this.synth.cancel();
    this.AppState.setListeningState(false);
    userState.update("hideCancelSpeech");
    userState.update("isNotListening");
  }

  async isSpeaking() {
    return this.synth.speaking;
  }
}
