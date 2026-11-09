"""Transcribe un audio con faster-whisper y entrega cada palabra con su tiempo (JSON).

Uso: python scripts/alinear.py <audio> [texto esperado]
El texto esperado se usa como pista (initial_prompt) para que reconozca
nombres propios; la comparación con el guion la hace scripts/voz.ts.
"""
import json
import os
import subprocess
import sys

import numpy as np

from faster_whisper import WhisperModel

MODELO = os.environ.get("WHISPER_MODELO", "small")

def main() -> None:
    audio = sys.argv[1]
    pista = sys.argv[2] if len(sys.argv) > 2 else None
    modelo = WhisperModel(MODELO, device="cpu", compute_type="int8")
    # Se decodifica con ffmpeg (16 kHz, mono) para no depender de PyAV.
    crudo = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", audio, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
        check=True, capture_output=True,
    ).stdout
    senal = np.frombuffer(crudo, np.int16).astype(np.float32) / 32768.0
    segmentos, _ = modelo.transcribe(
        senal,
        language="es",
        word_timestamps=True,
        initial_prompt=pista,
        vad_filter=False,
        beam_size=5,
        condition_on_previous_text=False,
    )
    palabras = []
    for seg in segmentos:
        for p in seg.words or []:
            palabras.append({"p": p.word.strip(), "i": round(p.start, 3), "f": round(p.end, 3)})
    json.dump(palabras, sys.stdout, ensure_ascii=False)

if __name__ == "__main__":
    main()
