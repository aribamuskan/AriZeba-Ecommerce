# 🛍️ AriZeba — Full-Stack E-Commerce Web Application

AriZeba is a full-stack e-commerce web application designed to provide a complete online shopping experience for customers along with a dedicated administration system for managing products, orders, customers, inventory, and sales.

The application combines a responsive frontend with a Node.js and Express.js backend and a PostgreSQL database hosted on Supabase. The project is deployed online using Vercel.

![Status](https://img.shields.io/badge/Status-Live-success)
![Frontend](https://img.shields.io/badge/Frontend-HTML5%20%7C%20CSS3%20%7C%20JavaScript-orange)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express.js-green)
![Database](https://img.shields.io/badge/Database-PostgreSQL%20%7C%20Supabase-blue)
![Deployment](https://img.shields.io/badge/Deployment-Vercel-black)
![Source](https://img.shields.io/badge/Source-GitHub-lightgrey)

---

## 🚀 Live Demo

🌐 **Live Website:**  
https://ari-zeba-ecommerce-n1fs9w7re-ariba6.vercel.app/

📂 **GitHub Repository:**  
https://github.com/aribamuskan/AriZeba-Ecommerce

---

## 📌 Project Overview

AriZeba provides an end-to-end e-commerce workflow covering both customer-facing shopping functionality and administrative management.

The application allows customers to browse products, explore categories, view product details, manage their shopping cart, complete checkout, place orders, receive order confirmation, track orders, view previous orders, manage their account, and use wishlist functionality.

The administrative system provides tools for managing products, inventory, customers, orders, order statuses, sales information, revenue, best-selling products, and store statistics.

This project demonstrates the integration of a frontend interface with backend APIs and a relational PostgreSQL database to create a complete full-stack e-commerce application.

---

## 🎯 Project Objectives

The main objectives of AriZeba are:

- Build a complete full-stack e-commerce application
- Create a responsive and user-friendly shopping interface
- Implement customer authentication and account functionality
- Implement product browsing and product details
- Develop shopping cart and checkout functionality
- Store and manage customer orders
- Provide order tracking functionality
- Build an administrative dashboard
- Implement product and inventory management
- Implement customer management
- Track order status and sales information
- Connect the application to a PostgreSQL database
- Deploy the application online
- Practice frontend, backend, database, API, and deployment concepts

---

## ✨ Key Features

### 🛒 Customer Features

#### Product Browsing

- Browse available products
- Explore products by category
- View detailed product information
- View product prices
- View product descriptions
- Check product availability and stock

#### 🛍️ Shopping Cart

Customers can:

- Add products to cart
- Remove products from cart
- Update product quantities
- Review cart items
- View total order amount
- Continue shopping
- Proceed to checkout

#### 💳 Checkout

The checkout workflow allows customers to:

- Enter customer information
- Review selected products
- Review order totals
- Submit orders
- Receive order confirmation

#### 📦 Order Management

Customers can:

- Place orders
- View order confirmation
- View previous orders
- View order details
- Track order status

#### 👤 Customer Account

Customer account functionality includes:

- Account/profile information
- Customer-specific orders
- Order history
- Wishlist functionality

---

## 🔐 Admin Features

AriZeba includes a dedicated administration system for managing the store.

### 📊 Admin Dashboard

The dashboard provides an overview of store activity, including:

- Total orders
- Sales information
- Pending orders
- Customer overview
- Revenue information
- Sales analytics
- Revenue chart
- Best-selling products

### 📦 Order Management

Administrators can:

- View customer orders
- View order details
- Search orders
- Filter orders
- Update order status
- Monitor order progress

### 👥 Customer Management

Administrators can:

- View customers
- Review customer information
- Monitor customer activity associated with orders

### 🛍️ Product Management

Administrators can manage products, including:

- Add products
- Edit products
- Delete products
- Update product prices
- Update product descriptions
- Manage categories
- Manage stock
- Manage product images

---

## 🔄 Complete Application Workflow

    Customer
        ↓
    Browse Products
        ↓
    Product Details
        ↓
    Add to Cart
        ↓
    Review Cart
        ↓
    Checkout
        ↓
    Enter Customer Information
        ↓
    Place Order
        ↓
    Order Stored in PostgreSQL
        ↓
    Order Confirmation
        ↓
    Order Tracking
        ↓
    Admin Manages Order
        ↓
    Admin Updates Order Status
        ↓
    Customer Sees Updated Status

---

## 🏗️ System Architecture

    ┌──────────────────────────┐
    │        Customer          │
    │      Web Browser         │
    └────────────┬─────────────┘
                 │
                 ▼
    ┌──────────────────────────┐
    │        Frontend          │
    │ HTML5 + CSS3 + JavaScript│
    └────────────┬─────────────┘
                 │
                 │ API Requests
                 ▼
    ┌──────────────────────────┐
    │        Backend           │
    │   Node.js + Express.js   │
    └────────────┬─────────────┘
                 │
                 │ SQL Queries
                 ▼
    ┌──────────────────────────┐
    │       PostgreSQL         │
    │         Supabase         │
    └──────────────────────────┘

---

## 🧠 Application Workflow

    User visits website
            ↓
    Browse products
            ↓
    Select product
            ↓
    View product details
            ↓
    Add product to cart
            ↓
    Review cart
            ↓
    Checkout
            ↓
    Enter customer information
            ↓
    Place order
            ↓
    Order stored in PostgreSQL
            ↓
    Order confirmation
            ↓
    Order tracking
            ↓
    Admin manages order
            ↓
    Admin updates order status
            ↓
    Customer sees updated status

---

## 📊 Admin Workflow

    Admin Login
         ↓
    Admin Dashboard
         ↓
    ┌─────────────────────────┐
    │ View Statistics         │
    │ Manage Products         │
    │ Manage Customers        │
    │ Manage Orders           │
    │ Update Order Status     │
    │ View Sales Information  │
    └─────────────────────────┘

---

## 🗄️ Database

AriZeba uses PostgreSQL as its relational database.

The database is hosted using Supabase.

The backend communicates with PostgreSQL through the Node.js `pg` package.

### Database Responsibilities

The database is used to store and manage information related to:

- Customers
- Products
- Categories
- Orders
- Order items
- Order status
- Product inventory
- Customer-related order information
- Store statistics

---

## 🔌 Backend API

The backend is implemented using Node.js and Express.js.

The application contains backend APIs for different parts of the e-commerce workflow, including:

| API Area | Purpose |
|---|---|
| Authentication | Customer and admin authentication |
| Products | Product listing and product management |
| Orders | Order creation and retrieval |
| Order Tracking | Track order status |
| Order Status | Update order progress |
| Customers | Customer information and management |
| Admin | Dashboard and administrative operations |
| Statistics | Sales and store statistics |

---

## 📈 Store Management

The administrative dashboard provides store-level information that helps monitor the application.

### Dashboard Information

- Total orders
- Sales/revenue information
- Pending orders
- Customer overview
- Sales analytics
- Revenue chart
- Best-selling products

This provides a centralized interface for managing the main operational areas of the e-commerce application.

---

## 📱 Responsive Design

The frontend is designed to provide a responsive shopping experience across different screen sizes.

The interface includes:

- Responsive navigation
- Responsive product layouts
- Mobile-friendly pages
- Responsive shopping cart
- Responsive checkout interface
- Responsive admin pages

---

## 📂 Project Structure

    AriZeba-Ecommerce/
    │
    ├── backend/
    │   ├── server.js
    │   └── admin-login.html
    │
    ├── account.html
    ├── admin.html
    ├── cart.html
    ├── categories.html
    ├── checkout.html
    ├── home.html
    ├── index.html
    ├── my-orders.html
    ├── order-confirmation.html
    ├── order-tracking.html
    ├── orders.html
    ├── product-details.html
    ├── products.html
    ├── shop.html
    ├── tracking.html
    │
    ├── CSS files
    ├── JavaScript files
    ├── Images / Assets
    │
    ├── package.json
    ├── package-lock.json
    └── README.md

---

## ⚙️ Environment Variables

The backend uses environment variables for server and database configuration.

    PORT=
    DB_HOST=
    DB_PORT=
    DB_NAME=
    DB_USER=
    DB_PASSWORD=

### Environment Variable Description

| Variable | Purpose |
|---|---|
| `PORT` | Server port |
| `DB_HOST` | PostgreSQL database host |
| `DB_PORT` | PostgreSQL database port |
| `DB_NAME` | Database name |
| `DB_USER` | PostgreSQL database username |
| `DB_PASSWORD` | PostgreSQL database password |

> ⚠️ Database credentials should never be committed to GitHub. Use environment variables for sensitive configuration.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Frontend structure |
| CSS3 | Styling and responsive design |
| JavaScript | Frontend functionality |
| Node.js | Backend runtime |
| Express.js | Backend/API framework |
| PostgreSQL | Relational database |
| Supabase | PostgreSQL hosting |
| pg | PostgreSQL connection from Node.js |
| Git | Version control |
| GitHub | Source code hosting |
| Vercel | Deployment |

---

## 🧩 Core Concepts Practiced

This project provided practical experience with:

- Full-stack web development
- Frontend development
- Backend development
- Backend APIs
- CRUD operations
- PostgreSQL database management
- SQL queries
- Database connections
- Customer authentication
- Admin authentication
- Product management
- Inventory management
- Shopping cart logic
- Checkout workflow
- Order management
- Order tracking
- Search and filtering
- Dashboard statistics
- Sales analytics
- Environment variables
- Git and GitHub
- Cloud database hosting
- Web application deployment

---

## 🔐 Security Considerations

The project uses environment variables for database configuration and keeps sensitive database credentials outside the source code.

The application also separates customer-facing functionality from administrative functionality through dedicated admin interfaces and backend routes.

> For a production-scale deployment, additional security measures such as password hashing, stronger authentication/session management, input validation, rate limiting, and more restrictive CORS policies should be implemented.

---

## 🚀 Deployment

AriZeba is deployed using the following architecture:

    Frontend / Application
             ↓
           Vercel
             ↓
        Backend APIs
             ↓
       PostgreSQL
             ↓
          Supabase

### Deployment Stack

| Layer | Technology |
|---|---|
| Application Hosting | Vercel |
| Backend | Node.js + Express.js |
| Database | PostgreSQL |
| Database Hosting | Supabase |
| Source Control | GitHub |

---

## 💻 Running the Project Locally

### 1. Clone the Repository

    git clone https://github.com/aribamuskan/AriZeba-Ecommerce.git

### 2. Navigate to the Project

    cd AriZeba-Ecommerce

### 3. Install Dependencies

    npm install

### 4. Configure Environment Variables

Create a `.env` file and provide the required database configuration.

    PORT=3000
    DB_HOST=your_database_host
    DB_PORT=5432
    DB_NAME=your_database_name
    DB_USER=your_database_user
    DB_PASSWORD=your_database_password

### 5. Start the Backend

    node backend/server.js

The application can then be accessed through the configured local server.

---

## 🔎 Health Check

The backend provides a health-check endpoint:

    /api/health

This endpoint is used to verify that the backend and database connection are working correctly.

---

## 📋 Main Application Pages

| Page | Purpose |
|---|---|
| `index.html` | Main entry page |
| `home.html` | Home page |
| `shop.html` | Shop/product browsing |
| `products.html` | Product listing |
| `product-details.html` | Product information |
| `categories.html` | Product categories |
| `cart.html` | Shopping cart |
| `checkout.html` | Checkout |
| `order-confirmation.html` | Order confirmation |
| `orders.html` | Orders |
| `my-orders.html` | Customer order history |
| `order-tracking.html` | Order tracking |
| `tracking.html` | Tracking interface |
| `account.html` | Customer account |
| `admin.html` | Admin dashboard |
| `backend/admin-login.html` | Admin login |

---

## 🧪 Project Testing Areas

The application can be tested across the following workflows.

### Customer Testing

    Homepage
       ↓
    Product Browsing
       ↓
    Product Details
       ↓
    Cart
       ↓
    Checkout
       ↓
    Order Creation
       ↓
    Order Confirmation
       ↓
    Order Tracking

### Admin Testing

    Admin Login
       ↓
    Dashboard
       ↓
    Products
       ↓
    Customers
       ↓
    Orders
       ↓
    Order Status Update
       ↓
    Sales / Statistics

---

## 📌 Key Highlights

### 🛒 Complete Shopping Workflow

The project covers the complete customer journey from browsing products to placing and tracking an order.

### 👨‍💼 Dedicated Admin System

The application includes a separate administration interface for managing products, customers, orders, inventory, and store statistics.

### 🗄️ PostgreSQL Integration

Customer, product, and order-related information is stored using PostgreSQL.

### ☁️ Cloud Database

The PostgreSQL database is hosted through Supabase.

### 🚀 Live Deployment

The application is deployed online using Vercel and is accessible through the live demo.

### 🔗 Full-Stack Integration

The frontend communicates with backend APIs, which interact with the PostgreSQL database.

---

## 📊 Project Summary

| Category | Details |
|---|---|
| Project Type | Full-Stack E-Commerce Application |
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Database Hosting | Supabase |
| Deployment | Vercel |
| Source Control | GitHub |
| Customer System | Shopping, Cart, Checkout, Orders, Tracking |
| Admin System | Dashboard, Products, Customers, Orders, Analytics |
| Status | Live |

---

## 🌐 Project Resources

### 🚀 Live Application

https://ari-zeba-ecommerce-n1fs9w7re-ariba6.vercel.app/

### 📂 GitHub Repository

https://github.com/aribamuskan/AriZeba-Ecommerce

---

## 🔮 Future Improvements

Possible future enhancements include:

- Online payment gateway integration
- Advanced product search
- Product reviews and ratings
- Discount and coupon system
- Advanced inventory alerts
- Email notifications
- Order invoice generation
- Enhanced authentication and authorization
- Password hashing and stronger account security
- Advanced analytics and reporting
- Product recommendation features

---

## ⚠️ Disclaimer

AriZeba is a full-stack e-commerce project developed for learning, development, and portfolio purposes.

The application demonstrates practical implementation of frontend development, backend APIs, PostgreSQL database integration, administrative management, and cloud deployment.

---

## 👩‍💻 Author

**Ariba Saleem**

Software Engineering Student  
Full-Stack & AI/ML Enthusiast

---

## ⭐ Project Highlights

    AriZeba
       │
       ├── 🛍️ E-Commerce Store
       ├── 👤 Customer Accounts
       ├── 🛒 Shopping Cart
       ├── 📦 Order Management
       ├── 🚚 Order Tracking
       ├── 👨‍💼 Admin Dashboard
       ├── 📊 Sales Analytics
       ├── 🛍️ Product Management
       ├── 👥 Customer Management
       ├── 🗄️ PostgreSQL Database
       ├── ☁️ Supabase
       └── 🚀 Vercel Deployment

---

## ❤️ Thank You

Thank you for checking out **AriZeba**.

If you find the project useful or interesting, feel free to explore the repository and live application.

**AriZeba — A complete full-stack e-commerce experience.**