"use client";

import {
  FormEvent,
  useMemo,
  useState,
  useTransition,
} from "react";

import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "./actions";

export type ProductRecord = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  sku: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

type ProductForm = {
  name: string;
  description: string;
  price: string;
  stock: string;
  sku: string;
  active: boolean;
};

type ProductManagerProps = {
  initialProducts: ProductRecord[];
};

const emptyForm: ProductForm = {
  name: "",
  description: "",
  price: "",
  stock: "0",
  sku: "",
  active: true,
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getStockStyles(stock: number) {
  if (stock === 0) {
    return "bg-red-100 text-red-800";
  }

  if (stock <= 5) {
    return "bg-amber-100 text-amber-800";
  }

  return "bg-green-100 text-green-800";
}

function getStockLabel(stock: number) {
  if (stock === 0) {
    return "Out of stock";
  }

  if (stock <= 5) {
    return `Low: ${stock}`;
  }

  return `${stock} in stock`;
}

export default function ProductManager({
  initialProducts,
}: ProductManagerProps) {
  const [products, setProducts] =
    useState<ProductRecord[]>(initialProducts);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<
    string | null
  >(null);

  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const [isPending, startTransition] = useTransition();

  const filteredProducts = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search) ||
        product.description?.toLowerCase().includes(search) ||
        product.sku?.toLowerCase().includes(search);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Active" && product.active) ||
        (statusFilter === "Inactive" && !product.active) ||
        (statusFilter === "Low Stock" &&
          product.stock > 0 &&
          product.stock <= 5) ||
        (statusFilter === "Out of Stock" &&
          product.stock === 0);

      return matchesSearch && matchesStatus;
    });
  }, [products, searchTerm, statusFilter]);

  const activeCount = products.filter(
    (product) => product.active
  ).length;

  const lowStockCount = products.filter(
    (product) => product.stock > 0 && product.stock <= 5
  ).length;

  const outOfStockCount = products.filter(
    (product) => product.stock === 0
  ).length;

  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0
  );

  function updateForm<K extends keyof ProductForm>(
    field: K,
    value: ProductForm[K]
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function openAddModal() {
    setEditingProductId(null);
    setForm(emptyForm);
    setFormError("");
    setNotice("");
    setIsModalOpen(true);
  }

  function openEditModal(product: ProductRecord) {
    setEditingProductId(product.id);

    setForm({
      name: product.name,
      description: product.description ?? "",
      price: product.price.toFixed(2),
      stock: product.stock.toString(),
      sku: product.sku ?? "",
      active: product.active,
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
    setEditingProductId(null);
    setForm(emptyForm);
    setFormError("");
  }

  function validateForm() {
    if (!form.name.trim()) {
      return "Product name is required.";
    }

    const price = Number(form.price);

    if (!Number.isFinite(price) || price < 0) {
      return "Price must be £0 or greater.";
    }

    const stock = Number(form.stock);

    if (!Number.isInteger(stock) || stock < 0) {
      return "Stock must be a whole number of 0 or greater.";
    }

    const duplicateSku = products.some(
      (product) =>
        product.id !== editingProductId &&
        form.sku.trim() &&
        product.sku?.toLowerCase() ===
          form.sku.trim().toLowerCase()
    );

    if (duplicateSku) {
      return "A product with this SKU already exists.";
    }

    return "";
  }

  function createFormData() {
    const formData = new FormData();

    formData.set("name", form.name);
    formData.set("description", form.description);
    formData.set("price", form.price);
    formData.set("stock", form.stock);
    formData.set("sku", form.sku);
    formData.set("active", form.active.toString());

    return formData;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
        editingProductId === null
          ? await createProduct(formData)
          : await updateProduct(editingProductId, formData);

      if (!result.success) {
        setFormError(result.message);
        return;
      }

      setNotice(result.message);
      setIsModalOpen(false);
      setEditingProductId(null);
      setForm(emptyForm);

      window.location.reload();
    });
  }

  function handleDelete(product: ProductRecord) {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setNotice("");
    setFormError("");

    startTransition(async () => {
      const result = await deleteProduct(product.id);

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (currentProduct) =>
            currentProduct.id !== product.id
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
            Products
          </h1>

          <p className="mt-2 font-medium text-gray-700">
            Manage products, pricing and stock levels.
          </p>
        </div>

        <button
          type="button"
          onClick={openAddModal}
          className="rounded-lg bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
        >
          + Add Product
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
            Active Products
          </p>

          <p className="mt-2 text-3xl font-bold text-black">
            {activeCount}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-300 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-gray-700">
            Low Stock
          </p>

          <p className="mt-2 text-3xl font-bold text-black">
            {lowStockCount}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-300 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-gray-700">
            Out of Stock
          </p>

          <p className="mt-2 text-3xl font-bold text-black">
            {outOfStockCount}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-300 bg-white p-5 shadow-sm">
          <p className="text-sm font-bold text-gray-700">
            Inventory Value
          </p>

          <p className="mt-2 text-3xl font-bold text-black">
            {formatCurrency(inventoryValue)}
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
          placeholder="Search name, description or SKU..."
          className="min-w-72 flex-1 rounded-lg border border-gray-400 bg-white px-4 py-3 text-black outline-none placeholder:text-gray-600 focus:border-red-600"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="rounded-lg border border-gray-400 bg-white px-4 py-3 font-medium text-black outline-none focus:border-red-600"
        >
          <option value="All">All products</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Low Stock">Low stock</option>
          <option value="Out of Stock">
            Out of stock
          </option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-300 bg-white shadow-sm">
        <table className="w-full min-w-[1050px] text-left">
          <thead className="border-b border-gray-300 bg-gray-100">
            <tr>
              <th className="px-6 py-4 font-bold text-black">
                Product
              </th>

              <th className="px-6 py-4 font-bold text-black">
                SKU
              </th>

              <th className="px-6 py-4 font-bold text-black">
                Price
              </th>

              <th className="px-6 py-4 font-bold text-black">
                Stock
              </th>

              <th className="px-6 py-4 font-bold text-black">
                Status
              </th>

              <th className="px-6 py-4 font-bold text-black">
                Updated
              </th>

              <th className="px-6 py-4 text-right font-bold text-black">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50"
              >
                <td className="px-6 py-5">
                  <p className="font-bold text-black">
                    {product.name}
                  </p>

                  <p className="mt-1 max-w-sm truncate text-sm font-medium text-gray-600">
                    {product.description ||
                      "No description"}
                  </p>
                </td>

                <td className="px-6 py-5 font-semibold text-gray-800">
                  {product.sku || "—"}
                </td>

                <td className="px-6 py-5 font-bold text-black">
                  {formatCurrency(product.price)}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStockStyles(
                      product.stock
                    )}`}
                  >
                    {getStockLabel(product.stock)}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                      product.active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {product.active
                      ? "Active"
                      : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-5 font-medium text-gray-700">
                  {formatDate(product.updatedAt)}
                </td>

                <td className="px-6 py-5 text-right">
                  <button
                    type="button"
                    onClick={() =>
                      openEditModal(product)
                    }
                    disabled={isPending}
                    className="mr-4 font-bold text-blue-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(product)
                    }
                    disabled={isPending}
                    className="font-bold text-red-700 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredProducts.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-14 text-center"
                >
                  <p className="text-lg font-bold text-black">
                    No products found
                  </p>

                  <p className="mt-1 font-medium text-gray-700">
                    Try changing your search or filter,
                    or add a new product.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm font-semibold text-gray-700">
        Showing {filteredProducts.length} of{" "}
        {products.length} products
      </p>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onMouseDown={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="product-modal-title"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-gray-300 px-6 py-5">
              <div>
                <h2
                  id="product-modal-title"
                  className="text-2xl font-bold text-black"
                >
                  {editingProductId
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="mt-1 font-medium text-gray-700">
                  {editingProductId
                    ? "Update this product record."
                    : "Add a product to your live inventory."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isPending}
                aria-label="Close product form"
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
                    Product name
                  </span>

                  <input
                    type="text"
                    value={form.name}
                    onChange={(event) =>
                      updateForm(
                        "name",
                        event.target.value
                      )
                    }
                    required
                    autoFocus
                    disabled={isPending}
                    placeholder="Example: Tankz Shaker"
                    className="w-full rounded-lg border border-gray-400 bg-white px-4 py-3 text-black outline-none placeholder:text-gray-600 focus:border-red-600 disabled:bg-gray-100"
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
                    placeholder="Optional product description"
                    className="w-full resize-y rounded-lg border border-gray-400 bg-white px-4 py-3 text-black outline-none placeholder:text-gray-600 focus:border-red-600 disabled:bg-gray-100"
                  />
                </label>

                <label>
                  <span className="mb-2 block font-bold text-black">
                    Price
                  </span>

                  <div className="flex rounded-lg border border-gray-400 bg-white focus-within:border-red-600">
                    <span className="flex items-center border-r border-gray-300 px-4 font-bold text-gray-700">
                      £
                    </span>

                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(event) =>
                        updateForm(
                          "price",
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
                    Stock
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(event) =>
                      updateForm(
                        "stock",
                        event.target.value
                      )
                    }
                    required
                    disabled={isPending}
                    className="w-full rounded-lg border border-gray-400 bg-white px-4 py-3 text-black outline-none focus:border-red-600 disabled:bg-gray-100"
                  />
                </label>

                <label>
                  <span className="mb-2 block font-bold text-black">
                    SKU
                  </span>

                  <input
                    type="text"
                    value={form.sku}
                    onChange={(event) =>
                      updateForm(
                        "sku",
                        event.target.value
                      )
                    }
                    disabled={isPending}
                    placeholder="Optional unique SKU"
                    className="w-full rounded-lg border border-gray-400 bg-white px-4 py-3 uppercase text-black outline-none placeholder:normal-case placeholder:text-gray-600 focus:border-red-600 disabled:bg-gray-100"
                  />
                </label>

                <label>
                  <span className="mb-2 block font-bold text-black">
                    Status
                  </span>

                  <select
                    value={form.active.toString()}
                    onChange={(event) =>
                      updateForm(
                        "active",
                        event.target.value === "true"
                      )
                    }
                    disabled={isPending}
                    className="w-full rounded-lg border border-gray-400 bg-white px-4 py-3 text-black outline-none focus:border-red-600 disabled:bg-gray-100"
                  >
                    <option value="true">Active</option>
                    <option value="false">
                      Inactive
                    </option>
                  </select>
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
                    : editingProductId
                      ? "Save Changes"
                      : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}