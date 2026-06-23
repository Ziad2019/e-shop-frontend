export interface CategoryImage {
  _id:      string
  url:      string
  alt?:     string
}

// export interface Category {
//   _id:   string
//   name:  { ar: string; en: string }
//   slug:  string
//   image?: CategoryImage
// }
// export interface CategoriesResponse {
//   results: number
//   data:    Category[]
// }

export interface CategoryResponse {
  data: Category
}


export interface CreateCategoryDto {
  name:   string
  image?: File
}

export interface UpdateCategoryDto {
  name?:  string
  image?: File
}

export interface CategoryImage {
  _id:          string
  url:          string
  thumbnailUrl?: string
  mediumUrl?:   string
}

export interface Category {
  _id:       string
  name:      string
  slug:      string
  image?:    CategoryImage
  createdAt: string
  updatedAt: string
}

export interface CategoriesResponse {
  status:  number
  message: string
  length:  number
  data:    Category[]
}