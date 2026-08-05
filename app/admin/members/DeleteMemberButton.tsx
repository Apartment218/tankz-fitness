"use client";

import { useState } from "react";

import { deleteMember } from "./actions";

type DeleteMemberButtonProps = {
  memberId: string;
  memberName: string;
};

export default function DeleteMemberButton({
  memberId,
  memberName,
}: DeleteMemberButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${memberName}? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteMember(memberId);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="font-bold text-red-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </button>
  );
}