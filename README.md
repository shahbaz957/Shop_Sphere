# 🛒 Shop_Sphere – Full Stack E-Commerce Web Application

Shop_Sphere is a modern, scalable e-commerce platform built with MERN stack, featuring user authentication, product management, shopping cart, order tracking, and a fully functional Admin Dashboard with analytics. The project includes both backend and frontend, integrated with Cloudinary for image uploads and a responsive UI with Tailwind CSS.

## 🚀 Features

### Frontend (React)

* **User Features:**
  * User registration and login with JWT authentication.
  * Modern product catalog with search and pagination.
  * Product details page with stock, quantity controls, Add to Cart, and Checkout.
  * User profile with order tracking (Pending & Delivered).
  * Fully responsive UI using Tailwind CSS.
  * Smooth navigation and protected routes.

* **Admin Features:**
  * Admin dashboard with analytics for sales, revenue, and order trends.
  * Manage all products: add, update, delete.
  * Manage all orders: view pending/delivered, update status.
  * User management (view registered users).
  * Product image uploads via Cloudinary.
  * Modern, clean dashboard UI for easy monitoring.

### Backend (Node.js + Express)

* RESTful API endpoints for:
  * Users: register, login, profile
  * Products: CRUD operations, low-stock monitoring
  * Cart: add, remove, view items
  * Orders: create, track, delete
  * Admin analytics: sales, revenue, top products
* MongoDB for data storage (Mongoose ODM).
* Cloudinary integration for product and profile image uploads.
* JWT-based authentication and role-based authorization.
* Error handling and validation for secure API usage.

## 🧰 Tech Stack

| Frontend     | Backend     | Database | Others              |
|--------------|-------------|----------|---------------------|
| React.js     | Node.js     | MongoDB  | Tailwind CSS        |
| React Router | Express.js  | Mongoose | Axios               |
| Context API  | JWT         |          | Cloudinary          |
|              | bcrypt      |          | Multer (file upload)|

## 📝 Installation

1. Clone the repository
```
git clone https://github.com/shahbaz957/shop_sphere.git
cd shop_sphere
```
2. Environment Variables and install All the Dependencies
Create .env file in Backend with:
```
PORT=8000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🔗 API Endpoints

### Users

* POST /api/v1/user/register – Register a new user
* POST /api/v1/user/login – Login user
* GET /api/v1/user/profile – Get user profile (protected)

### Products

* POST /api/v1/product/add-product – Add new product (Admin only)
* POST /api/v1/product/delete-product – Delete product (Admin only)
* GET /api/v1/product/all-products – Get all products
* GET /api/v1/product/:productId – Get product details
* GET /api/v1/product/product-count – Get product count (Admin only)
* GET /api/v1/product/product-low – Get low stock products (Admin only)

### Cart

* POST /api/v1/cart/add-cart/:productId – Add product to cart
* POST /api/v1/cart/delete-cart/:productId – Remove product from cart
* GET /api/v1/cart – Get user cart items

### Orders

* POST /api/v1/order/create – Create order
* GET /api/v1/order – Get user orders
* DELETE /api/v1/order/delete/:orderId – Delete pending order

### Admin Analytics

* GET /api/v1/admin/dashboard – Get dashboard stats (total sales, revenue, top products)
* GET /api/v1/admin/users – Get all registered users
* GET /api/v1/admin/orders – Get all orders

## 🎨 UI & Screenshots

### Register Page

### Login Page

### Home / Product Grid

### Product Detail Page

### User Profile & Orders

### Admin Dashboard

## ⚙️ Future Enhancements

* Payment gateway integration (Stripe/PayPal)
* Advanced product filtering (category, price, rating)
* Notifications for order updates
* Multi-admin support

## 👨‍💻 Author

Mirza Shahbaz Ali Baig

* GitHub: https://github.com/shahbaz957
* Email: mirzashahbazbaig724@gmail.com
