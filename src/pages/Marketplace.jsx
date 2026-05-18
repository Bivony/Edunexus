import axios from "axios";
import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useAuth
} from "../../auth/AuthSystem";

const API =
  "https://bivonys.alwaysdata.net/api";

const Marketplace = () => {

  const { user } = useAuth();

  /* =====================================================
     ROLE CHECK
  ===================================================== */

  const role =
    user?.role
      ?.toLowerCase()
      ?.trim();

  const isAdmin =
    role === "admin";

  const canBuy =
    role === "student" ||
    role === "teacher" ||
    role === "parent";

  /* =====================================================
     STATES
  ===================================================== */

  const [products, setProducts] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  const [uploadData, setUploadData] =
    useState({
      name: "",
      description: "",
      price: ""
    });

  const [image, setImage] =
    useState(null);

  /* =====================================================
     LOAD DATA
  ===================================================== */

  useEffect(() => {

    fetchProducts();

    fetchOrders();

  }, []);

  /* =====================================================
     FETCH PRODUCTS
  ===================================================== */

  const fetchProducts =
    async () => {

      try {

        const response =
          await axios.get(
            `${API}/products`
          );

        console.log(
          "PRODUCTS:",
          response.data
        );

        setProducts(
          response.data.data || []
        );

      } catch (err) {

        console.log(err);

      }
    };

  /* =====================================================
     FETCH ORDERS
  ===================================================== */

  const fetchOrders =
    async () => {

      try {

        const response =
          await axios.get(
            `${API}/orders`
          );

        setOrders(
          response.data.data || []
        );

      } catch (err) {

        console.log(err);

      }
    };

  /* =====================================================
     SEARCH PRODUCTS
  ===================================================== */

  const filteredProducts =
    useMemo(() => {

      return products.filter(
        (product) =>
          product.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    }, [products, search]);

  /* =====================================================
     ADD PRODUCT
  ===================================================== */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      setLoading(
        "Uploading product..."
      );

      setSuccess("");

      setError("");

      try {

        const formData =
          new FormData();

        formData.append(
          "name",
          uploadData.name
        );

        formData.append(
          "description",
          uploadData.description
        );

        formData.append(
          "price",
          uploadData.price
        );

        formData.append(
          "image",
          image
        );

        const response =
          await axios.post(
            `${API}/products`,
            formData,
            {
              headers: {
                "Content-Type":
                  "multipart/form-data"
              }
            }
          );

        setLoading("");

        setSuccess(
          response.data.message
        );

        setUploadData({
          name: "",
          description: "",
          price: ""
        });

        setImage(null);

        fetchProducts();

      } catch (err) {

        console.log(err);

        setLoading("");

        setError(
          "Failed to upload product"
        );
      }
    };

  /* =====================================================
     DELETE PRODUCT
  ===================================================== */

  const deleteProduct =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this product?"
        );

      if (!confirmDelete)
        return;

      try {

        await axios.delete(
          `${API}/products/${id}`
        );

        fetchProducts();

      } catch (err) {

        console.log(err);
      }
    };

  /* =====================================================
     BUY PRODUCT
  ===================================================== */

  const buyNow =
    async (product) => {

      const quantity =
        prompt(
          "Enter quantity"
        );

      if (!quantity) return;

      try {

        const response =
          await axios.post(
            `${API}/orders`,
            {
              product_id:
                product.id,

              buyer_id:
                user?.id,

              quantity:
                quantity
            }
          );

        alert(
          `Order placed successfully. Total: KES ${response.data.data.total}`
        );

        fetchOrders();

      } catch (err) {

        console.log(err);

        alert(
          "Checkout failed"
        );
      }
    };

  /* =====================================================
     UPDATE ORDER
  ===================================================== */

  const updateOrder =
    async (
      id,
      status
    ) => {

      try {

        await axios.put(
          `${API}/orders/${id}`,
          {
            order_status:
              status
          }
        );

        fetchOrders();

      } catch (err) {

        console.log(err);
      }
    };

  /* =====================================================
     UI
  ===================================================== */

  return (

    <div className="module-page">

      {/* =====================================================
         HEADER
      ===================================================== */}

      <div className="page-header">

        <div>

          <h1>
            bivonys Marketplace
          </h1>

          <p>
            Buy school books,
            uniforms, stationery
            and learning materials
          </p>

        </div>

      </div>

      {/* =====================================================
         SEARCH
      ===================================================== */}

      <input
        type="text"
        placeholder="Search products..."
        className="form-control"
        value={search}
        onChange={(e) =>
          setSearch(
            e.target.value
          )
        }
      />

      <br />

      {/* =====================================================
         ADMIN PRODUCT FORM
      ===================================================== */}

      {isAdmin && (

        <div className="card shadow p-4 mb-4">

          <h2>
            Upload Product
          </h2>

          <br />

          <h4 className="text-primary">
            {loading}
          </h4>

          <h4 className="text-success">
            {success}
          </h4>

          <h4 className="text-danger">
            {error}
          </h4>

          <form
            onSubmit={handleSubmit}
          >

            <input
              type="text"
              placeholder="Product Name"
              className="form-control"
              value={uploadData.name}
              onChange={(e) =>
                setUploadData({
                  ...uploadData,
                  name:
                    e.target.value
                })
              }
              required
            />

            <br />

            <textarea
              placeholder="Description"
              className="form-control"
              value={
                uploadData.description
              }
              onChange={(e) =>
                setUploadData({
                  ...uploadData,
                  description:
                    e.target.value
                })
              }
              required
            />

            <br />

            <input
              type="number"
              placeholder="Price"
              className="form-control"
              value={uploadData.price}
              onChange={(e) =>
                setUploadData({
                  ...uploadData,
                  price:
                    e.target.value
                })
              }
              required
            />

            <br />

            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) =>
                setImage(
                  e.target.files[0]
                )
              }
              required
            />

            <br />

            <button
              type="submit"
              className="btn btn-primary w-100"
            >
              Upload Product
            </button>

          </form>

        </div>

      )}

      {/* =====================================================
         PRODUCTS
      ===================================================== */}

      {filteredProducts.length ===
      0 ? (

        <div className="empty-state">

          <h2>
            No products found
          </h2>

        </div>

      ) : (

        <div className="market-grid">

          {filteredProducts.map(
            (product) => (

              <div
                className="market-card"
                key={product.id}
              >

                <img
                  src={`https://bivonys.alwaysdata.net/uploads/${product.image}`}
                  alt={product.name}
                  className="market-image"
                />

                <div className="card-body">

                  <h3>
                    {product.name}
                  </h3>

                  <p>
                    {
                      product.description
                    }
                  </p>

                  <h2>
                    KES {product.price}
                  </h2>

                  <div className="card-actions">

                    {canBuy && (

                      <button
                        className="primary-btn"
                        onClick={() =>
                          buyNow(
                            product
                          )
                        }
                      >
                        Buy Now
                      </button>

                    )}

                    {isAdmin && (

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteProduct(
                            product.id
                          )
                        }
                      >
                        Delete
                      </button>

                    )}

                  </div>

                </div>

              </div>

            )
          )}

        </div>

      )}

      {/* =====================================================
         ORDERS
      ===================================================== */}

      {isAdmin && (

        <div className="table-container mt-5">

          <h2>
            Marketplace Orders
          </h2>

          <table>

            <thead>

              <tr>

                <th>ID</th>
                <th>Product ID</th>
                <th>Buyer ID</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {orders.map(
                (order) => (

                  <tr
                    key={order.id}
                  >

                    <td>
                      {order.id}
                    </td>

                    <td>
                      {
                        order.product_id
                      }
                    </td>

                    <td>
                      {
                        order.buyer_id
                      }
                    </td>

                    <td>
                      {
                        order.quantity
                      }
                    </td>

                    <td>
                      KES{" "}
                      {
                        order.total_price
                      }
                    </td>

                    <td>
                      {
                        order.order_status
                      }
                    </td>

                    <td>

                      <button
                        className="primary-btn"
                        onClick={() =>
                          updateOrder(
                            order.id,
                            "Approved"
                          )
                        }
                      >
                        Approve
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          updateOrder(
                            order.id,
                            "Rejected"
                          )
                        }
                      >
                        Reject
                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
};

export default Marketplace;