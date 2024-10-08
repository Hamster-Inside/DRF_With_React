from django.urls import path
from .views import ProductList, ProductCreate, ProductEditView, HomeView, ProductView, CategoriesView, \
    CategoryView, CategoryCreateView, CategoryEditView, ShopAdminPanel, ShopAdminPanelProducts, CategoryChildrenView, \
    CategoryProductsView, CategoryParentsView, ProductParentCategoryView, ProductSearchView, \
    CategoriesSearchAssociatedView, ShoppingCartItemCreateView, \
    ShoppingCartItemUpdateView, ShoppingCartItemDestroyView, ShoppingCartItemListView, CategoryValidateView

urlpatterns = [
    path('', HomeView.as_view(), name='home'),
    path('search', ProductSearchView.as_view(), name='search'),
    path('search-associated-categories', CategoriesSearchAssociatedView.as_view(), name='associated_categories'),
    path('products', ProductList.as_view(), name='products'),
    path('product/create', ProductCreate.as_view(), name='product_create'),
    path('product/<slug:slug>', ProductView.as_view(), name='product'),
    path('product/<slug:slug>/edit', ProductEditView.as_view(), name='product_edit'),
    path('product/<slug:slug>/parent-category', ProductParentCategoryView.as_view(), name='parent-category-detail'),
    path('categories', CategoriesView.as_view(), name='categories'),
    path('category/create', CategoryCreateView.as_view(), name='category_create'),
    path('category/<slug:slug>', CategoryView.as_view(), name='category'),
    path('category/<slug:slug>/validate', CategoryValidateView.as_view(), name='category_validate'),
    path('category/<slug:slug>/edit', CategoryEditView.as_view(), name='category_edit'),
    path('category/<slug:slug>/children', CategoryChildrenView.as_view(), name='category_children'),
    path('category/<slug:slug>/products', CategoryProductsView.as_view(), name='category_products'),
    path('category/<slug:slug>/parents', CategoryParentsView.as_view(), name='category_parents'),
    path('shopping-admin-panel', ShopAdminPanel.as_view(), name='shop_admin_panel'),
    path('shopping-admin-panel/products', ShopAdminPanelProducts.as_view(), name='shop_admin_panel_products'),
    path('cart', ShoppingCartItemListView.as_view(), name='shopping-cart'),
    path('cart/item/add', ShoppingCartItemCreateView.as_view(), name='add-cart-item'),
    path('cart/item/update', ShoppingCartItemUpdateView.as_view(), name='update-cart-item'),
    path('cart/item/delete', ShoppingCartItemDestroyView.as_view(), name='delete-cart-item')
]
