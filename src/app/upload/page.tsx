"use client";

import { useState } from "react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "";

export default function UploadPage() {
  const [status, setStatus] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [resultUrl, setResultUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      setStatus("error");
      setErrorMsg(
        "Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME or NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your environment."
      );
      return;
    }

    setStatus("uploading");
    setErrorMsg("");

    const isVideo = file.type.startsWith("video/");
    const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${isVideo ? "video" : "image"}/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET); // unsigned preset — no API secret needed here

    try {
      const res = await fetch(endpoint, { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error?.message || "Upload failed.");
      }

      setResultUrl(data.secure_url);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setErrorMsg((err as Error).message);
    }
  }

  function copyUrl() {
    if (!resultUrl) return;
    navigator.clipboard.writeText(resultUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-primary">
      <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-8">
        <h1 className="font-display text-2xl font-semibold">Media Upload</h1>
        <p className="mt-2 text-sm text-muted">
          Owner-only utility. Uploads directly to Cloudinary using an unsigned preset — no server, no
          database involved.
        </p>

        <label className="mt-8 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-line-strong px-6 py-10 text-center transition-colors hover:border-accent-bright">
          <span className="text-sm text-muted">Click to select a video or image</span>
          <input type="file" accept="video/*,image/*" className="hidden" onChange={handleFileChange} />
        </label>

        {status === "uploading" && <p className="mt-6 text-sm text-muted">Uploading…</p>}

        {status === "error" && <p className="mt-6 text-sm text-red-400">{errorMsg}</p>}

        {status === "done" && (
          <div className="mt-6">
            <p className="text-sm font-medium text-accent-bright">Upload successful</p>
            <div className="mt-2 break-all rounded-lg bg-background/60 p-3 text-xs text-muted">{resultUrl}</div>
            <button
              onClick={copyUrl}
              className="mt-3 rounded-full bg-primary px-5 py-2 text-xs font-medium text-background transition-colors hover:bg-accent-bright"
            >
              {copied ? "Copied!" : "Copy URL"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
