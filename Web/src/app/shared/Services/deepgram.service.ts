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
        console.log('[Deepgram Service] WebSocket ready state:', this.socket?.readyState);
        this.isRecording = true;
        this.startMediaRecorder(stream);
      };

      this.socket.onmessage = (event) => {
        console.log('═══════════════════════════════════════════════════');
        console.log('[Deepgram Service] 📨 MESSAGE RECEIVED FROM DEEPGRAM');
        console.log('═══════════════════════════════════════════════════');
        console.log('[Deepgram Service] Raw event data:', event.data);

        try {
          const data = JSON.parse(event.data);
          console.log('[Deepgram Service] Parsed data:', data);
          console.log('[Deepgram Service] Data keys:', Object.keys(data));
          console.log('[Deepgram Service] Full data structure:', JSON.stringify(data, null, 2));

          // Check multiple possible response structures
          let transcript = '';

          // Try channel.alternatives structure
          if (data.channel?.alternatives?.[0]?.transcript) {
            transcript = data.channel.alternatives[0].transcript;
            console.log('[Deepgram Service] Found transcript in channel.alternatives:', transcript);
          }
          // Try results structure (alternative Deepgram format)
          else if (data.results?.channels?.[0]?.alternatives?.[0]?.transcript) {
            transcript = data.results.channels[0].alternatives[0].transcript;
            console.log('[Deepgram Service] Found transcript in results.channels:', transcript);
          }
          // Try direct transcript field
          else if (data.transcript) {
            transcript = data.transcript;
            console.log('[Deepgram Service] Found direct transcript:', transcript);
          }

          if (transcript && transcript.trim()) {
            console.log('[Deepgram Service] ✅ Valid transcript found, emitting:', transcript);
            console.log('[Deepgram Service] Transcript length:', transcript.length);
            this.transcriptSubject.next(transcript);
          } else {
            console.log('[Deepgram Service] ⚠️ No valid transcript in this message');
          }
        } catch (error) {
          console.error('[Deepgram Service] ❌ Error parsing message:', error);
        }
        console.log('═══════════════════════════════════════════════════');
      };

      this.socket.onerror = (error) => {
        console.error('[Deepgram Service] ❌ WebSocket error:', error);
        this.stopTranscription();
      };

      this.socket.onclose = (event) => {
        console.log('[Deepgram Service] Deepgram connection closed');
        console.log('[Deepgram Service] Close code:', event.code);
        console.log('[Deepgram Service] Close reason:', event.reason);
        this.isRecording = false;
      };

    } catch (error) {
      console.error('Error starting transcription:', error);
      throw error;
    }
  }

  private async startMediaRecorder(stream: MediaStream): Promise<void> {
    console.log('[Deepgram Service] Setting up audio processing...');

    // Create AudioContext for proper audio processing
    this.audioContext = new AudioContext({ sampleRate: 16000 });
    this.sourceNode = this.audioContext.createMediaStreamSource(stream);

    // Create processor for converting audio to correct format
    this.processorNode = this.audioContext.createScriptProcessor(4096, 1, 1);

    this.processorNode.onaudioprocess = (e) => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        const inputData = e.inputBuffer.getChannelData(0);

        // Convert Float32Array to Int16Array (linear16 format)
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
          const s = Math.max(-1, Math.min(1, inputData[i]));
          pcmData[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        console.log('[Deepgram Service] 📡 Sending PCM audio chunk, size:', pcmData.byteLength);
        this.socket.send(pcmData.buffer);
      }
    };

    this.sourceNode.connect(this.processorNode);
    this.processorNode.connect(this.audioContext.destination);

    console.log('[Deepgram Service] ✅ Audio processing started with Web Audio API');
  }

  stopTranscription(): void {
    console.log('[Deepgram Service] Stopping transcription...');

    // Disconnect and cleanup audio nodes
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

    // Close audio context
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    // Close WebSocket
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }

    this.isRecording = false;
    console.log('[Deepgram Service] ✅ Transcription stopped');
  }

  isCurrentlyRecording(): boolean {
    return this.isRecording;
  }
}
