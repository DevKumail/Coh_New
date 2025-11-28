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

  private readonly DEEPGRAM_API_KEY = '9fdf56b01c4d873bf1d2cbeaad4c0a48b1dc609c';
  private readonly DEEPGRAM_URL = `wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000&channels=1&interim_results=true&punctuate=true`;

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
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000
        }
      });

      // Connect to Deepgram WebSocket
      this.socket = new WebSocket(this.DEEPGRAM_URL, ['token', this.DEEPGRAM_API_KEY]);

      this.socket.onopen = () => {
        console.log('Deepgram connection opened');
        this.isRecording = true;
        this.startMediaRecorder(stream);
      };

      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.channel?.alternatives?.[0]?.transcript) {
          const transcript = data.channel.alternatives[0].transcript;
          if (transcript.trim()) {
            this.transcriptSubject.next(transcript);
          }
        }
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.stopTranscription();
      };

      this.socket.onclose = () => {
        console.log('Deepgram connection closed');
        this.isRecording = false;
      };

    } catch (error) {
      console.error('Error starting transcription:', error);
      throw error;
    }
  }

  private startMediaRecorder(stream: MediaStream): void {
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm'
    });

    this.mediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data.size > 0 && this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(event.data);
      }
    });

    this.mediaRecorder.start(250); // Send data every 250ms
  }

  stopTranscription(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      this.mediaRecorder = null;
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
