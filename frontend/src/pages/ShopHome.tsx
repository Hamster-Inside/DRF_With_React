import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { generatePath, useNavigate } from "react-router-dom";
import { fetchCategories } from "../reduxComponents/reducers/categoryReducer";
import { RootState, AppDispatch } from "../reduxComponents/store";
import {
  Card,
  CardActionArea,
  CardContent,
  Grid2,
  Typography,
  Container,
  Box,
} from "@mui/material";
import { FRONTEND_SHOP_URL, FRONTEND_CATEGORY_URL } from "config";

export default function ShopHome() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { categories, isLoading, error } = useSelector(
    (state: RootState) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleCategoryClick = (slug: string) => {
    const categoryPath = generatePath(FRONTEND_CATEGORY_URL, { slug });
    navigate(categoryPath);
  };

  const renderCategoryTree = (categories: Category[]) => (
    <>
      {categories.map((category) => (
        <Grid2 container key={category.slug} sx={{ display: "flex", flexDirection: "column" }} gap={5}>
          <Card>
            <CardActionArea onClick={() => handleCategoryClick(category.slug)}>
              <CardContent sx={{ textAlign: "center" }}>
                <Typography variant="h6">{category.name}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>

          {category.children && category.children.length > 0 && (
            <Grid2
              container
              justifyContent="center"
              sx={{ display: "flex", flexDirection: "row" }} gap={5}
            >
              {renderCategoryTree(category.children)}
            </Grid2>
          )}
        </Grid2>
      ))}
    </>
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading categories.</p>;

  return (
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Welcome to Our Shop
      </Typography>
      <Box mt={4}>
        {categories.length > 0 ? (
          renderCategoryTree(categories)
        ) : (
          <p>No categories available.</p>
        )}
      </Box>
    </Container>
  );
}
