const $ = document.querySelector.bind(document);
const userColor = "#19ab33";
const aiColor = "#1e90ff";
const defaultColor = "#595959";
const cancelColor = "#ff4d4d";

export default class UI {
  constructor() { }

  async update(func, options) {
    return this[func](options);
  }

  async isSpeechOn() {
    return $("#isSpeechOn").checked;
  }

  async aiProcessing() {
    $("#listening").style.color = aiColor;
    $("#listening").innerHTML = "AI processing...";
    $("#buttonIcon").style.color = aiColor;
    $("#button").style.borderColor = aiColor;
    $("#buttonIcon").classList.add("fa-clock-o");
    $("#buttonIcon").classList.remove("fa-microphone");
    $("#micOnIndicator").style.color = aiColor;
    $("#micOnIndicator").style.textShadow = `0 0 5px ${aiColor}`;
    $("#micOnIndicator").classList.add("fa-clock-o");
    $("#micOnIndicator").classList.remove("fa-microphone");
  }

  async isListening() {
    $("#listening").style.color = userColor;
    $("#listening").innerHTML = "Listening...";
    $("#buttonIcon").style.color = userColor;
    $("#button").style.borderColor = userColor;
    $("#button").classList.add("box-ripple");
    setTimeout(() => {
      $("#button").classList.remove("box-ripple");
    }, 900);
    $("#micOnIndicator").style.color = userColor;
    $("#micOnIndicator").style.textShadow = `0 0 5px ${userColor}`;
  }

  async scrollToEnd() {
    $("#scrollMargin")?.remove();
    $("#terminal").innerHTML += "<div id='scrollMargin'></div>";
    $("#tabContent1").scrollTop = $("#tabContent1").scrollHeight;

  }

  async showCancelSpeech() {
    $("#listening").style.color = aiColor;
    $("#listening").innerHTML = "AI speech in process...";
    $("#buttonIcon").classList.remove("fa-microphone");
    $("#buttonIcon").classList.add("fa-ban");
    $("#buttonIcon").style.color = cancelColor;;
    $("#button").style.borderColor = cancelColor;
    $("#button").dataset.type = "cancel";
    $("#micOnIndicator").style.color = aiColor;
    $("#micOnIndicator").style.textShadow = `0 0 5px ${aiColor}`;
    $("#micOnIndicator").classList.add("fa-volume-up");
    $("#micOnIndicator").classList.remove("fa-clock-o");
  }

  async isNotListening() {
    $("#micOnIndicator").classList.remove("fa-clock-o");
    $("#micOnIndicator").classList.add("fa-microphone");
    $("#buttonIcon").classList.remove("fa-clock-o");
    $("#buttonIcon").classList.add("fa-microphone");
    $("#listening").style.color = defaultColor;
    $("#listening").innerHTML = "Press the button and start talking! =)";
    $("#micOnIndicator").style.textShadow = "none";
    $("#buttonIcon").style.color = defaultColor;
    $("#button").style.borderColor = defaultColor;
    $("#micOnIndicator").style.color = "unset";
  }

  async hideCancelSpeech() {
    $("#buttonIcon").classList.remove("fa-ban");
    $("#buttonIcon").classList.add("fa-microphone");
    $("#button").dataset.type = "listen";
  }

  async userTranscript(input) {
    $("#terminal").innerHTML += `<div class="userTranscript">${input}</div>`;
    await this.scrollToEnd();
  }

  async aiTranscript(input) {
    $("#terminal").innerHTML += `<div class="aiTranscript">${input}</div>`;
    await this.scrollToEnd();
  }
}
