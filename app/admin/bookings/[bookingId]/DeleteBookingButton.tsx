"use client";

import { useState } from "react";

type DeleteBookingButtonProps = {
  action: () => void | Promise<void>;
  memberName: string;
  className: string;
};

export default function DeleteBookingButton({
  action,
  memberName,
  className,
}: DeleteBookingButtonProps) {
  const [isConfirming, setIsConfirming] =
    useState(false);

  if (!isConfirming) {
    return (
      <button
        type="button"
        onClick={() => setIsConfirming(true)}
        className="w-full rounded-lg border border-red-600 px-5 py-3 font-bold text-red-600 transition hover:bg-red-50"
      >
        Delete Booking
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-red-300 bg-red-50 p-4">
      <p className="font-bold text-red-800">
        Remove this booking?
      </p>

      <p className="mt-2 text-sm leading-6 text-red-700">
        {memberName} will be removed from{" "}
        <span className="font-bold">
          {className}
        </span>
        . This action cannot be undone.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setIsConfirming(false)}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 font-bold text-gray-700 transition hover:bg-gray-100"
        >
          Keep Booking
        </button>

        <form action={action}>
          <button
            type="submit"
            className="w-full rounded-lg bg-red-600 px-4 py-2 font-bold text-white transition hover:bg-red-700"
          >
            Confirm Delete
          </button>
        </form>
      </div>
    </div>
  );
}