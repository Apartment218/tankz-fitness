"use client";

import {
  ChangeEvent,
  FormEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";

type SettingsTab =
  | "business"
  | "operations"
  | "notifications"
  | "security";

type BusinessSettings = {
  gymName: string;
  email: string;
  phone: string;
  website: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  postcode: string;
  country: string;
  timezone: string;
  currency: string;
};

type OperationsSettings = {
  bookingWindowDays: number;
  cancellationHours: number;
  classCapacity: number;
  allowWaitlist: boolean;
  requireBookingApproval: boolean;
  allowGuestBookings: boolean;
};

type NotificationSettings = {
  newBookingEmail: boolean;
  cancellationEmail: boolean;
  paymentEmail: boolean;
  lowCapacityEmail: boolean;
  dailySummaryEmail: boolean;
  memberWelcomeEmail: boolean;
};

type SecuritySettings = {
  twoFactorEnabled: boolean;
  sessionTimeout: string;
  loginAlerts: boolean;
};

type AdminSettings = {
  business: BusinessSettings;
  operations: OperationsSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
};

type IconProps = {
  className?: string;
};

type SettingCardProps = {
  title: string;
  description: string;
  children: ReactNode;
};

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description: string;
};

const STORAGE_KEY = "tankz-hq-settings";

const defaultSettings: AdminSettings = {
  business: {
    gymName: "Tankz Fitness",
    email: "hello@tankzfitness.co.uk",
    phone: "+44 20 0000 0000",
    website: "https://tankzfitness.co.uk",
    addressLine1: "12 Fitness Street",
    addressLine2: "",
    city: "London",
    postcode: "E1 1AA",
    country: "United Kingdom",
    timezone: "Europe/London",
    currency: "GBP",
  },
  operations: {
    bookingWindowDays: 30,
    cancellationHours: 12,
    classCapacity: 20,
    allowWaitlist: true,
    requireBookingApproval: false,
    allowGuestBookings: true,
  },
  notifications: {
    newBookingEmail: true,
    cancellationEmail: true,
    paymentEmail: true,
    lowCapacityEmail: false,
    dailySummaryEmail: true,
    memberWelcomeEmail: true,
  },
  security: {
    twoFactorEnabled: false,
    sessionTimeout: "8",
    loginAlerts: true,
  },
};

const tabs: Array<{
  id: SettingsTab;
  label: string;
  description: string;
  icon: (props: IconProps) => ReactNode;
}> = [
  {
    id: "business",
    label: "Business",
    description: "Gym details and contact information",
    icon: BuildingIcon,
  },
  {
    id: "operations",
    label: "Operations",
    description: "Bookings and class preferences",
    icon: SlidersIcon,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Email and system alerts",
    icon: BellIcon,
  },
  {
    id: "security",
    label: "Security",
    description: "Account and login protection",
    icon: ShieldIcon,
  },
];

function BuildingIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path d="M3 21h18" />
      <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
      <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2" />
    </svg>
  );
}

function SlidersIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
      <path d="M1 14h6M9 8h6M17 16h6" />
    </svg>
  );
}

function BellIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}

function ShieldIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function SaveIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8M7 3v5h8" />
    </svg>
  );
}

function CheckIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 6" />
    </svg>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-zinc-800">
        {label}
      </span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
      />
    </label>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  children,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-zinc-800">
        {label}
      </span>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="h-12 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-950 outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
      >
        {children}
      </select>
    </label>
  );
}

function SettingCard({
  title,
  description,
  children,
}: SettingCardProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-100 px-5 py-5 sm:px-6">
        <h2 className="text-lg font-black tracking-tight text-zinc-950">
          {title}
        </h2>

        <p className="mt-1 text-sm leading-6 text-zinc-500">
          {description}
        </p>
      </div>

      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
}: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-5 rounded-xl border border-zinc-200 p-4">
      <div>
        <p className="text-sm font-bold text-zinc-900">{label}</p>

        <p className="mt-1 text-sm leading-5 text-zinc-500">
          {description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition ${
          checked ? "bg-red-600" : "bg-zinc-300"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] =
    useState<SettingsTab>("business");

  const [settings, setSettings] =
    useState<AdminSettings>(defaultSettings);

  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = window.localStorage.getItem(STORAGE_KEY);

      if (storedSettings) {
        const parsedSettings = JSON.parse(
          storedSettings,
        ) as Partial<AdminSettings>;

        setSettings({
          business: {
            ...defaultSettings.business,
            ...parsedSettings.business,
          },
          operations: {
            ...defaultSettings.operations,
            ...parsedSettings.operations,
          },
          notifications: {
            ...defaultSettings.notifications,
            ...parsedSettings.notifications,
          },
          security: {
            ...defaultSettings.security,
            ...parsedSettings.security,
          },
        });
      }
    } catch {
      setSettings(defaultSettings);
    } finally {
      setLoaded(true);
    }
  }, []);

  function updateBusiness(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value } = event.target;

    setSettings((current) => ({
      ...current,
      business: {
        ...current.business,
        [name]: value,
      },
    }));
  }

  function updateOperationNumber(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value } = event.target;

    setSettings((current) => ({
      ...current,
      operations: {
        ...current.operations,
        [name]: Math.max(0, Number(value)),
      },
    }));
  }

  function updateOperationToggle(
    field: keyof Pick<
      OperationsSettings,
      | "allowWaitlist"
      | "requireBookingApproval"
      | "allowGuestBookings"
    >,
    value: boolean,
  ) {
    setSettings((current) => ({
      ...current,
      operations: {
        ...current.operations,
        [field]: value,
      },
    }));
  }

  function updateNotification(
    field: keyof NotificationSettings,
    value: boolean,
  ) {
    setSettings((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        [field]: value,
      },
    }));
  }

  function updateSecurityToggle(
    field: keyof Pick<
      SecuritySettings,
      "twoFactorEnabled" | "loginAlerts"
    >,
    value: boolean,
  ) {
    setSettings((current) => ({
      ...current,
      security: {
        ...current.security,
        [field]: value,
      },
    }));
  }

  function updateSessionTimeout(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    setSettings((current) => ({
      ...current,
      security: {
        ...current.security,
        sessionTimeout: event.target.value,
      },
    }));
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(settings),
    );

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  function resetSettings() {
    const confirmed = window.confirm(
      "Reset all Tankz HQ settings to their defaults?",
    );

    if (!confirmed) {
      return;
    }

    setSettings(defaultSettings);
    window.localStorage.removeItem(STORAGE_KEY);
    setSaved(false);
  }

  if (!loaded) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-200 border-t-red-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.25em] text-red-600">
            Tankz HQ
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
            Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
            Manage your gym profile, booking rules, notifications and
            account security.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={resetSettings}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 text-sm font-bold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
          >
            Reset settings
          </button>

          <button
            type="submit"
            className={`inline-flex h-12 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-white shadow-sm transition ${
              saved
                ? "bg-emerald-600"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {saved ? (
              <>
                <CheckIcon className="h-5 w-5" />
                Settings saved
              </>
            ) : (
              <>
                <SaveIcon className="h-5 w-5" />
                Save changes
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm xl:sticky xl:top-28">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex w-full items-start gap-3 rounded-xl px-3 py-3.5 text-left transition ${
                    active
                      ? "bg-zinc-950 text-white"
                      : "text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                      active
                        ? "bg-red-600 text-white"
                        : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>

                  <span>
                    <span className="block text-sm font-black">
                      {tab.label}
                    </span>

                    <span
                      className={`mt-0.5 block text-xs leading-5 ${
                        active ? "text-zinc-400" : "text-zinc-500"
                      }`}
                    >
                      {tab.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="space-y-6">
          {activeTab === "business" && (
            <>
              <SettingCard
                title="Business profile"
                description="These details identify Tankz Fitness across the admin system."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <Input
                    label="Gym name"
                    name="gymName"
                    value={settings.business.gymName}
                    onChange={updateBusiness}
                    required
                  />

                  <Input
                    label="Contact email"
                    name="email"
                    type="email"
                    value={settings.business.email}
                    onChange={updateBusiness}
                    required
                  />

                  <Input
                    label="Telephone"
                    name="phone"
                    type="tel"
                    value={settings.business.phone}
                    onChange={updateBusiness}
                  />

                  <Input
                    label="Website"
                    name="website"
                    type="url"
                    value={settings.business.website}
                    onChange={updateBusiness}
                  />
                </div>
              </SettingCard>

              <SettingCard
                title="Location"
                description="Your primary gym address and regional preferences."
              >
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <Input
                      label="Address line 1"
                      name="addressLine1"
                      value={settings.business.addressLine1}
                      onChange={updateBusiness}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Input
                      label="Address line 2"
                      name="addressLine2"
                      value={settings.business.addressLine2}
                      onChange={updateBusiness}
                      placeholder="Optional"
                    />
                  </div>

                  <Input
                    label="City"
                    name="city"
                    value={settings.business.city}
                    onChange={updateBusiness}
                  />

                  <Input
                    label="Postcode"
                    name="postcode"
                    value={settings.business.postcode}
                    onChange={updateBusiness}
                  />

                  <Select
                    label="Country"
                    name="country"
                    value={settings.business.country}
                    onChange={updateBusiness}
                  >
                    <option value="United Kingdom">
                      United Kingdom
                    </option>
                    <option value="Ireland">Ireland</option>
                    <option value="United States">
                      United States
                    </option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </Select>

                  <Select
                    label="Time zone"
                    name="timezone"
                    value={settings.business.timezone}
                    onChange={updateBusiness}
                  >
                    <option value="Europe/London">
                      Europe/London
                    </option>
                    <option value="Europe/Dublin">
                      Europe/Dublin
                    </option>
                    <option value="America/New_York">
                      America/New York
                    </option>
                    <option value="America/Los_Angeles">
                      America/Los Angeles
                    </option>
                    <option value="Australia/Sydney">
                      Australia/Sydney
                    </option>
                  </Select>

                  <Select
                    label="Currency"
                    name="currency"
                    value={settings.business.currency}
                    onChange={updateBusiness}
                  >
                    <option value="GBP">GBP — British Pound</option>
                    <option value="EUR">EUR — Euro</option>
                    <option value="USD">USD — US Dollar</option>
                    <option value="CAD">CAD — Canadian Dollar</option>
                    <option value="AUD">AUD — Australian Dollar</option>
                  </Select>
                </div>
              </SettingCard>
            </>
          )}

          {activeTab === "operations" && (
            <>
              <SettingCard
                title="Booking rules"
                description="Control how far ahead members can book and cancel classes."
              >
                <div className="grid gap-5 md:grid-cols-3">
                  <Input
                    label="Booking window"
                    name="bookingWindowDays"
                    type="number"
                    value={settings.operations.bookingWindowDays}
                    onChange={updateOperationNumber}
                  />

                  <Input
                    label="Cancellation notice"
                    name="cancellationHours"
                    type="number"
                    value={settings.operations.cancellationHours}
                    onChange={updateOperationNumber}
                  />

                  <Input
                    label="Default class capacity"
                    name="classCapacity"
                    type="number"
                    value={settings.operations.classCapacity}
                    onChange={updateOperationNumber}
                  />
                </div>

                <div className="mt-4 grid gap-3 text-xs font-medium text-zinc-500 md:grid-cols-3">
                  <p>Number of days members can book ahead.</p>
                  <p>Minimum cancellation notice in hours.</p>
                  <p>Default capacity for newly created classes.</p>
                </div>
              </SettingCard>

              <SettingCard
                title="Booking options"
                description="Choose how member and guest bookings should behave."
              >
                <div className="space-y-4">
                  <Toggle
                    checked={settings.operations.allowWaitlist}
                    onChange={(value) =>
                      updateOperationToggle("allowWaitlist", value)
                    }
                    label="Enable class waitlists"
                    description="Allow members to join a waitlist when a class reaches capacity."
                  />

                  <Toggle
                    checked={
                      settings.operations.requireBookingApproval
                    }
                    onChange={(value) =>
                      updateOperationToggle(
                        "requireBookingApproval",
                        value,
                      )
                    }
                    label="Require booking approval"
                    description="New bookings remain pending until an administrator approves them."
                  />

                  <Toggle
                    checked={settings.operations.allowGuestBookings}
                    onChange={(value) =>
                      updateOperationToggle(
                        "allowGuestBookings",
                        value,
                      )
                    }
                    label="Allow guest bookings"
                    description="Permit customers without a member account to book eligible classes."
                  />
                </div>
              </SettingCard>
            </>
          )}

          {activeTab === "notifications" && (
            <SettingCard
              title="Email notifications"
              description="Choose which activity should generate an email notification."
            >
              <div className="space-y-4">
                <Toggle
                  checked={settings.notifications.newBookingEmail}
                  onChange={(value) =>
                    updateNotification("newBookingEmail", value)
                  }
                  label="New bookings"
                  description="Receive an email whenever a new class booking is created."
                />

                <Toggle
                  checked={settings.notifications.cancellationEmail}
                  onChange={(value) =>
                    updateNotification("cancellationEmail", value)
                  }
                  label="Booking cancellations"
                  description="Receive an email when a member cancels a booking."
                />

                <Toggle
                  checked={settings.notifications.paymentEmail}
                  onChange={(value) =>
                    updateNotification("paymentEmail", value)
                  }
                  label="Payment activity"
                  description="Receive notifications for successful and failed payments."
                />

                <Toggle
                  checked={settings.notifications.lowCapacityEmail}
                  onChange={(value) =>
                    updateNotification("lowCapacityEmail", value)
                  }
                  label="Low class attendance"
                  description="Receive an alert when a scheduled class has low attendance."
                />

                <Toggle
                  checked={settings.notifications.dailySummaryEmail}
                  onChange={(value) =>
                    updateNotification("dailySummaryEmail", value)
                  }
                  label="Daily summary"
                  description="Receive a daily overview of bookings, payments and classes."
                />

                <Toggle
                  checked={settings.notifications.memberWelcomeEmail}
                  onChange={(value) =>
                    updateNotification("memberWelcomeEmail", value)
                  }
                  label="Member welcome emails"
                  description="Automatically send a welcome email to newly registered members."
                />
              </div>
            </SettingCard>
          )}

          {activeTab === "security" && (
            <>
              <SettingCard
                title="Account protection"
                description="Manage login safeguards for the Tankz HQ administrator account."
              >
                <div className="space-y-4">
                  <Toggle
                    checked={settings.security.twoFactorEnabled}
                    onChange={(value) =>
                      updateSecurityToggle(
                        "twoFactorEnabled",
                        value,
                      )
                    }
                    label="Two-factor authentication"
                    description="Require an additional verification code when signing in."
                  />

                  <Toggle
                    checked={settings.security.loginAlerts}
                    onChange={(value) =>
                      updateSecurityToggle("loginAlerts", value)
                    }
                    label="New login alerts"
                    description="Send an email when the administrator account is accessed from a new device."
                  />
                </div>
              </SettingCard>

              <SettingCard
                title="Session management"
                description="Choose how long administrators remain signed in while inactive."
              >
                <div className="max-w-md">
                  <Select
                    label="Automatic sign-out"
                    name="sessionTimeout"
                    value={settings.security.sessionTimeout}
                    onChange={updateSessionTimeout}
                  >
                    <option value="1">After 1 hour</option>
                    <option value="4">After 4 hours</option>
                    <option value="8">After 8 hours</option>
                    <option value="12">After 12 hours</option>
                    <option value="24">After 24 hours</option>
                  </Select>
                </div>
              </SettingCard>

              <section className="rounded-2xl border border-red-200 bg-red-50 p-5 sm:p-6">
                <h2 className="text-lg font-black text-red-950">
                  Danger zone
                </h2>

                <p className="mt-1 text-sm leading-6 text-red-800/70">
                  Destructive account actions will become available once
                  authentication and the database are connected.
                </p>

                <button
                  type="button"
                  disabled
                  className="mt-5 inline-flex h-11 cursor-not-allowed items-center justify-center rounded-xl bg-red-200 px-5 text-sm font-bold text-red-500"
                >
                  Delete administrator account
                </button>
              </section>
            </>
          )}
        </div>
      </div>
    </form>
  );
} 