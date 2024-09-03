import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_CATEGORY_URL } from "config";
import useQueryParams from "hooks/useQueryParams";
import "./CategoryAssociatedTree.css";
import { getAllSearchAssociatedCategories } from "services/apiRequestsShop";

// Define types for the props and state
interface Category {
  slug: string;
  name: string;
  product_count: number;
  children?: Category[];
}

interface CategoryAssociatedTreeProps {
  className?: string;
}

interface QueryParams {
  [key: string]: string;
}

interface CategoryResponse {
  categories: Category[];
}

const CategoryAssociatedTree: React.FC<CategoryAssociatedTreeProps> = ({ className }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();
  const queryParams: QueryParams = useQueryParams();

  useEffect(() => {
    const fetchAssociatedCategoriesTree = async () => {
      try {
        const response = await getAllSearchAssociatedCategories(queryParams.string);
        
        // Check if response is defined before accessing its data
        if (response && response.data) {
          setCategories(response.data.categories);
        } else {
          console.error("Response is undefined or does not contain data.");
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching associated categories:", error);
        setCategories([]);
      }
    };

    fetchAssociatedCategoriesTree();
  }, [queryParams]);

  const handleNavigationClick = (slug: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`${API_CATEGORY_URL}/${slug}`);
  };

  const CategoryTree: React.FC<{ category: Category }> = ({ category }) => {
    return (
      <div className="category-tree">
        <div
          onClick={(event) => handleNavigationClick(category.slug, event)}
          className="associated-category"
        >
          <span className="category-name">{category.name}</span>
          <span className="category-count">{category.product_count}</span>
        </div>
        {category.children && category.children.length > 0 && (
          <div className="category-children">
            {category.children.map((childCategory) => (
              <CategoryTree key={childCategory.slug} category={childCategory} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const listAssociatedCategories = () => {
    return (
      <>
        {categories.map((category) => (
          <CategoryTree key={category.slug} category={category} />
        ))}
      </>
    );
  };

  return (
    <div className={`${className} d-flex flex-column gap-2`}>
      <h3>Subcategories:</h3>
      {listAssociatedCategories()}
    </div>
  );
};

export default CategoryAssociatedTree;