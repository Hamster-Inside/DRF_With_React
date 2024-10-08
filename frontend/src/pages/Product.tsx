import React, { useEffect, useState, ChangeEvent, MouseEvent } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "services/shopServices/apiRequestsShop";
import { addToCart } from "services/shopServices/cartLogic";
import "./Product.css";
import CategoryParentTree from "components/CategoryParentTree";
import { useAuth } from "hooks/useAuth";

interface ProductDetails {
  name: string;
  category: string;
  description: string;
  price: number;
  sale_start: string | null;
  sale_end: string | null;
  is_on_sale: boolean;
  images: Image[];
  slug: string;
}

export default function Product() {
  const params = useParams<Record<string, string>>();
  const isLoggedIn = useAuth();
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>("");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const [product, setProduct] = useState<ProductDetails>({
    name: "",
    category: "",
    description: "",
    price: 0,
    sale_start: null,
    sale_end: null,
    is_on_sale: false,
    images: [{"image":""}],
    slug: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (params.slug) {
          const response = await getProduct(params.slug);
          if (response && response.data) {
            setProduct(response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProduct();
  }, [params]);

  const handleQuantityChange = (quantity: number) => {
    if (isNaN(quantity) || quantity < 1) {
      setError("Quantity must be a number greater than 0.");
      return;
    }
    setQuantity(quantity);
    setError(null);
  };

  const handleAddToCartClick = async (product: Product, event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    try {
      await addToCart(isLoggedIn, product, quantity);
      setConfirmationMessage(`Product added to the cart!`);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000); // Hide after 3 seconds
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <div className='product-view-container d-flex flex-column mx-auto'>
      {showConfirmation && <div className='confirmation-message'>{confirmationMessage}</div>}
      <CategoryParentTree className="category-tree" currentCategory={product.category} />
      <div className='product-top-info d-flex flex-row'>
        <div className='product-images'>
          <img src={product.images[0].image} alt={product.name} />
        </div>
        <div className='product-cart-info d-flex flex-column mx-auto'>
          <p>{product.name}</p>
          <p>{product.price} PLN</p>
          <div className='d-flex flex-row me-2 justify-content-center align-items-center'>
            Quantity:
            <input
              type='number'
              value={quantity}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                handleQuantityChange(Math.max(1, parseInt(e.target.value, 10)))
              }
              min='1'
              className='quantity-input form-control d-inline-block w-auto mx-2'
            />
            <button
              className='product-add-to-cart-btn'
              onClick={(event) => handleAddToCartClick(product, event)}
            >
              Add to cart
            </button>
          </div>
          {error && (
            <div className='error-message' style={{ color: "red", marginBottom: "10px" }}>
              {error}
            </div>
          )}
        </div>
      </div>
      <div className='product-description'>{product.description}</div>
    </div>
  );
}