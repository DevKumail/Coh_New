import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeepgramService {
  private socket: WebSocket | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private transcriptSubject = new Subject<string>();
  private isRecording = false;
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;

  // Change URL to use correct encoding
  private readonly DEEPGRAM_API_KEY = '9fdf56b01c4d873bf1d2cbeaad4c0a48b1dc609c';
  private readonly DEEPGRAM_URL = `wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000&channels=1&interim_results=true&punctuate=true&model=nova-2&language=en-US&smart_format=true`;

  constructor() {}

  getTranscript$(): Observable<string> {
    return this.transcriptSubject.asObservable();
  }

  async startTranscription(): Promise<void> {
    if (this.isRecording) {
      console.warn('Already recording');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        }
      });

      this.socket = new WebSocket(this.DEEPGRAM_URL, ['token', this.DEEPGRAM_API_KEY]);

      this.socket.onopen = () => {
        this.isRecording = true;
        this.startMediaRecorder(stream);
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          let transcript = '';

          if (data.channel?.alternatives?.[0]?.transcript) {
            transcript = data.channel.alternatives[0].transcript;
          } else if (data.results?.channels?.[0]?.alternatives?.[0]?.transcript) {
            transcript = data.results.channels[0].alternatives[0].transcript;
          } else if (data.transcript) {
            transcript = data.transcript;
          }

          if (transcript && transcript.trim()) {
            this.transcriptSubject.next(transcript);
          }
        } catch (error) {
          console.error('[Deepgram Service] Error parsing message:', error);
        }
      };

      this.socket.onerror = (error) => {
        console.error('[Deepgram Service] WebSocket error:', error);
        this.stopTranscription();
      };

      this.socket.onclose = () => {
        this.isRecording = false;
      };

    } catch (error) {
      console.error('Error starting transcription:', error);
      throw error;
    }
  }

  private async startMediaRecorder(stream: MediaStream): Promise<void> {
    this.audioContext = new AudioContext({ sampleRate: 16000 });
    this.sourceNode = this.audioContext.createMediaStreamSource(stream);
    this.processorNode = this.audioContext.createScriptProcessor(4096, 1, 1);

    this.processorNode.onaudioprocess = (e) => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        const inputData = e.inputBuffer.getChannelData(0);
        const pcmData = new Int16Array(inputData.length);

        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        this.socket.send(pcmData.buffer);
      }
    };

    this.sourceNode.connect(this.processorNode);
    this.processorNode.connect(this.audioContext.destination);
  }

  stopTranscription(): void {
    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode = null;
    }

    if (this.sourceNode) {
      this.sourceNode.disconnect();
      const stream = this.sourceNode.mediaStream;
      stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      this.sourceNode = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.isRecording = false;
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }
}
