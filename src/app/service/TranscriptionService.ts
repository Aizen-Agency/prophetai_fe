import { AudioRecording } from '@/lib/audioUtils';

export class TranscriptionService {
  private static instance: TranscriptionService;
  private apiKey: string;

  private constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
  }

  public static getInstance(): TranscriptionService {
    if (!TranscriptionService.instance) {
      TranscriptionService.instance = new TranscriptionService();
    }
    return TranscriptionService.instance;
  }

  public async transcribeAudio(recording: AudioRecording): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', new File([recording.blob], 'audio.wav', { type: 'audio/wav' }));
      formData.append('model', 'whisper-1');
      formData.append('response_format', 'text');

      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      const transcript = await response.text();
      return transcript;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }
} 