"use client";

import {
  ChangeEvent,
  useId,
  useRef,
  useState,
} from "react";

import { supabaseBrowser } from "@/lib/supabase-browser";

type ImageUploadProps = {
  name: string;
  label: string;
  bucket?: string;
  folder: string;
  initialUrl?: string | null;
  description?: string;
  maxSizeMb?: number;
  accept?: string;
};

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
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

  return `${baseName || "image"}-${Date.now()}-${crypto.randomUUID()}.${
    extension || "jpg"
  }`;
}

export function ImageUpload({
  name,
  label,
  bucket = "website-media",
  folder,
  initialUrl = null,
  description,
  maxSizeMb = 5,
  accept = "image/png,image/jpeg,image/webp,image/gif,image/svg+xml",
}: ImageUploadProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageUrl, setImageUrl] = useState(initialUrl ?? "");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    if (!allowedTypes.has(file.type)) {
      setError(
        "Choose a PNG, JPG, WEBP, GIF or SVG image.",
      );
      event.target.value = "";
      return;
    }

    const maximumBytes = maxSizeMb * 1024 * 1024;

    if (file.size > maximumBytes) {
      setError(`The image must be smaller than ${maxSizeMb} MB.`);
      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const objectPath = `${folder}/${safeFileName(file.name)}`;

      const { error: uploadError } = await supabaseBrowser.storage
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

      setImageUrl(data.publicUrl);
      setFileName(file.name);
    } catch (uploadError) {
      console.error(uploadError);

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "The image could not be uploaded.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function removeImage() {
    setImageUrl("");
    setFileName("");
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
      <input type="hidden" name={name} value={imageUrl} />

      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex min-h-32 w-full items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-300 bg-white sm:w-52">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={`${label} preview`}
              className="max-h-32 max-w-full object-contain p-3"
            />
          ) : (
            <div className="px-5 py-8 text-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="mx-auto h-9 w-9 text-zinc-400"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>

              <p className="mt-2 text-sm font-semibold text-zinc-500">
                No image selected
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
                : imageUrl
                  ? "Choose another image"
                  : "Choose image"}
            </button>

            {imageUrl ? (
              <button
                type="button"
                onClick={removeImage}
                disabled={uploading}
                className="rounded-xl border border-zinc-300 bg-white px-5 py-3 text-sm font-black text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-60"
              >
                Remove
              </button>
            ) : null}
          </div>

          {fileName ? (
            <p className="mt-3 truncate text-sm font-semibold text-emerald-700">
              Uploaded: {fileName}
            </p>
          ) : null}

          <p className="mt-3 text-xs text-zinc-500">
            PNG, JPG, WEBP, GIF or SVG. Maximum {maxSizeMb} MB.
          </p>

          {error ? (
            <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}