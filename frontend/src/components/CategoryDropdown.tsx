import React, { useEffect, MouseEvent } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../reduxComponents/reducers/categoryTreeReducer";
import "./CategoryDropdown.css";
import {
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBContainer,
} from "mdb-react-ui-kit";
import { FRONTEND_CATEGORY_URL, FRONTEND_SHOP_URL } from "config";
import { RootState, AppDispatch } from "../reduxComponents/store"; 


const CategoryDropdown: React.FC = () => {
  const { categories, isLoading, error } = useSelector((state: RootState) => state.categories);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleItemClick = (slug: string, event: MouseEvent<HTMLLIElement>) => {
    event.stopPropagation();
    const categoryPath = generatePath(FRONTEND_CATEGORY_URL, { slug });
        navigate(categoryPath);
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading categories.</p>;

  const renderCategories = () => {
    if (!categories || categories.length === 0 || !categories[0].children) {
      return null;
    }
    return (
      <MDBContainer className='d-flex justify-content-center basic'>
        <MDBDropdown animation={false}>
          <MDBDropdownToggle>Categories</MDBDropdownToggle>
          <MDBDropdownMenu>{renderCategoryTree(categories[0].children!)}</MDBDropdownMenu>
        </MDBDropdown>
      </MDBContainer>
    );
  };

  const renderCategoryTree = (categories: CategoryTreeElement[]): JSX.Element => {
    return (
      <>
        {categories.map((category) => (
          <MDBDropdownItem
            key={category.slug}
            className='dropdown-item'
            onClick={(event) => handleItemClick(category.slug, event as MouseEvent<HTMLLIElement>)}
          >
            <span style={{ display: "flex", justifyContent: "space-between" }}>
              {category.name}
              {category.children && category.children.length > 0 && <span>&raquo;</span>}
            </span>
            {category.children && category.children.length > 0 && (
              <ul className='dropdown-menu dropdown-submenu'>
                {category.children.map((child) => (
                  <MDBDropdownItem
                    key={child.slug}
                    className='dropdown-item'
                    onClick={(event) => handleItemClick(child.slug, event as MouseEvent<HTMLLIElement>)}
                  >
                    <span style={{ display: "flex", justifyContent: "space-between" }}>
                      {child.name}{" "}
                      {child.children && child.children.length > 0 && <span>&raquo;</span>}
                    </span>
                    {child.children && child.children.length > 0 && (
                      <ul className='dropdown-menu dropdown-submenu'>
                        {renderCategoryTree(child.children)}
                      </ul>
                    )}
                  </MDBDropdownItem>
                ))}
              </ul>
            )}
          </MDBDropdownItem>
        ))}
      </>
    );
  };

  return <>{renderCategories()}</>;
};

export default CategoryDropdown;