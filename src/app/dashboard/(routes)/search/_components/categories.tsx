import { Category } from "@prisma/client"
import CategoryItem from "./category-item"
import SearchInput from "@/components/search-input"

type CategoriesPros = {
  categories: Category[]
}

const Categories = ({ categories }: CategoriesPros) => {
  return (
    <>
      <div className="mb-3 md:hidden">
        <SearchInput />
      </div>
      <div className="space-x-2 overflow-auto flex items-center pb-6 scroll-smooth">
        {categories.map((category) => (
          <CategoryItem key={category.id} category={category} />
        ))}
      </div>
    </>
  )
}

export default Categories
