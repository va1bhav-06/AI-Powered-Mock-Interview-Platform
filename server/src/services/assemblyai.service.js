import { AssemblyAI } from 'assemblyai';
import fs from 'fs';
import path from 'path';
import os from 'os';

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

import { Readable } from 'stream';

export const transcribeAudio = async (audioBuffer, originalName) => {
  try {
    if (!audioBuffer || audioBuffer.length === 0) {
      throw new Error("The audio buffer received by the service is empty.");
    }

    // 1. Explicitly upload the raw buffer first to AssemblyAI's secure staging buckets
    // This entirely avoids the SDK's internal automated type-checking bugs.
    const uploadUrl = await client.files.upload(audioBuffer);

    // 2. Transcribe using the clean, explicit staging URL string returned above
    const transcript = await client.transcripts.transcribe({
      audio: uploadUrl, // This is now a perfectly valid URL string
      speech_models: ["universal-3-5-pro", "universal-2"] // Fully supports latest API array format
    });

    if (transcript.status === 'error') {
      throw new Error(`Transcription failed: ${transcript.error}`);
    }

    return transcript.text || '[No speech detected in the recording]';
  } catch (error) {
    console.error('AssemblyAI Transcription Core Breakdown:', error);
    throw new Error('Speech-to-text service is currently unavailable.');
  }
};