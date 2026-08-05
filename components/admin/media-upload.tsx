"use client";

import {
  ChangeEvent,
  useId,
  useRef,
  useState,
} from "react";

import { supabaseBrowser } from "@/lib/supabase-browser";

type MediaUploadProps = {
  name: string;
  label: string;
  folder: string;
  initialUrl?: string | null;
  description?: string;
  mediaType: "image" | "video";
  bucket?: string;
  maxSizeMb?: number;
};

const imageTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);

const videoTypes = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

function safeFileName(fileName: string) {
  const extension = fileName
    .split(".")
    .pop()
    ?.toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  const baseName = fileName
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${baseName || "media"}-${Date.now()}-${crypto.randomUUID()}.${
    extension || "file"
  }`;
}

export function MediaUpload({
  name,
  label,
  folder,
  initialUrl = null,
  description,
  mediaType,
  bucket = "website-media",
  maxSizeMb,
}: MediaUploadProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mediaUrl, setMediaUrl] = useState(initialUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const isVideo = mediaType === "video";
  const acceptedTypes = isVideo ? videoTypes : imageTypes;
  const maximumSizeMb = maxSizeMb ?? (isVideo ? 80 : 8);
  const accept = isVideo
    ? "video/mp4,video/webm,video/quicktime"
    : "image/png,image/jpeg,image/webp,image/gif,image/svg+xml";

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    if (!acceptedTypes.has(file.type)) {
      setError(
        isVideo
          ? "Choose an MP4, WEBM or MOV video."
          : "Choose a PNG, JPG, WEBP, GIF or SVG image.",
      );
      event.target.value = "";
      return;
    }

    if (file.size > maximumSizeMb * 1024 * 1024) {
      setError(
        `The file must be smaller than ${maximumSizeMb} MB.`,
      );
      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const objectPath = `${folder}/${safeFileName(file.name)}`;

      const { error: uploadError } =
        await supabaseBrowser.storage
          .from(bucket)
          .upload(objectPath, file, {
            cacheControl: "3600",
            contentType: file.type,
            upsert: false,
          });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabaseBrowser.storage
        .from(bucket)
        .getPublicUrl(objectPath);

      setMediaUrl(data.publicUrl);
    } catch (uploadError) {
      console.error(uploadError);

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "The file could not be uploaded.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function removeMedia() {
    setMediaUrl("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
      <input type="hidden" name={name} value={mediaUrl} />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex min-h-36 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-300 bg-white sm:w-64">
          {mediaUrl ? (
            isVideo ? (
              <video
                src={mediaUrl}
                controls
                muted
                playsInline
                className="max-h-44 w-full object-cover"
              />
            ) : (
              <img
                src={mediaUrl}
                alt={`${label} preview`}
                className="max-h-44 max-w-full object-contain p-3"
              />
            )
          ) : (
            <div className="px-5 py-10 text-center">
              <p className="text-sm font-semibold text-zinc-500">
                No {mediaType} selected
              </p>
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <label
            htmlFor={inputId}
            className="block text-sm font-black text-zinc-950"
          >
            {label}
          </label>

          {description ? (
            <p className="mt-1 text-sm leading-6 text-zinc-600">
              {description}
            </p>
          ) : null}

          <p className="mt-2 text-xs font-semibold text-zinc-500">
            Maximum file size: {maximumSizeMb} MB
          </p>

          <input
            ref={fileInputRef}
            id={inputId}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            disabled={uploading}
            className="sr-only"
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-xl bg-red-600 px-5 py-3 text-sm font-black text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading
                ? "Uploading..."
                : mediaUrl
                  ? `Choose another ${mediaType}`
                  : `Choose ${mediaType}`}
            </button>

            {mediaUrl ? (
              <button
                type="button"
                onClick={removeMedia}
                disabled={uploading}
                className="rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-black text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-60"
              >
                Remove
              </button>
            ) : null}
          </div>

          {error ? (
            <p className="mt-3 text-sm font-bold text-red-600">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}