const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { Pool } = require("pg");

dotenv.config();

// =====================================================
// ENVIRONMENT / DATABASE CONFIGURATION
// =====================================================

const PORT = Number(process.env.PORT || 5000);

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = Number(process.env.DB_PORT || 5432);
const DB_NAME = process.env.DB_NAME || "arizeba";
const DB_USER = process.env.DB_USER || "postgres";
const DB_PASSWORD = process.env.DB_PASSWORD;


// =====================================================
// EXPRESS APP
// =====================================================

const app = express();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: true,
    credentials: true
  })
);

app.use(
  express.json({
    limit: "2mb"
  })
);


// =====================================================
// ADMIN LOGIN
// =====================================================

app.post("/api/admin/login", async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const adminEmail =
      process.env.ADMIN_EMAIL;

    const adminPassword =
      process.env.ADMIN_PASSWORD;

    if (
      email.trim().toLowerCase() !==
        String(adminEmail).trim().toLowerCase() ||
      password !== adminPassword
    ) {

      return res.status(401).json({
        message: "Invalid admin email or password"
      });

    }

    res.json({
      message: "Admin login successful",

      admin: {
        email: adminEmail,
        role: "admin"
      }
    });

  } catch (err) {

    console.error(
      "Admin login error:",
      err
    );

    res.status(500).json({
      message: "Admin login failed"
    });

  }
});


// =====================================================
// SERVE ARIZEBA FRONTEND
// =====================================================

app.use(
  express.static(
    path.join(__dirname, "..")
  )
);


// =====================================================
// SERVE ADMIN LOGIN PAGE
// admin-login.html is inside backend folder
// =====================================================

app.get("/admin-login.html", (req, res) => {
  res.sendFile(
    path.join(__dirname, "admin-login.html")
  );
});


// =====================================================
// DATABASE CONNECTION
// =====================================================

const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  database: DB_NAME,
  user: DB_USER,
  password: DB_PASSWORD
});


// =====================================================
// DATABASE ERROR HANDLER
// =====================================================

pool.on("error", (error) => {

  console.error(
    "Unexpected PostgreSQL pool error:",
    error.message
  );

});


// =====================================================
// HOME / SERVER TEST
// =====================================================

app.get("/", (req, res) => {

  res.json({
    success: true,
    message: "Arizeba backend is running!"
  });

});


// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", async (req, res) => {

  try {

    await pool.query("SELECT 1");

    res.json({
      success: true,
      database: "connected",
      server: "running"
    });

  } catch (error) {

    console.error(
      "Health check error:",
      error.message
    );

    res.status(503).json({
      success: false,
      database: "disconnected",
      server: "running"
    });

  }

});


// =====================================================
// REGISTER
// =====================================================

app.post("/api/register", async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;

    const cleanName =
      String(name || "").trim();

    const cleanEmail =
      String(email || "")
        .trim()
        .toLowerCase();

    const cleanPassword =
      String(password || "");

    if (
      !cleanName ||
      !cleanEmail ||
      !cleanPassword
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Name, email and password are required"

      });

    }

    if (cleanPassword.length < 6) {

      return res.status(400).json({

        success: false,

        message:
          "Password must be at least 6 characters"

      });

    }

    const existingUser =
      await pool.query(

        `
          SELECT id
          FROM users
          WHERE LOWER(email) = $1
          LIMIT 1
        `,

        [
          cleanEmail
        ]

      );

    if (
      existingUser.rows.length > 0
    ) {

      return res.status(409).json({

        success: false,

        message:
          "Email already registered"

      });

    }

    const result =
      await pool.query(

        `
          INSERT INTO users
          (
            name,
            email,
            password
          )

          VALUES
          (
            $1,
            $2,
            $3
          )

          RETURNING
            id,
            name,
            email,
            created_at
        `,

        [
          cleanName,
          cleanEmail,
          cleanPassword
        ]

      );

    return res.status(201).json({

      success: true,

      message:
        "User registered successfully",

      user:
        result.rows[0]

    });

  } catch (error) {

    console.error(
      "Registration error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Server error during registration"

    });

  }

});


// =====================================================
// LOGIN
// =====================================================

app.post("/api/login", async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    const cleanEmail =
      String(email || "")
        .trim()
        .toLowerCase();

    const cleanPassword =
      String(password || "");

    if (
      !cleanEmail ||
      !cleanPassword
    ) {

      return res.status(400).json({

        success: false,

        message:
          "Email and password are required"

      });

    }

    const result =
      await pool.query(

        `
          SELECT *
          FROM users
          WHERE LOWER(email) = $1
          LIMIT 1
        `,

        [
          cleanEmail
        ]

      );

    if (
      result.rows.length === 0
    ) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid email or password"

      });

    }

    const user =
      result.rows[0];

    if (
      String(user.password) !==
      cleanPassword
    ) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid email or password"

      });

    }

    return res.json({

      success: true,

      message:
        "Login successful",

      user: {

        id:
          user.id,

        name:
          user.name,

        email:
          user.email

      }

    });

  } catch (error) {

    console.error(
      "Login error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Server error during login"

    });

  }

});


// =====================================================
// CREATE USERS TABLE
// =====================================================

async function createUsersTable() {

  try {

    await pool.query(`

      CREATE TABLE IF NOT EXISTS users (

        id SERIAL PRIMARY KEY,

        name VARCHAR(150)
        NOT NULL,

        email VARCHAR(150)
        UNIQUE NOT NULL,

        password TEXT
        NOT NULL,

        created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

      )

    `);

    console.log(
      "Users table ready"
    );

  } catch (error) {

    console.error(
      "Users table error:",
      error.message
    );

    throw error;

  }

}


// =====================================================
// CREATE PRODUCTS TABLE
// =====================================================

async function createProductsTable() {

  try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS products (

        id SERIAL PRIMARY KEY,

        product_id VARCHAR(100)
        UNIQUE NOT NULL,

        name VARCHAR(200)
        NOT NULL,

        description TEXT
        DEFAULT '',

        category VARCHAR(100)
        DEFAULT '',

        price NUMERIC(10,2)
        NOT NULL DEFAULT 0,

        old_price NUMERIC(10,2)
        DEFAULT 0,

        image TEXT
        DEFAULT '',

        rating NUMERIC(3,2)
        DEFAULT 0,

        stock INTEGER
        DEFAULT 0,

        is_active BOOLEAN
        DEFAULT TRUE,

        created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

      )
    `);


    await pool.query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS
      old_price NUMERIC(10,2)
      DEFAULT 0
    `);


    await pool.query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS
      image TEXT
      DEFAULT ''
    `);


    await pool.query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS
      rating NUMERIC(3,2)
      DEFAULT 0
    `);


    await pool.query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS
      stock INTEGER
      DEFAULT 0
    `);


    await pool.query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS
      is_active BOOLEAN
      DEFAULT TRUE
    `);


    await pool.query(`
      ALTER TABLE products
      ADD COLUMN IF NOT EXISTS
      created_at TIMESTAMP
      DEFAULT CURRENT_TIMESTAMP
    `);


    console.log(
      "Products table ready"
    );

  } catch (error) {

    console.error(
      "Products table error:",
      error.message
    );

    throw error;

  }

}


// =====================================================
// CREATE ORDERS TABLE
// =====================================================

async function createOrdersTable() {

  try {

    await pool.query(`

      CREATE TABLE IF NOT EXISTS orders (

        id SERIAL PRIMARY KEY,

        order_id VARCHAR(50)
        UNIQUE NOT NULL,

        tracking_number VARCHAR(50)
        UNIQUE,

        customer_name VARCHAR(150),

        customer_email VARCHAR(150),

        customer_phone VARCHAR(50),

        address TEXT,

        items JSONB NOT NULL,

        delivery_type VARCHAR(50)
        NOT NULL
        DEFAULT 'standard',

        delivery_price NUMERIC(10,2)
        NOT NULL
        DEFAULT 0,

        payment_method VARCHAR(50)
        NOT NULL
        DEFAULT 'cod',

        subtotal NUMERIC(10,2)
        NOT NULL
        DEFAULT 0,

        total NUMERIC(10,2)
        NOT NULL
        DEFAULT 0,

        status VARCHAR(50)
        NOT NULL
        DEFAULT 'Order Placed',

        created_at TIMESTAMP
        DEFAULT CURRENT_TIMESTAMP

      )

    `);


    await pool.query(`

      ALTER TABLE orders

      ADD COLUMN IF NOT EXISTS
      tracking_number VARCHAR(50)

    `);


    await pool.query(`

      CREATE UNIQUE INDEX IF NOT EXISTS
      orders_tracking_number_unique

      ON orders(tracking_number)

      WHERE tracking_number IS NOT NULL

    `);


    console.log(
      "Orders table ready"
    );

  } catch (error) {

    console.error(
      "Orders table error:",
      error.message
    );

    throw error;

  }

}


// =====================================================
// GENERATE TRACKING NUMBER
// =====================================================

function generateTrackingNumber() {

  const now =
    new Date();

  const year =
    now.getFullYear();

  const month =
    String(
      now.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      now.getDate()
    ).padStart(2, "0");

  const random =
    Math.floor(
      100000 +
      Math.random() * 900000
    );

  return (
    "ARZ-" +
    year +
    month +
    day +
    "-" +
    random
  );

}


// =====================================================
// PUBLIC PRODUCTS — GET ALL ACTIVE
// =====================================================

app.get(
  "/api/products",
  async (req, res) => {

    try {

      const category =
        String(
          req.query.category || ""
        ).trim();

      const search =
        String(
          req.query.search || ""
        ).trim();


      let query = `
        SELECT *
        FROM products
        WHERE COALESCE(
          is_active,
          TRUE
        ) = TRUE
      `;


      const values = [];

      let i = 1;


      if (
        category &&
        category.toLowerCase() !== "all"
      ) {

        query += `
          AND LOWER(
            COALESCE(
              category,
              ''
            )
          ) =
          LOWER($${i})
        `;

        values.push(category);

        i++;

      }


      if (search) {

        query += `
          AND (
            LOWER(
              COALESCE(
                name,
                ''
              )
            ) LIKE LOWER($${i})

            OR

            LOWER(
              COALESCE(
                description,
                ''
              )
            ) LIKE LOWER($${i})

            OR

            LOWER(
              COALESCE(
                category,
                ''
              )
            ) LIKE LOWER($${i})
          )
        `;

        values.push(
          `%${search}%`
        );

        i++;

      }


      query += `
        ORDER BY
          created_at DESC,
          id DESC
      `;


      const result =
        await pool.query(
          query,
          values
        );


      res.json({

        success: true,

        products:
          result.rows

      });

    } catch (error) {

      console.error(
        "Get products error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch products"

      });

    }

  }
);


// =====================================================
// PUBLIC PRODUCT — GET SINGLE
// =====================================================

app.get(
  "/api/products/:productId",
  async (req, res) => {

    try {

      const result =
        await pool.query(

          `
            SELECT *

            FROM products

            WHERE product_id = $1

            AND COALESCE(
              is_active,
              TRUE
            ) = TRUE

            LIMIT 1
          `,

          [
            req.params.productId
          ]

        );


      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found"

        });

      }


      res.json({

        success: true,

        product:
          result.rows[0]

      });

    } catch (error) {

      console.error(
        "Get product error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to fetch product"

      });

    }

  }
);


// =====================================================
// ADMIN — GET ALL PRODUCTS
// =====================================================

app.get(
  "/api/admin/products",
  async (req, res) => {

    try {

      const result =
        await pool.query(`

          SELECT *

          FROM products

          ORDER BY
            created_at DESC,
            id DESC

        `);


      res.json({

        success: true,

        products:
          result.rows

      });

    } catch (error) {

      console.error(
        "Admin products error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to load products"

      });

    }

  }
);


// =====================================================
// ADMIN — ADD PRODUCT
// =====================================================

app.post(
  "/api/admin/products",
  async (req, res) => {

    try {

      const {
        productId,
        name,
        description,
        category,
        price,
        oldPrice,
        image,
        rating,
        stock,
        available,
        isActive
      } = req.body;


      const cleanName =
        String(
          name || ""
        ).trim();


      const cleanCategory =
        String(
          category || ""
        ).trim();


      const numericPrice =
        Number(price);


      const numericStock =
        Number(
          stock ?? 0
        );


      if (!cleanName) {

        return res.status(400).json({

          success: false,

          message:
            "Product name is required"

        });

      }


      if (
        !Number.isFinite(
          numericPrice
        ) ||
        numericPrice < 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Valid product price is required"

        });

      }


      if (
        !Number.isFinite(
          numericStock
        ) ||
        numericStock < 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Valid product stock is required"

        });

      }


      const generatedId =

        String(
          productId || ""
        ).trim() ||

        `PRD-${Date.now()}-${Math.floor(
          Math.random() * 10000
        )}`;


      const activeValue =

        typeof available === "boolean"

          ? available

          : typeof isActive === "boolean"

            ? isActive

            : numericStock > 0;


      const result =
        await pool.query(

          `
            INSERT INTO products

            (
              product_id,
              name,
              description,
              category,
              price,
              old_price,
              image,
              rating,
              stock,
              is_active
            )

            VALUES
            (
              $1,
              $2,
              $3,
              $4,
              $5,
              $6,
              $7,
              $8,
              $9,
              $10
            )

            RETURNING *
          `,

          [

            generatedId,

            cleanName,

            String(
              description || ""
            ),

            cleanCategory,

            numericPrice,

            Number(
              oldPrice || 0
            ),

            String(
              image || ""
            ),

            Number(
              rating || 0
            ),

            Math.floor(
              numericStock
            ),

            activeValue

          ]

        );


      res.status(201).json({

        success: true,

        message:
          "Product added successfully",

        product:
          result.rows[0]

      });

    } catch (error) {

      console.error(
        "Add product error:",
        error
      );


      if (
        error.code === "23505"
      ) {

        return res.status(409).json({

          success: false,

          message:
            "Product ID already exists"

        });

      }


      res.status(500).json({

        success: false,

        message:
          "Failed to add product"

      });

    }

  }
);


// =====================================================
// ADMIN — UPDATE PRODUCT
// =====================================================

app.put(
  "/api/admin/products/:productId",
  async (req, res) => {

    try {

      const {
        name,
        description,
        category,
        price,
        oldPrice,
        image,
        rating,
        stock,
        available,
        isActive
      } = req.body;


      const activeValue =

        typeof available === "boolean"

          ? available

          : typeof isActive === "boolean"

            ? isActive

            : null;


      const result =
        await pool.query(

          `
            UPDATE products

            SET

              name =
                COALESCE(
                  $1,
                  name
                ),

              description =
                COALESCE(
                  $2,
                  description
                ),

              category =
                COALESCE(
                  $3,
                  category
                ),

              price =
                COALESCE(
                  $4,
                  price
                ),

              old_price =
                COALESCE(
                  $5,
                  old_price
                ),

              image =
                COALESCE(
                  $6,
                  image
                ),

              rating =
                COALESCE(
                  $7,
                  rating
                ),

              stock =
                COALESCE(
                  $8,
                  stock
                ),

              is_active =
                COALESCE(
                  $9,
                  is_active
                )

            WHERE product_id = $10

            RETURNING *
          `,

          [

            name !== undefined
              ? String(name).trim()
              : null,

            description !== undefined
              ? String(description)
              : null,

            category !== undefined
              ? String(category).trim()
              : null,

            price !== undefined
              ? Number(price)
              : null,

            oldPrice !== undefined
              ? Number(oldPrice)
              : null,

            image !== undefined
              ? String(image)
              : null,

            rating !== undefined
              ? Number(rating)
              : null,

            stock !== undefined
              ? Math.max(
                  0,
                  Math.floor(
                    Number(stock)
                  )
                )
              : null,

            activeValue,

            req.params.productId

          ]

        );


      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found"

        });

      }


      res.json({

        success: true,

        message:
          "Product updated successfully",

        product:
          result.rows[0]

      });

    } catch (error) {

      console.error(
        "Update product error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to update product"

      });

    }

  }
);


// =====================================================
// ADMIN — DELETE PRODUCT
// =====================================================

app.delete(
  "/api/admin/products/:productId",
  async (req, res) => {

    try {

      const result =
        await pool.query(

          `
            UPDATE products

            SET
              is_active = FALSE

            WHERE product_id = $1

            RETURNING *
          `,

          [
            req.params.productId
          ]

        );


      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Product not found"

        });

      }


      res.json({

        success: true,

        message:
          "Product deleted successfully",

        product:
          result.rows[0]

      });

    } catch (error) {

      console.error(
        "Delete product error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to delete product"

      });

    }

  }
);


// =====================================================
// CREATE ORDER
// CHECKOUT → POSTGRESQL
// =====================================================
app.post(
  "/api/orders",
  async (req, res) => {

    try {

      const {

        orderId,

        items,

        delivery,

        payment,

        customerName,

        customerEmail,

        customerPhone,

        address

      } = req.body;


      if (!orderId) {

        return res.status(400).json({

          success: false,

          message:
            "Order ID is required"

        });

      }


      if (
        !Array.isArray(items) ||
        items.length === 0
      ) {

        return res.status(400).json({

          success: false,

          message:
            "At least one product is required"

        });

      }


      if (!delivery) {

        return res.status(400).json({

          success: false,

          message:
            "Delivery information is required"

        });

      }


      if (!payment) {

        return res.status(400).json({

          success: false,

          message:
            "Payment method is required"

        });

      }


      const normalizedItems =
        items.map(
          (product) => {

            const price =
              Math.max(
                0,
                Number(
                  product.price || 0
                )
              );


            const quantity =
              Math.max(
                1,
                Math.min(
                  10,
                  Number(
                    product.quantity || 1
                  )
                )
              );


            return {

              ...product,

              price,

              quantity

            };

          }
        );


      let subtotal = 0;


      normalizedItems.forEach(
        (product) => {

          subtotal +=
            product.price *
            product.quantity;

        }
      );


      const deliveryPrice =
        Math.max(
          0,
          Number(
            delivery.price || 0
          )
        );


      const deliveryType =
        delivery.type === "express"
          ? "express"
          : "standard";


      const total =
        subtotal +
        deliveryPrice;


      const cleanCustomerName =
        String(
          customerName || ""
        ).trim();


      const cleanCustomerEmail =
        String(
          customerEmail || ""
        )
          .trim()
          .toLowerCase();


      const cleanCustomerPhone =
        String(
          customerPhone || ""
        ).trim();


      const cleanAddress =
        String(
          address || ""
        ).trim();


      const trackingNumber =
        generateTrackingNumber();


      const result =
        await pool.query(

          `
            INSERT INTO orders

            (
              order_id,
              tracking_number,
              customer_name,
              customer_email,
              customer_phone,
              address,
              items,
              delivery_type,
              delivery_price,
              payment_method,
              subtotal,
              total,
              status
            )

            VALUES
            (
              $1,
              $2,
              $3,
              $4,
              $5,
              $6,
              $7,
              $8,
              $9,
              $10,
              $11,
              $12,
              $13
            )

            RETURNING *
          `,

          [

            String(
              orderId
            ).trim(),

            trackingNumber,

            cleanCustomerName,

            cleanCustomerEmail,

            cleanCustomerPhone,

            cleanAddress,

            JSON.stringify(
              normalizedItems
            ),

            deliveryType,

            deliveryPrice,

            String(payment)
              .trim()
              .toLowerCase(),

            subtotal,

            total,

            "Order Placed"

          ]

        );


      return res.status(201).json({

        success: true,

        message:
          "Order created successfully",

        order:
          result.rows[0],

        trackingNumber:
          result.rows[0]
            .tracking_number

      });


    } catch (error) {

      console.error(
        "Create order error:",
        error
      );


      if (
        error.code === "23505"
      ) {

        return res.status(409).json({

          success: false,

          message:
            "This order or tracking number already exists"

        });

      }


      return res.status(500).json({

        success: false,

        message:
          "Failed to create order"

      });

    }

  }
);


// =====================================================
// GET ALL ORDERS
// ADMIN DASHBOARD
// =====================================================

app.get(
  "/api/orders",
  async (req, res) => {

    try {

      const result =
        await pool.query(`

          SELECT *

          FROM orders

          ORDER BY
            created_at DESC

        `);


      return res.json({

        success: true,

        orders:
          result.rows

      });


    } catch (error) {

      console.error(
        "Get orders error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch orders"

      });

    }

  }
);


// =====================================================
// GET SINGLE ORDER
// =====================================================

app.get(
  "/api/orders/:orderId",
  async (req, res) => {

    try {

      const orderId =
        String(
          req.params.orderId || ""
        ).trim();


      if (!orderId) {

        return res.status(400).json({

          success: false,

          message:
            "Order ID is required"

        });

      }


      const result =
        await pool.query(

          `
            SELECT *

            FROM orders

            WHERE order_id = $1

            LIMIT 1
          `,

          [
            orderId
          ]

        );


      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found"

        });

      }


      return res.json({

        success: true,

        order:
          result.rows[0]

      });


    } catch (error) {

      console.error(
        "Get single order error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to fetch order"

      });

    }

  }
);


// =====================================================
// GET ORDER BY TRACKING NUMBER
// CUSTOMER TRACKING
// =====================================================

app.get(
  "/api/tracking/:trackingNumber",
  async (req, res) => {

    try {

      const trackingNumber =
        String(
          req.params.trackingNumber || ""
        ).trim();


      if (!trackingNumber) {

        return res.status(400).json({

          success: false,

          message:
            "Tracking number is required"

        });

      }


      const result =
        await pool.query(

          `
            SELECT

              order_id,

              tracking_number,

              customer_name,

              customer_phone,

              address,

              items,

              delivery_type,

              delivery_price,

              payment_method,

              subtotal,

              total,

              status,

              created_at

            FROM orders

            WHERE tracking_number = $1

            LIMIT 1
          `,

          [
            trackingNumber
          ]

        );


      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Tracking number not found"

        });

      }


      return res.json({

        success: true,

        order:
          result.rows[0]

      });


    } catch (error) {

      console.error(
        "Tracking lookup error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to find tracking information"

      });

    }

  }
);


// =====================================================
// UPDATE ORDER STATUS
// ADMIN DASHBOARD
// =====================================================

app.put(
  "/api/orders/:orderId/status",
  async (req, res) => {

    try {

      const orderId =
        String(
          req.params.orderId || ""
        ).trim();


      const status =
        String(
          req.body.status || ""
        ).trim();


      if (!orderId) {

        return res.status(400).json({

          success: false,

          message:
            "Order ID is required"

        });

      }


      if (!status) {

        return res.status(400).json({

          success: false,

          message:
            "Status is required"

        });

      }


      const allowedStatuses = [

        "Order Placed",

        "Confirmed",

        "Processing",

        "Shipped",

        "Out for Delivery",

        "Delivered"

      ];


      if (
        !allowedStatuses.includes(
          status
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid order status"

        });

      }


      const result =
        await pool.query(

          `
            UPDATE orders

            SET status = $1

            WHERE order_id = $2

            RETURNING *
          `,

          [
            status,
            orderId
          ]

        );


      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found"

        });

      }


      return res.json({

        success: true,

        message:
          "Order status updated successfully",

        order:
          result.rows[0]

      });


    } catch (error) {

      console.error(
        "Update status error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to update order status"

      });

    }

  }
);


// =====================================================
// DELETE ORDER
// ADMIN DASHBOARD
// =====================================================

app.delete(
  "/api/orders/:orderId",
  async (req, res) => {

    try {

      const orderId =
        String(
          req.params.orderId || ""
        ).trim();


      if (!orderId) {

        return res.status(400).json({

          success: false,

          message:
            "Order ID is required"

        });

      }


      const result =
        await pool.query(

          `
            DELETE FROM orders

            WHERE order_id = $1

            RETURNING *
          `,

          [
            orderId
          ]

        );


      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found"

        });

      }


      return res.json({

        success: true,

        message:
          "Order deleted successfully",

        order:
          result.rows[0]

      });


    } catch (error) {

      console.error(
        "Delete order error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to delete order"

      });

    }

  }
);


// =====================================================
// ADMIN — GET ALL ORDERS
// Matches admin.html exactly
// =====================================================

app.get(
  "/api/admin/orders",
  async (req, res) => {

    try {

      const result =
        await pool.query(`

          SELECT *

          FROM orders

          ORDER BY
            created_at DESC

        `);


      res.json({

        success: true,

        orders:
          result.rows

      });

    } catch (error) {

      console.error(
        "Admin orders error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to load orders"

      });

    }

  }
);


// =====================================================
// ADMIN — GET SINGLE ORDER
// =====================================================

app.get(
  "/api/admin/orders/:orderId",
  async (req, res) => {

    try {

      const result =
        await pool.query(

          `
            SELECT *

            FROM orders

            WHERE order_id = $1

            LIMIT 1
          `,

          [
            req.params.orderId
          ]

        );


      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found"

        });

      }


      res.json({

        success: true,

        order:
          result.rows[0]

      });

    } catch (error) {

      console.error(
        "Admin order details error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to load order details"

      });

    }

  }
);


// =====================================================
// ADMIN — UPDATE ORDER STATUS
// admin.html uses PATCH
// =====================================================

app.patch(
  "/api/admin/orders/:orderId/status",
  async (req, res) => {

    try {

      const status =
        String(
          req.body.status || ""
        ).trim();


      const allowedStatuses = [

        "Order Placed",

        "Confirmed",

        "Processing",

        "Shipped",

        "Out for Delivery",

        "Delivered"

      ];


      if (
        !allowedStatuses.includes(
          status
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Invalid order status"

        });

      }


      const result =
        await pool.query(

          `
            UPDATE orders

            SET status = $1

            WHERE order_id = $2

            RETURNING *
          `,

          [
            status,
            req.params.orderId
          ]

        );


      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found"

        });

      }


      res.json({

        success: true,

        message:
          "Order status updated successfully",

        order:
          result.rows[0]

      });

    } catch (error) {

      console.error(
        "Admin status update error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to update order status"

      });

    }

  }
);


// =====================================================
// ADMIN — DELETE ORDER
// =====================================================

app.delete(
  "/api/admin/orders/:orderId",
  async (req, res) => {

    try {

      const result =
        await pool.query(

          `
            DELETE FROM orders

            WHERE order_id = $1

            RETURNING *
          `,

          [
            req.params.orderId
          ]

        );


      if (
        result.rows.length === 0
      ) {

        return res.status(404).json({

          success: false,

          message:
            "Order not found"

        });

      }


      res.json({

        success: true,

        message:
          "Order deleted successfully",

        order:
          result.rows[0]

      });

    } catch (error) {

      console.error(
        "Admin delete order error:",
        error
      );

      res.status(500).json({

        success: false,

        message:
          "Failed to delete order"

      });

    }

  }
);


// =====================================================
// ADMIN STATISTICS
// =====================================================
app.get(
  "/api/admin/stats",
  async (req, res) => {

    try {

      const totalOrdersResult =
        await pool.query(`

          SELECT
            COUNT(*) AS total

          FROM orders

        `);


      const totalSalesResult =
        await pool.query(`

          SELECT
            COALESCE(
              SUM(total),
              0
            ) AS total

          FROM orders

        `);


      const pendingOrdersResult =
        await pool.query(`

          SELECT
            COUNT(*) AS total

          FROM orders

          WHERE
            status != 'Delivered'

        `);


      const deliveredOrdersResult =
        await pool.query(`

          SELECT
            COUNT(*) AS total

          FROM orders

          WHERE
            status = 'Delivered'

        `);


      const customersResult =
        await pool.query(`

          SELECT
            COUNT(*) AS total

          FROM (

            SELECT DISTINCT

              LOWER(
                TRIM(customer_email)
              ) AS email

            FROM orders

            WHERE
              customer_email IS NOT NULL

              AND TRIM(
                customer_email
              ) != ''

          ) AS unique_customers

        `);


      const totalOrders =
        Number(
          totalOrdersResult
            .rows[0]
            .total || 0
        );


      const totalSales =
        Number(
          totalSalesResult
            .rows[0]
            .total || 0
        );


      const pendingOrders =
        Number(
          pendingOrdersResult
            .rows[0]
            .total || 0
        );


      const deliveredOrders =
        Number(
          deliveredOrdersResult
            .rows[0]
            .total || 0
        );


      const totalCustomers =
        Number(
          customersResult
            .rows[0]
            .total || 0
        );


      return res.json({

        success: true,

        totalOrders,

        totalSales,

        pendingOrders,

        deliveredOrders,

        totalCustomers

      });


    } catch (error) {

      console.error(
        "Admin stats error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to load admin statistics"

      });

    }

  }
);


// =====================================================
// ADMIN CUSTOMERS
// =====================================================

app.get(
  "/api/admin/customers",
  async (req, res) => {

    try {

      const result =
        await pool.query(`

          SELECT

            COALESCE(

              NULLIF(
                LOWER(
                  TRIM(customer_email)
                ),
                ''
              ),

              NULLIF(

                CONCAT(
                  'phone:',
                  REGEXP_REPLACE(
                    COALESCE(
                      customer_phone,
                      ''
                    ),
                    '[^0-9+]',
                    '',
                    'g'
                  )
                ),

                'phone:'

              ),

              CONCAT(
                'guest:',
                id
              )

            ) AS customer_key,


            MAX(
              NULLIF(
                TRIM(customer_name),
                ''
              )
            ) AS name,


            MAX(
              NULLIF(
                TRIM(customer_email),
                ''
              )
            ) AS email,


            MAX(
              NULLIF(
                TRIM(customer_phone),
                ''
              )
            ) AS phone,


            COUNT(*) AS order_count,


            COALESCE(
              SUM(total),
              0
            ) AS total_spent,


            MAX(
              created_at
            ) AS last_order


          FROM orders


          GROUP BY

            COALESCE(

              NULLIF(
                LOWER(
                  TRIM(customer_email)
                ),
                ''
              ),

              NULLIF(

                CONCAT(
                  'phone:',
                  REGEXP_REPLACE(
                    COALESCE(
                      customer_phone,
                      ''
                    ),
                    '[^0-9+]',
                    '',
                    'g'
                  )
                ),

                'phone:'

              ),

              CONCAT(
                'guest:',
                id
              )

            )


          ORDER BY

            MAX(created_at)
            DESC

        `);


      const customers =
        result.rows.map(
          (customer) => {

            return {

              name:
                customer.name ||
                "Guest Customer",

              email:
                customer.email ||
                "",

              phone:
                customer.phone ||
                "",

              order_count:
                Number(
                  customer.order_count ||
                  0
                ),

              total_spent:
                Number(
                  customer.total_spent ||
                  0
                ),

              last_order:
                customer.last_order ||
                null

            };

          }
        );


      return res.json({

        success: true,

        customers

      });


    } catch (error) {

      console.error(
        "Admin customers error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to load customers"

      });

    }

  }
);


// =====================================================
// ADMIN ORDER COUNTS BY STATUS
// =====================================================

app.get(
  "/api/admin/order-status",
  async (req, res) => {

    try {

      const result =
        await pool.query(`

          SELECT

            status,

            COUNT(*) AS count

          FROM orders

          GROUP BY status

          ORDER BY status

        `);


      const statuses =
        result.rows.map(
          (row) => {

            return {

              status:
                row.status,

              count:
                Number(
                  row.count || 0
                )

            };

          }
        );


      return res.json({

        success: true,

        statuses

      });


    } catch (error) {

      console.error(
        "Order status summary error:",
        error
      );


      return res.status(500).json({

        success: false,

        message:
          "Failed to load order status summary"

      });

    }

  }
);


// =====================================================
// DATABASE STARTUP TEST
// =====================================================

async function testDatabaseConnection() {

  try {

    await pool.query(
      "SELECT NOW()"
    );

    console.log(
      "PostgreSQL connected successfully"
    );

    return true;

  } catch (error) {

    console.error(
      "PostgreSQL connection error:",
      error.message
    );

    return false;

  }

}


// =====================================================
// START SERVER
// =====================================================

async function startServer() {

  try {

    if (
      typeof DB_PASSWORD !== "string" ||
      DB_PASSWORD.length === 0
    ) {

      console.error(
        "ERROR: DB_PASSWORD is missing from .env"
      );

      console.error(
        "Please check backend/.env"
      );

      process.exit(1);

    }


    const databaseConnected =
      await testDatabaseConnection();


    if (!databaseConnected) {

      console.error(
        "Server cannot start because PostgreSQL is unavailable."
      );

      process.exit(1);

    }


    await createUsersTable();

    await createProductsTable();

    await createOrdersTable();


    app.listen(
      PORT,
      () => {

        console.log("");

        console.log(
          "=========================================="
        );

        console.log(
          "       ARIZEBA SERVER RUNNING"
        );

        console.log(
          "=========================================="
        );

        console.log(
          `http://localhost:${PORT}`
        );

        console.log(
          "=========================================="
        );

        console.log("");

      }
    );


  } catch (error) {

    console.error(
      "Server startup error:",
      error
    );

    process.exit(1);

  }

}


// =====================================================
// 404 HANDLER
// =====================================================

app.use(
  (req, res) => {

    return res.status(404).json({

      success: false,

      message:
        `Cannot ${req.method} ${req.originalUrl}`

    });

  }
);


// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (error, req, res, next) => {

    console.error(
      "Unhandled server error:",
      error
    );


    if (
      res.headersSent
    ) {

      return next(error);

    }


    return res.status(500).json({

      success: false,

      message:
        "Internal server error"

    });

  }
);


// =====================================================
// START
// =====================================================

startServer();
