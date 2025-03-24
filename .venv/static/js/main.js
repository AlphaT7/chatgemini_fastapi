import UI from "./ui.js";
import appState from "./appState.js";
import AudioInput from "./audioInput.js";
import AudioOutput from "./audioOutput.js";

const synth = speechSynthesis;
const $ = document.querySelector.bind(document);
const userState = new UI();
let websocket;

async function init(synth) {
  if (typeof speechSynthesis === "undefined") return;

  let defaultVoice =
    speechSynthesis.getVoices().find((voice) => voice.name == "Daniel") ||
    speechSynthesis.getVoices().find((voice) => voice.default);

  const synthObj = {
    synth: synth,
    defaultVoice: defaultVoice,
  };

  const AppState = new appState();

  const audioOutput = new AudioOutput(synthObj, AppState);

  websocket = new WebSocket("ws://" + location.host + "/ws/" + self.crypto.randomUUID());

  websocket.addEventListener("message", async (e) => {
    const regex = /\*\*/g;
    let output = (await e.data).replaceAll(regex, "");
    await userState.update("aiTranscript", output).then(async () => {
      if (await userState.update("isSpeechOn")) {
        await audioOutput.speak(output);
        await userState.update("showCancelSpeech");
      } else {
        await AppState.setListeningState(false);
        await userState.update("isNotListening");
      }
    });
  });

  const audioAnalysis = new AudioInput(audioOutput, AppState, websocket);

  $("#button").addEventListener("pointerup", () => {

    if ($("#button").dataset.type == "listen") {
      if (AppState.getListeningState()) return;
      audioOutput.speak(""); // necessary to start the speech synthesis; if not included, audioOutput.speak() will not work on IOS;
      audioAnalysis.start();
    } else {
      audioOutput.stop();
    }
  });
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    websocket.close();
  } else {
    setTimeout(() => init(synth), 100)
  }
});

document.addEventListener("DOMContentLoaded", () => { setTimeout(() => init(synth, websocket), 100); });