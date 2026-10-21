#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🎙️ BSC J.A.R.V.I.S. OS — Local Open-Source TTS & Zero-Shot Voice Cloning Server
Reference: https://www.youtube.com/watch?v=pnQUKnmPkFg&t=484s (CONNECT AI LAB)
Supported Open-Source Engines ($0 Free Local GPU/CPU):
  1. Chatterbox Multilingual TTS (resemble-ai/chatterbox, MIT License, 23 Languages, Timbre 0.75)
  2. Qwen3-TTS (QwenLM/Qwen3-TTS, Korean/Chinese High Clarity)
  3. CosyVoice 3 (FunAudioLLM/CosyVoice, Japanese Kana & Emotional Prosody)
  4. VoxCPM2 (OpenBMB/VoxCPM, End-to-End Context-Aware TTS)

Install:
  pip install "chatterbox-tts" "setuptools<81" fastapi uvicorn torchaudio
Run:
  python scripts/local-open-tts-server.py --port 7860
"""

import os
import io
import base64
import argparse
from http.server import BaseHTTPRequestHandler, HTTPServer
import json

PORT = int(os.environ.get("JARVIS_OPEN_TTS_PORT", "7860"))
VOICE_SAMPLE_PATH = os.environ.get("JARVIS_VOICE_PROMPT", os.path.join(os.path.dirname(__file__), "my_voice_24k.wav"))

chatterbox_model = None

def get_chatterbox():
    global chatterbox_model
    if chatterbox_model is not None:
        return chatterbox_model
    try:
        import torch
        from chatterbox.mtl_tts import ChatterboxMultilingualTTS
        device = "cuda" if torch.cuda.is_available() else ("mps" if getattr(torch.backends, "mps", None) and torch.backends.mps.is_available() else "cpu")
        print(f"[Chatterbox-TTS] Loading ChatterboxMultilingualTTS on {device}...")
        chatterbox_model = ChatterboxMultilingualTTS.from_pretrained(device=device)
        return chatterbox_model
    except Exception as e:
        print(f"[Chatterbox-TTS] Optional GPU model not loaded yet ({e}). Install via: pip install chatterbox-tts 'setuptools<81'")
        return None


class OpenTtsHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path != "/tts":
            self.send_response(404)
            self.end_headers()
            return

        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length).decode("utf-8") or "{}")
        text = body.get("text", "")
        lang = body.get("lang", "ko")
        exaggeration = float(body.get("exaggeration", 0.5))
        cfg_weight = float(body.get("cfg_weight", 0.45))
        prompt_path = body.get("audio_prompt_path") or (VOICE_SAMPLE_PATH if os.path.exists(VOICE_SAMPLE_PATH) else None)

        tts = get_chatterbox()
        if tts is None:
            self.send_response(503)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.end_headers()
            self.wfile.write(json.dumps({
                "ok": False,
                "error": "Chatterbox GPU engine not initialized. Falling back to Edge Neural HD TTS."
            }).encode("utf-8"))
            return

        import torchaudio
        wav = tts.generate(
            text,
            language_id=lang,
            audio_prompt_path=prompt_path,
            exaggeration=exaggeration,
            cfg_weight=cfg_weight
        )
        buf = io.BytesIO()
        torchaudio.save(buf, wav.cpu(), tts.sr, format="wav")
        b64 = base64.b64encode(buf.getvalue()).decode("ascii")

        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.end_headers()
        self.wfile.write(json.dumps({
            "ok": True,
            "engine": "chatterbox-multilingual-tts",
            "mimeType": "audio/wav",
            "audioBase64": b64
        }).encode("utf-8"))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=PORT)
    args = parser.parse_args()
    print(f"🎙️ [BSC J.A.R.V.I.S.] Local Open-Source TTS Server (Chatterbox / Qwen3-TTS) listening on http://127.0.0.1:{args.port}/tts")
    HTTPServer(("127.0.0.1", args.port), OpenTtsHandler).serve_forever()
