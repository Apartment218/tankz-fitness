"use client";

import {
  FormEvent,
  useMemo,
  useState,
  useTransition,
} from "react";

import {
  createPayment,
  deletePayment,
  updatePayment,
} from "./actions";

type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

type PaymentMethod =
  | "CARD"
  | "CASH"
  | "BANK_TRANSFER"
  | "DIRECT_DEBIT"
  | "OTHER";

export type PaymentRecord = {
  id: string;
  memberId: string | null;
  memberName: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod | null;
  reference: string | null;
  description: string | null;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type MemberOption = {
  id: string;
  firstName: string;
  lastName: string;
};

type PaymentManagerProps = {
  initialPayments: PaymentRecord[];
  members: MemberOption[];
};

type PaymentForm = {
  memberId: string;
  amount: string;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod | "";
  reference: string;
  description: string;
  paidAt: string;
};

const emptyForm: PaymentForm = {
  memberId: "",
  amount: "",
  currency: "GBP",
  status: "PENDING",
  method: "",
  reference: "",
  description: "",
  paidAt: "",
};

const paymentStatuses: PaymentStatus[] = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
];

const paymentMethods: PaymentMethod[] = [
  "CARD",
  "CASH",
  "BANK_TRANSFER",
  "DIRECT_DEBIT",
  "OTHER",
];

function formatCurrency(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function formatDate(date: string | null) {
  if (!date) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

function toDateTimeLocal(value: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const timezoneOffset = date.getTimezoneOffset() * 60_000;

  return new Date(date.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 16);
}

function getStatusStyles(status: PaymentStatus) {
  switch (status) {
    case "PAID":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-amber-100 text-amber-800";
    case "FAILED":
      return "bg-red-100 text-red-800";
    case "REFUNDED":
      return "bg-blue-100 text-blue-800";
  }
}

export default function PaymentManager({
  initialPayments,
  members,
}: PaymentManagerProps) {
  const [payments, setPayments] =
    useState<PaymentRecord[]>(initialPayments);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<PaymentStatus | "ALL">("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPaymentId, setEditingPaymentId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<PaymentForm>(emptyForm);

  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredPayments = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        !search ||
        payment.memberName
          ?.toLowerCase()
          .includes(search) ||
        payment.reference
          ?.toLowerCase()
          .includes(search) ||
        payment.description
          ?.toLowerCase()
          .includes(search) ||
        payment.method
          ?.toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "ALL" ||
        payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, searchTerm, statusFilter]);

  const totalPaid = payments
    .filter(
      (payment) =>
        payment.status === "PAID" &&
        payment.currency === "GBP"
    )
    .reduce(
      (total, payment) => total + payment.amount,
      0
    );

  const pendingTotal = payments
    .filter(
      (payment) =>
        payment.status === "PENDING" &&
        payment.currency === "GBP"
    )
    .reduce(
      (total, payment) => total + payment.amount,
      0
    );

  const paidCount = payments.filter(
    (payment) => payment.status === "PAID"
  ).length;

  const failedCount = payments.filter(
    (payment) => payment.status === "FAILED"
  ).length;

  function updateForm<K extends keyof PaymentForm>(
    field: K,
    value: PaymentForm[K]
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function openAddModal() {
    setEditingPaymentId(null);
    setForm(emptyForm);
    setFormError("");
    setNotice("");
    setIsModalOpen(true);
  }

  function openEditModal(payment: PaymentRecord) {
    setEditingPaymentId(payment.id);

    setForm({
      memberId: payment.memberId ?? "",
      amount: payment.amount.toFixed(2),
      currency: payment.currency,
      status: payment.status,
      method: payment.method ?? "",
      reference: payment.reference ?? "",
      description: payment.description ?? "",
      paidAt: toDateTimeLocal(payment.paidAt),
    });

    setFormError("");
    setNotice("");
    setIsModalOpen(true);
  }

  function closeModal() {
    if (isPending) {
      return;
    }

    setIsModalOpen(false);
    setEditingPaymentId(null);
    setForm(emptyForm);
    setFormError("");
  }

  function validateForm() {
    const amount = Number(form.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return "Amount must be greater than £0.";
    }

    if (!/^[A-Za-z]{3}$/.test(form.currency.trim())) {
      return "Currency must be a three-letter code.";
    }

    const duplicateReference = payments.some(
      (payment) =>
        payment.id !== editingPaymentId &&
        form.reference.trim() &&
        payment.reference?.toLowerCase() ===
          form.reference.trim().toLowerCase()
    );

    if (duplicateReference) {
      return "A payment with this reference already exists.";
    }

    return "";
  }

  function createFormData() {
    const formData = new FormData();

    formData.set("memberId", form.memberId);
    formData.set("amount", form.amount);
    formData.set("currency", form.currency);
    formData.set("status", form.status);
    formData.set("method", form.method);
    formData.set("reference", form.reference);
    formData.set("description", form.description);
    formData.set("paidAt", form.paidAt);

    return formData;
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const validationError = validateForm();

    if (validationError) {
      setFormError(validationError);
      return;
    }

    setFormError("");
    setNotice("");

    startTransition(async () => {
      const formData = createFormData();

      const result =
        editingPaymentId === null
          ? await createPayment(formData)
          : await updatePayment(
              editingPaymentId,
              formData
            );

      if (!result.success) {
        setFormError(result.message);
        return;
      }

      setIsModalOpen(false);
      setEditingPaymentId(null);
      setForm(emptyForm);
      setNotice(result.message);

      window.location.reload();
    });
  }

  function handleDelete(payment: PaymentRecord) {
    const description =
      payment.reference ||
      payment.memberName ||
      formatCurrency(
        payment.amount,
        payment.currency
      );

    const confirmed = window.confirm(
      `Delete payment "${description}"? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setNotice("");

    startTransition(async () => {
      const result = await deletePayment(payment.id);

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      setPayments((currentPayments) =>
        currentPayments.filter(
          (currentPayment) =>
            currentPayment.id !== payment.id
        )
      );

      setNotice(result.message);
    });
  }

  return (
    <div className="text-black">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-black">
            Payments
          </h1>

          <p className="mt-2 font-medium text-gray-700">
            Manage member payments, statuses and
            transaction details.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="rounded-lg bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
        >
          + Add Payment
        </button>
      </div>

      {notice && (
        <div
          role="status"
          className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 font-semibold text-green-800"
        >
          {notice}
        </div>
      )}

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-300 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-gray-700">
            Total Paid
          </p>

          <p className="mt-2 text-3xl font-bold text-black">
            {formatCurrency(totalPaid, "GBP")}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-300 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-gray-700">
            Pending
          </p>

          <p className="mt-2 text-3xl font-bold text-black">
            {formatCurrency(pendingTotal, "GBP")}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-300 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-gray-700">
            Paid Transactions
          </p>

          <p className="mt-2 text-3xl font-bold text-black">
            {paidCount}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-300 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-gray-700">
            Failed Transactions
          </p>

          <p className="mt-2 text-3xl font-bold text-black">
            {failedCount}
          </p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-4">
        <input
          type="search"
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
          placeholder="Search member, reference or description..."
          className="min-w-72 flex-1 rounded-lg border border-gray-400 bg-white px-4 py-3 text-black outline-none placeholder:text-gray-600 focus:border-red-600"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value as
                | PaymentStatus
                | "ALL"
            )
          }
          className="rounded-lg border border-gray-400 bg-white px-4 py-3 font-medium text-black outline-none focus:border-red-600"
        >
          <option value="ALL">All statuses</option>

          {paymentStatuses.map((status) => (
            <option key={status} value={status}>
              {formatLabel(status)}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-300 bg-white shadow-sm">
        <table className="w-full min-w-[1150px] text-left">
          <thead className="border-b border-gray-300 bg-gray-100">
            <tr>
              <th className="px-6 py-4 font-bold text-black">
                Member
              </th>

              <th className="px-6 py-4 font-bold text-black">
                Amount
              </th>

              <th className="px-6 py-4 font-bold text-black">
                Status
              </th>

              <th className="px-6 py-4 font-bold text-black">
                Method
              </th>

              <th className="px-6 py-4 font-bold text-black">
                Reference
              </th>

              <th className="px-6 py-4 font-bold text-black">
                Paid
              </th>

              <th className="px-6 py-4 text-right font-bold text-black">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredPayments.map((payment) => (
              <tr
                key={payment.id}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-5">
                  <p className="font-bold text-black">
                    {payment.memberName ||
                      "Guest / Unassigned"}
                  </p>

                  <p className="mt-1 max-w-xs truncate text-sm font-medium text-gray-600">
                    {payment.description ||
                      "No description"}
                  </p>
                </td>

                <td className="px-6 py-5 font-bold text-black">
                  {formatCurrency(
                    payment.amount,
                    payment.currency
                  )}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusStyles(
                      payment.status
                    )}`}
                  >
                    {formatLabel(payment.status)}
                  </span>
                </td>

                <td className="px-6 py-5 font-semibold text-gray-800">
                  {payment.method
                    ? formatLabel(payment.method)
                    : "—"}
                </td>

                <td className="px-6 py-5 font-semibold text-gray-800">
                  {payment.reference || "—"}
                </td>

                <td className="px-6 py-5 font-medium text-gray-700">
                  {formatDate(payment.paidAt)}
                </td>

                <td className="px-6 py-5 text-right">
                  <button
                    type="button"
                    onClick={() =>
                      openEditModal(payment)
                    }
                    disabled={isPending}
                    className="mr-4 font-bold text-blue-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(payment)
                    }
                    disabled={isPending}
                    className="font-bold text-red-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredPayments.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-14 text-center"
                >
                  <p className="text-lg font-bold text-black">
                    No payments found
                  </p>

                  <p className="mt-1 font-medium text-gray-700">
                    Try changing your search or filter,
                    or add a new payment.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm font-semibold text-gray-700">
        Showing {filteredPayments.length} of{" "}
        {payments.length} payments
      </p>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onMouseDown={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-modal-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-300 px-6 py-5">
              <div>
                <h2
                  id="payment-modal-title"
                  className="text-2xl font-bold text-black"
                >
                  {editingPaymentId
                    ? "Edit Payment"
                    : "Add Payment"}
                </h2>

                <p className="mt-1 font-medium text-gray-700">
                  {editingPaymentId
                    ? "Update this payment record."
                    : "Add a payment to the live database."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isPending}
                aria-label="Close payment form"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-xl font-bold text-black hover:bg-gray-300 disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid gap-5 p-6 sm:grid-cols-2">
                {formError && (
                  <div
                    role="alert"
                    className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-semibold text-red-800 sm:col-span-2"
                  >
                    {formError}
                  </div>
                )}

                <label className="sm:col-span-2">
                  <span className="mb-2 block font-bold text-black">
                    Member
                  </span>

                  <select
                    value={form.memberId}
                    onChange={(event) =>
                      updateForm(
                        "memberId",
                        event.target.value
                      )
                    }
                    disabled={isPending}
                    className="w-full rounded-lg border border-gray-400 bg-white px-4 py-3 text-black outline-none focus:border-red-600 disabled:bg-gray-100"
                  >
                    <option value="">
                      Guest / No member
                    </option>

                    {members.map((member) => (
                      <option
                        key={member.id}
                        value={member.id}
                      >
                        {member.firstName}{" "}
                        {member.lastName}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="mb-2 block font-bold text-black">
                    Amount
                  </span>

                  <div className="flex rounded-lg border border-gray-400 bg-white focus-within:border-red-600">
                    <span className="flex items-center border-r border-gray-300 px-4 font-bold text-gray-700">
                      £
                    </span>

                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={form.amount}
                      onChange={(event) =>
                        updateForm(
                          "amount",
                          event.target.value
                        )
                      }
                      required
                      disabled={isPending}
                      placeholder="0.00"
                      className="w-full rounded-r-lg bg-white px-4 py-3 text-black outline-none placeholder:text-gray-600 disabled:bg-gray-100"
                    />
                  </div>
                </label>

                <label>
                  <span className="mb-2 block font-bold text-black">
                    Currency
                  </span>

                  <input
                    type="text"
                    maxLength={3}
                    value={form.currency}
                    onChange={(event) =>
                      updateForm(
                        "currency",
                        event.target.value.toUpperCase()
                      )
                    }
                    required
                    disabled={isPending}
                    className="w-full rounded-lg border border-gray-400 bg-white px-4 py-3 uppercase text-black outline-none focus:border-red-600 disabled:bg-gray-100"
                  />
                </label>

                <label>
                  <span className="mb-2 block font-bold text-black">
                    Status
                  </span>

                  <select
                    value={form.status}
                    onChange={(event) =>
                      updateForm(
                        "status",
                        event.target
                          .value as PaymentStatus
                      )
                    }
                    disabled={isPending}
                    className="w-full rounded-lg border border-gray-400 bg-white px-4 py-3 text-black outline-none focus:border-red-600 disabled:bg-gray-100"
                  >
                    {paymentStatuses.map((status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {formatLabel(status)}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="mb-2 block font-bold text-black">
                    Method
                  </span>

                  <select
                    value={form.method}
                    onChange={(event) =>
                      updateForm(
                        "method",
                        event.target.value as
                          | PaymentMethod
                          | ""
                      )
                    }
                    disabled={isPending}
                    className="w-full rounded-lg border border-gray-400 bg-white px-4 py-3 text-black outline-none focus:border-red-600 disabled:bg-gray-100"
                  >
                    <option value="">
                      Not specified
                    </option>

                    {paymentMethods.map((method) => (
                      <option
                        key={method}
                        value={method}
                      >
                        {formatLabel(method)}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="mb-2 block font-bold text-black">
                    Reference
                  </span>

                  <input
                    type="text"
                    value={form.reference}
                    onChange={(event) =>
                      updateForm(
                        "reference",
                        event.target.value
                      )
                    }
                    disabled={isPending}
                    placeholder="Optional unique reference"
                    className="w-full rounded-lg border border-gray-400 bg-white px-4 py-3 text-black outline-none placeholder:text-gray-600 focus:border-red-600 disabled:bg-gray-100"
                  />
                </label>

                <label>
                  <span className="mb-2 block font-bold text-black">
                    Paid date
                  </span>

                  <input
                    type="datetime-local"
                    value={form.paidAt}
                    onChange={(event) =>
                      updateForm(
                        "paidAt",
                        event.target.value
                      )
                    }
                    disabled={isPending}
                    className="w-full rounded-lg border border-gray-400 bg-white px-4 py-3 text-black outline-none focus:border-red-600 disabled:bg-gray-100"
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className="mb-2 block font-bold text-black">
                    Description
                  </span>

                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      updateForm(
                        "description",
                        event.target.value
                      )
                    }
                    disabled={isPending}
                    rows={3}
                    placeholder="Optional payment description"
                    className="w-full resize-y rounded-lg border border-gray-400 bg-white px-4 py-3 text-black outline-none placeholder:text-gray-600 focus:border-red-600 disabled:bg-gray-100"
                  />
                </label>
              </div>

              <div className="flex justify-end gap-3 border-t border-gray-300 bg-gray-50 px-6 py-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isPending}
                  className="rounded-lg border border-gray-400 bg-white px-5 py-3 font-bold text-black hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPending
                    ? "Saving..."
                    : editingPaymentId
                      ? "Save Changes"
                      : "Save Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}