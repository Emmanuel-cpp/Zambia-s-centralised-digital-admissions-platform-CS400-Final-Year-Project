/**
 * Browser-based document verification using AI.
 *
 * Tesseract.js handles OCR for text-based documents (NRC, certificate).
 * face-api.js handles face detection for passport photos.
 * pdf.js converts PDFs to images so Tesseract can read them.
 *
 * All processing happens in the user's browser — sensitive ID documents
 * never leave the device. This is privacy-by-design.
 */

import Tesseract from 'tesseract.js';
import * as faceapi from 'face-api.js';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdf.js worker — required for it to work in the browser
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export interface VerificationResult {
  ok: boolean;
  reason: string | null;
  ocrText: string | null;
  confidence: number;
  detectedNrc?: string;
}

/* ─────────────────────────────────
   Model loading — face-api needs models loaded once
───────────────────────────────── */

let modelsLoaded = false;

async function loadFaceModels(): Promise<void> {
  if (modelsLoaded) return;
  await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
  modelsLoaded = true;
}

/* ─────────────────────────────────
   NRC verification
───────────────────────────────── */

        export async function verifyNrc(
        file: File,
        isFront: boolean,
        userTypedNrc?: string,
        ): Promise<VerificationResult> {

        const ocrResult = await runOcr(file);

        if (ocrResult.error) {
            return reject(
            'Could not read this file. Please upload a clear JPG, PNG, or PDF.',
            );
        }

        if (!ocrResult.text || ocrResult.text.trim().length < 10) {
            return reject(
            'Error verifying document. Please upload a clear, well-lit image and try again.',
            );
        }

        const text      = ocrResult.text;
        const upperText = text.toUpperCase();
        console.log('=== NRC OCR Debug ===');
        console.log('Is front:', isFront);
        console.log('Raw OCR text:');
        console.log(text);
        console.log('===================');

        if (isFront) {
            // ── FRONT of NRC has the registration number, photo, signatures, fingerprint ──
            const nrcMatch = text.match(/(\d{6}\s*\/\s*\d{2}\s*\/\s*\d)/);

            if (!nrcMatch) {
            return reject(
                'Error verifying NRC front. Please upload a clear photo of the front of your NRC (the side with your registration number and photo).',
            );
            }

            const detectedNrc = nrcMatch[1].replace(/\s+/g, '');

            if (userTypedNrc) {
            const normalizedTyped = userTypedNrc.replace(/\s+/g, '');
            if (detectedNrc !== normalizedTyped) {
                return reject(
                'NRC number on the document does not match what you entered. Please check both and try again.',
                );
            }
            }

            // Also confirm we see other front-side indicators
            const frontKeywords = ['REGISTRATION NUMBER', 'SIGNATURE', 'REPUBLIC OF ZAMBIA'];
            const hasFrontKeyword = frontKeywords.some(kw => upperText.includes(kw));

            if (!hasFrontKeyword) {
            return reject(
                'Error verifying NRC front. Please upload a clearer photo of the front of your NRC.',
            );
            }

            return {
            ok:          true,
            reason:      null,
            ocrText:     text,
            confidence:  ocrResult.confidence,
            detectedNrc,
            };
        }

        // ── BACK of NRC has the name, DOB, place of birth, district, chief ──
        const backKeywords = [
            'NATIONAL',
            'REGISTRATION CARD',
            'DATE OF BIRTH',
            'PLACE OF BIRTH',
            'VILLAGE',
            'DISTRICT',
            'CHIEF',
        ];

        let matchCount = 0;
        for (const kw of backKeywords) {
            if (upperText.includes(kw)) matchCount++;
        }

        if (matchCount < 2) {
            return reject(
            'Error verifying NRC back. Please upload a clear photo of the back of your NRC (the side with your name and date of birth).',
            );
        }

        return {
            ok:         true,
            reason:     null,
            ocrText:    text,
            confidence: Math.min(1, matchCount / backKeywords.length + 0.3),
        };
        }

/* ─────────────────────────────────
   Certificate verification
───────────────────────────────── */

export async function verifyCertificate(file: File): Promise<VerificationResult> {
  const ocrResult = await runOcr(file);

  if (ocrResult.error) {
    return reject(
      'Could not read this file. Please upload a clear JPG, PNG, or PDF.',
    );
  }

  if (!ocrResult.text || ocrResult.text.trim().length < 20) {
    return reject(
      'Error verifying certificate. Please upload a clear image showing the full document.',
    );
  }

  const upperText = ocrResult.text.toUpperCase();

  const eczKeywords = [
    'EXAMINATIONS COUNCIL OF ZAMBIA',
    'ECZ',
    'GRADE 12',
    'SCHOOL CERTIFICATE',
    'STATEMENT OF RESULTS',
    'CERTIFICATE',
    'REPUBLIC OF ZAMBIA',
  ];

  let matchCount = 0;
  for (const kw of eczKeywords) {
    if (upperText.includes(kw)) matchCount++;
  }

  if (matchCount < 2) {
    return reject(
      'Error verifying Grade 12 certificate. Please upload your official ECZ certificate or statement of results.',
    );
  }

  return {
    ok:         true,
    reason:     null,
    ocrText:    ocrResult.text,
    confidence: Math.min(1, matchCount / eczKeywords.length + 0.3),
  };
}

/* ─────────────────────────────────
   Passport photo verification
───────────────────────────────── */

export async function verifyPassportPhoto(file: File): Promise<VerificationResult> {

  try {
    await loadFaceModels();

    const img = await fileToImage(file);

    const detections = await faceapi.detectAllFaces(
      img,
      new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 }),
    );

    if (detections.length === 0) {
      return reject(
        'Error verifying passport photo. Please upload a clear photo showing your face.',
      );
    }

    if (detections.length > 1) {
      return reject(
        'Error verifying passport photo. The image must contain only your face — no other people.',
      );
    }

    const face = detections[0];
    const imageArea = img.width * img.height;
    const faceArea  = face.box.width * face.box.height;
    const faceRatio = faceArea / imageArea;

    if (faceRatio < 0.05) {
      return reject(
        'Error verifying passport photo. Please upload a closer photo where your face fills the frame.',
      );
    }

    return {
      ok:         true,
      reason:     null,
      ocrText:    null,
      confidence: face.score,
    };

  } catch (error: any) {
    console.error('Face detection error:', error);
    return reject(
      'Error verifying passport photo. Please try a different image.',
    );
  }
}

/* ─────────────────────────────────
   Helpers
───────────────────────────────── */

async function runOcr(file: File): Promise<{ text: string; confidence: number; error: boolean }> {
  try {
    // PDFs need to be rendered to images first
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      return await ocrPdf(file);
    }

    // Image file — OCR directly
    const result = await Tesseract.recognize(file, 'eng', {
      logger: () => {},
    });

    return {
      text:       result.data.text,
      confidence: result.data.confidence / 100,
      error:      false,
    };
  } catch (error: any) {
    console.error('OCR error:', error);
    return { text: '', confidence: 0, error: true };
  }
}

/**
 * Convert PDF to images using pdf.js, then OCR each page.
 * Combines text from all pages (limited to first 3 pages).
 */
async function ocrPdf(file: File): Promise<{ text: string; confidence: number; error: boolean }> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf         = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let combinedText    = '';
    let totalConfidence = 0;
    let pagesProcessed  = 0;

    const pagesToProcess = Math.min(pdf.numPages, 3);

    for (let pageNum = 1; pageNum <= pagesToProcess; pageNum++) {
      const page     = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2 });
      const canvas   = document.createElement('canvas');
      const context  = canvas.getContext('2d');

      if (!context) continue;

      canvas.width  = viewport.width;
      canvas.height = viewport.height;

        await page.render({
        canvasContext: context,
        viewport,
        } as any).promise;

      const result = await Tesseract.recognize(canvas, 'eng', {
        logger: () => {},
      });

      combinedText    += result.data.text + '\n';
      totalConfidence += result.data.confidence;
      pagesProcessed++;
    }

    return {
      text:       combinedText,
      confidence: pagesProcessed > 0 ? (totalConfidence / pagesProcessed) / 100 : 0,
      error:      false,
    };
  } catch (error: any) {
    console.error('PDF OCR error:', error);
    return { text: '', confidence: 0, error: true };
  }
}

async function fileToImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    img.src = url;
  });
}

function reject(reason: string): VerificationResult {
  return {
    ok:         false,
    reason,
    ocrText:    null,
    confidence: 0,
  };
}