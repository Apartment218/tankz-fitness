import { createMember } from "../actions";
export default function NewMemberPage() {
  return (
    <div className="max-w-4xl text-black">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Add member</h1>

        <p className="mt-2 font-medium text-gray-700">
          Create a new Tankz Fitness member.
        </p>
      </div>

      <form action={createMember}
        className="space-y-8 rounded-2xl border border-gray-300 bg-white p-6 shadow-sm"
      >
        <div>
          <h2 className="text-xl font-bold">Personal details</h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="firstName"
                className="mb-2 block font-bold text-gray-900"
              >
                First name
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="w-full rounded-lg border border-gray-400 px-4 py-3 outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="mb-2 block font-bold text-gray-900"
              >
                Last name
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="w-full rounded-lg border border-gray-400 px-4 py-3 outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block font-bold text-gray-900"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-lg border border-gray-400 px-4 py-3 outline-none focus:border-red-600"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block font-bold text-gray-900"
              >
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                className="w-full rounded-lg border border-gray-400 px-4 py-3 outline-none focus:border-red-600"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold">Membership</h2>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="membershipPlan"
                className="mb-2 block font-bold text-gray-900"
              >
                Membership plan
              </label>

              <select
                id="membershipPlan"
                name="membershipPlan"
                required
                className="w-full rounded-lg border border-gray-400 bg-white px-4 py-3"
              >
                <option value="">Select a plan</option>
                <option value="Bronze">Bronze</option>
                <option value="Silver">Silver</option>
                <option value="Gold">Gold</option>
                <option value="VIP">VIP</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="status"
                className="mb-2 block font-bold text-gray-900"
              >
                Member status
              </label>

              <select
                id="status"
                name="status"
                defaultValue="ACTIVE"
                className="w-full rounded-lg border border-gray-400 bg-white px-4 py-3"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-6">
          <a
            href="/admin/members"
            className="rounded-lg border border-gray-400 px-5 py-3 font-bold text-gray-900 hover:bg-gray-100"
          >
            Cancel
          </a>

          <button
            type="submit"
            className="rounded-lg bg-red-600 px-5 py-3 font-bold text-white hover:bg-red-700"
          >
            Save member
          </button>
        </div>
      </form>
    </div>
  );
}