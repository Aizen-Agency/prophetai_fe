import { useState, useRef, useEffect } from 'react';

export interface AudioRecording {
  id: number;
  blob: Blob;
  timestamp: number;
  transcript?: string;
}

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };
  
  const base64ToBlob = (base64: string, mime = 'audio/wav'): Blob => {
    const byteString = atob(base64.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);
  
    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }
  
    return new Blob([intArray], { type: mime });
  };
  

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = (): Promise<AudioRecording> => {
    return new Promise(async (resolve) => {
      if (!mediaRecorderRef.current) {
        resolve({
          id: Date.now(),
          blob: new Blob(),
          timestamp: Date.now(),
        });
        return;
      }
  
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const base64Blob = await blobToBase64(audioBlob);
  
        const recording = {
          id: Date.now(),
          blob: base64Blob, // store base64 instead of actual blob
          timestamp: Date.now(),
        };
  
        const storedRecordings = JSON.parse(localStorage.getItem('audioRecordings') || '[]');
        storedRecordings.push(recording);
        localStorage.setItem('audioRecordings', JSON.stringify(storedRecordings));
  
        // Cleanup
        if (timerRef.current) clearInterval(timerRef.current);
        if (mediaRecorderRef.current) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
          mediaRecorderRef.current = null;
        }
  
        setIsRecording(false);
        setRecordingTime(0);
  
        // Resolve with actual blob format
        resolve({
          ...recording,
          blob: audioBlob,
        });
      };
  
      mediaRecorderRef.current.stop();
    });
  };
  

  const getStoredRecordings = (): AudioRecording[] => {
    const storedRecordings = localStorage.getItem('audioRecordings');
    if (!storedRecordings) return [];
  
    const parsed = JSON.parse(storedRecordings);
    return parsed.map((rec: any) => ({
      ...rec,
      blob: base64ToBlob(rec.blob),
    }));
  };
  
const updateRecordingTranscript = async (id: number, transcript: string) => {
  const stored = localStorage.getItem('audioRecordings');
  if (!stored) return;

  const parsed = JSON.parse(stored);

  const updated = await Promise.all(parsed.map(async (recording: any) => {
    if (recording.id === id) {
      // If blob is a real Blob, convert to base64
      const isBlob = recording.blob instanceof Blob;
      const base64Blob = isBlob ? await blobToBase64(recording.blob) : recording.blob;

      return {
        ...recording,
        blob: base64Blob,
        transcript,
      };
    }
    return recording;
  }));

  localStorage.setItem('audioRecordings', JSON.stringify(updated));
};

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    getStoredRecordings,
    updateRecordingTranscript,
  };
}; 