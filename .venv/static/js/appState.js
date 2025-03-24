export default class appState {
    constructor() {
        this.isListening = false;
        this.isSpeaking = false;
        this.aiProcessing = false;
    }

    getListeningState() {
        return this.isListening;
    }

    setListeningState(value) {
        this.isListening = value;
    }

    getAiProcessingState() {
        return this.aiProcessing;
    }

    setAiProcessingState(value) {
        this.aiProcessing = value;
    }
}