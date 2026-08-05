import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/tankz-ui";
import {
  ClientGoal,
  MemberStatus,
} from "@/lib/generated/prisma/client";

import { updateClient } from "./actions";

type ClientFormProps = {
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    dateOfBirth: Date | null;
    addressLine1: string | null;
    addressLine2: string | null;
    city: string | null;
    postcode: string | null;
    emergencyName: string | null;
    emergencyPhone: string | null;
    notes: string | null;
    status: MemberStatus;
    goal: ClientGoal | null;
    goalDescription: string | null;
    startingWeightKg: string | null;
    currentWeightKg: string | null;
    targetWeightKg: string | null;
    heightCm: string | null;
    bodyFatPercentage: string | null;
    consultationDate: Date | null;
    coachNotes: string | null;
  };
};

const inputClasses =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100";

const textareaClasses =
  "min-h-32 w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100";

function formatDateInput(date: Date | null) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatLabel(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function ClientForm({ client }: ClientFormProps) {
  const updateAction = updateClient.bind(null, client.id);

  return (
    <form action={updateAction} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal details</CardTitle>

          <CardDescription>
            Core identity and account information for this client.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              First name
            </span>

            <input
              type="text"
              name="firstName"
              required
              autoComplete="given-name"
              defaultValue={client.firstName}
              className={inputClasses}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Last name
            </span>

            <input
              type="text"
              name="lastName"
              required
              autoComplete="family-name"
              defaultValue={client.lastName}
              className={inputClasses}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Email address
            </span>

            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              defaultValue={client.email}
              className={inputClasses}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Phone
            </span>

            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              defaultValue={client.phone ?? ""}
              className={inputClasses}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Date of birth
            </span>

            <input
              type="date"
              name="dateOfBirth"
              defaultValue={formatDateInput(client.dateOfBirth)}
              className={inputClasses}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Client status
            </span>

            <select
              name="status"
              defaultValue={client.status}
              className={inputClasses}
            >
              {Object.values(MemberStatus).map((status) => (
                <option key={status} value={status}>
                  {formatLabel(status)}
                </option>
              ))}
            </select>
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Coaching goals</CardTitle>

          <CardDescription>
            Define what the client is working toward and the context behind it.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Primary goal
            </span>

            <select
              name="goal"
              defaultValue={client.goal ?? ""}
              className={inputClasses}
            >
              <option value="">No goal selected</option>

              {Object.values(ClientGoal).map((goal) => (
                <option key={goal} value={goal}>
                  {formatLabel(goal)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Goal description
            </span>

            <textarea
              name="goalDescription"
              defaultValue={client.goalDescription ?? ""}
              placeholder="Example: Lose 10kg, improve confidence and complete a 5K."
              className={textareaClasses}
            />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress measurements</CardTitle>

          <CardDescription>
            Record the client&apos;s current baseline and target values.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Starting weight (kg)
            </span>

            <input
              type="number"
              name="startingWeightKg"
              min="1"
              max="500"
              step="0.1"
              defaultValue={client.startingWeightKg ?? ""}
              className={inputClasses}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Current weight (kg)
            </span>

            <input
              type="number"
              name="currentWeightKg"
              min="1"
              max="500"
              step="0.1"
              defaultValue={client.currentWeightKg ?? ""}
              className={inputClasses}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Target weight (kg)
            </span>

            <input
              type="number"
              name="targetWeightKg"
              min="1"
              max="500"
              step="0.1"
              defaultValue={client.targetWeightKg ?? ""}
              className={inputClasses}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Height (cm)
            </span>

            <input
              type="number"
              name="heightCm"
              min="50"
              max="300"
              step="0.1"
              defaultValue={client.heightCm ?? ""}
              className={inputClasses}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Body fat (%)
            </span>

            <input
              type="number"
              name="bodyFatPercentage"
              min="0"
              max="100"
              step="0.1"
              defaultValue={client.bodyFatPercentage ?? ""}
              className={inputClasses}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Consultation date
            </span>

            <input
              type="date"
              name="consultationDate"
              defaultValue={formatDateInput(
                client.consultationDate,
              )}
              className={inputClasses}
            />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact and emergency details</CardTitle>

          <CardDescription>
            Address and emergency contact information for the client record.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Address line 1
            </span>

            <input
              type="text"
              name="addressLine1"
              autoComplete="address-line1"
              defaultValue={client.addressLine1 ?? ""}
              className={inputClasses}
            />
          </label>

          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Address line 2
            </span>

            <input
              type="text"
              name="addressLine2"
              autoComplete="address-line2"
              defaultValue={client.addressLine2 ?? ""}
              className={inputClasses}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              City
            </span>

            <input
              type="text"
              name="city"
              autoComplete="address-level2"
              defaultValue={client.city ?? ""}
              className={inputClasses}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Postcode
            </span>

            <input
              type="text"
              name="postcode"
              autoComplete="postal-code"
              defaultValue={client.postcode ?? ""}
              className={inputClasses}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Emergency contact name
            </span>

            <input
              type="text"
              name="emergencyName"
              defaultValue={client.emergencyName ?? ""}
              className={inputClasses}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Emergency contact phone
            </span>

            <input
              type="tel"
              name="emergencyPhone"
              defaultValue={client.emergencyPhone ?? ""}
              className={inputClasses}
            />
          </label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>

          <CardDescription>
            Keep general account notes separate from private coaching notes.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              General notes
            </span>

            <textarea
              name="notes"
              defaultValue={client.notes ?? ""}
              placeholder="General account or administrative notes."
              className={textareaClasses}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-bold text-zinc-700">
              Private coach notes
            </span>

            <textarea
              name="coachNotes"
              defaultValue={client.coachNotes ?? ""}
              placeholder="Coaching observations, adherence, injuries, session focus and follow-up points."
              className="min-h-48 w-full resize-y rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-600 focus:ring-2 focus:ring-red-100"
            />
          </label>
        </CardContent>
      </Card>

      <div className="sticky bottom-4 flex flex-col-reverse gap-3 rounded-2xl border border-zinc-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:justify-end">
        <Button
          href={`/admin/members/${client.id}`}
          variant="outline"
          size="lg"
        >
          Cancel
        </Button>

        <Button type="submit" size="lg">
          Save client
        </Button>
      </div>
    </form>
  );
}