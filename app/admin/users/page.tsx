export default function UsersPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Users</h1>

        <button className="rounded bg-gray-900 px-4 py-2 text-white">
          Add User
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg bg-green-100 shadow">
        <table className="w-full text-left">
          <thead className="border-b bg-white-50">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="p-4 text-gray-500" colSpan={4}>
                No users added yet.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}