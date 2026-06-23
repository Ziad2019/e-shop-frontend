import axiosInstance from "@/lib/axios";
import type {
  ProductsResponse,
  ProductResponse,
  ProductsQueryParams,
  CreateProductDto,
  UpdateProductDto,
} from "@/types/product";

// ── Helper: build FormData from DTO ───────────────
function buildProductFormData(
  dto: CreateProductDto | UpdateProductDto,
): FormData {
  const formData = new FormData();

  if (dto.title) formData.append("title", dto.title);
  if (dto.description) formData.append("description", dto.description);
  if (dto.price !== undefined) formData.append("price", dto.price.toString());
  if (dto.quantity !== undefined)
    formData.append("quantity", dto.quantity.toString());
  if (dto.color) formData.append("color", dto.color);
  if (dto.category) formData.append("category", dto.category);
  if (dto.brand) formData.append("brand", dto.brand);
  if (dto.status) formData.append("status", dto.status);
  if (dto.isFeatured !== undefined)
    formData.append("isFeatured", dto.isFeatured.toString());
  if (dto.priceAfterDiscount !== undefined)
    formData.append("priceAfterDiscount", dto.priceAfterDiscount.toString());

  // tags → append each one separately
  if (dto.tags && dto.tags.length > 0) {
    dto.tags.forEach((tag) => formData.append("tags[]", tag));
  }

  // images
  if (dto.imageCover) formData.append("imageCover", dto.imageCover);
  if (dto.images && dto.images.length > 0) {
    dto.images.forEach((img) => formData.append("images", img));
  }

  return formData;
}

// ── Public ────────────────────────────────────────

// get all products (with optional filters)
export const getProducts = async (
  params?: ProductsQueryParams,
): Promise<ProductsResponse> => {
  const { data } = await axiosInstance.get<ProductsResponse>("/products", {
    params,
  });
  return data;
};


export const getProductsByCategory = async (
  categoryId: string,
  limit = 4
): Promise<ProductsResponse> => {
  const { data } = await axiosInstance.get<ProductsResponse>('/products', {
    params: { category: categoryId, limit },
  })
  return data
}

// get product by ID
export const getProductById = async (id: string): Promise<ProductResponse> => {
  const { data } = await axiosInstance.get<ProductResponse>(`/products/${id}`);
  return data;
};

// ── Admin Only ────────────────────────────────────

// create product
export const createProduct = async (
  dto: CreateProductDto,
): Promise<ProductResponse> => {
  const formData = buildProductFormData(dto);

  const { data } = await axiosInstance.post<ProductResponse>(
    "/products",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data;
};

// update product
export const updateProduct = async (
  id: string,
  dto: UpdateProductDto,
): Promise<ProductResponse> => {
  const formData = buildProductFormData(dto);

  const { data } = await axiosInstance.patch<ProductResponse>(
    `/products/${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    },
  );
  return data;
};

// delete product
export const deleteProduct = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/products/${id}`);
};
