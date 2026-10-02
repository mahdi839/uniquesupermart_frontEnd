"use client";
import React, { useEffect, useState } from "react";
import { FaTrash, FaPlus, FaMinus, FaHeart } from "react-icons/fa";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { increament, decreament, removeCart } from "@/redux/slices/CartSlice";
import style from './cart.module.css'
import Image from "next/image";

function CartPage() {

  let cartItems = useSelector((state => state.cart.items))
  let getTotalPrice = cartItems.reduce((total, item) => total + item.totalPrice, 0)
  let dispatch = useDispatch()
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Wait until client hydration finishes so server & client HTML match
    setMounted(true);
  }, []);

  // Keyed by lineId so two variants of the same product stay independent.
  function handleIncreament(lineId) {
    dispatch(increament({ lineId }))
  }

  function handleDecreament(lineId) {
    dispatch(decreament({ lineId }))
  }

  function handleRemove(lineId) {
    dispatch(removeCart({ lineId }))
  }

  // function handleCheckout (e){
  //   e.preventDefault()
  //   window.location.href = "/checkout"
  // }

  // Avoid rendering mismatched HTML before mount
  if (!mounted) {
    return (
      <div className="container py-5">
        <div className="border py-3 px-5 mb-2">
          <h5 className="mb-0">
            Items in Your Cart: <span className="text-danger">( 0 )</span>
          </h5>
        </div>
        {/* simple placeholder skeleton */}
        <div className="border p-4">Loading your cart…</div>
      </div>
    );
  }


  return (
    <div >

      <section className="h-100 ">
        <div className="container py-5">
          <div className="row d-flex justify-content-center my-4">
            <div className="col-md-8">

              <div className="border py-3 px-5 mb-2">
                <h5 className="mb-0">Items in Your Cart: <span className="text-danger">( {cartItems.length} )</span> </h5>
              </div>

              {
                cartItems.length === 0 ? (
                  <div className="container py-5 text-center border">
                    <div className="empty-cart-container" style={{
                      maxWidth: '500px',
                      margin: '0 auto',
                      padding: '40px 20px',
                      borderRadius: '10px',
                      boxShadow: '0 0 15px rgba(0,0,0,0.1)',
                      backgroundColor: '#fff'
                    }}>
                      <h3 style={{
                        color: '#dc3545',
                        marginBottom: '20px',
                        fontWeight: '600'
                      }}>
                        Your Cart Is Empty
                      </h3>
                      <p style={{
                        color: '#6c757d',
                        marginBottom: '25px',
                        fontSize: '1.1rem'
                      }}>
                        Looks like you haven't added anything to your cart yet
                      </p>
                      <Link
                        href="/"
                        className="btn btn-primary"
                        style={{
                          padding: '10px 25px',
                          borderRadius: '5px',
                          fontWeight: '500',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
                          outline: 'none',
                          border: 'none'
                        }}
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                ) :
                  cartItems?.map((item) => (
                    <div className="row align-items-center border mb-2 py-3 mx-0 px-0" key={item.lineId ?? item.id}>
                      {/* Product Image - Circular */}
                      <div className="col-md-1 col-2 pe-0">
                        <div className="position-relative">
                          <Image
                            src={item.image}
                            alt={item.title}
                            width={60}
                            height={60}
                            className="rounded-circle"
                            style={{
                              objectFit: "cover",
                              border: "1px solid #f0f0f0",
                            }}
                          />
                        </div>
                      </div>

                      {/* Product Info - Compact */}
                      <div className="col-md-4 col-5">
                        <Link href={`/frontEnd/product-page/${item.id}`}>
                          <h6 className="mb-1 fw-bold text-truncate">

                            {item.title}

                          </h6>
                        </Link>
                        <div className="d-flex flex-column gap-2 small">
                          {(item.size_label || item.color_name) && (
                            <span className="text-muted">
                              {item.color_name && (
                                <span className="text-dark fw-medium">{item.color_name}</span>
                              )}
                              {item.color_name && item.size_label && " / "}
                              {item.size_label && (
                                <span className="text-dark fw-medium">{item.size_label}</span>
                              )}
                            </span>
                          )}
                          <span
                            className={`border-0 ${style.cursor}`}
                            onClick={() => handleRemove(item.lineId)}
                            title="Remove"
                          >
                            <FaTrash className="text-danger" />
                          </span>

                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="col-md-3 col-5">
                        <div className="d-flex align-items-center justify-content-center">
                          <button
                            className=" px-2 py-1 border-0"
                            onClick={() => handleDecreament(item.lineId)}
                            disabled={item.qty <= 1}
                            style={{ opacity: item.qty <= 1 ? 0.5 : 1 }}
                          >
                            <FaMinus />
                          </button>

                          <span className="mx-3" style={{ minWidth: '30px', textAlign: 'center' }}>
                            {item.qty}
                          </span>

                          <button
                            className="px-2 py-1 border-0"
                            onClick={() => handleIncreament(item.lineId)}
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="col-md-4 col-12 mt-md-0 mt-2">
                        <div className="d-flex align-items-center justify-content-center ">
                          <h6 className="mb-0 fw-bold">{item.totalPrice} TK</h6>

                        </div>
                      </div>
                    </div>
                  ))}

            </div>



            <div class="col-md-4">
              <div class={`border  mb-4 ${style.summery_main}`}>
                <div className={`${style.summery_bg}`}></div>
                <div class=" py-3 border-bottom">
                  <h5 class="mb-0 text-center">Summary</h5>
                </div>
                <div class="card-body">
                  <ul class="list-group list-group-flush">
                    <li
                      class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                      Products
                      <span>{getTotalPrice} TK</span>
                    </li>
                    <li class="list-group-item d-flex justify-content-between align-items-center px-0">
                      Shipping
                      <span>Gratis</span>
                    </li>
                    <li
                      class="list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                      <div>
                        <strong>Total amount</strong>
                      </div>
                      <span><strong>{getTotalPrice}TK</strong></span>
                    </li>
                  </ul>

                  <Link href='/frontEnd/checkout' >
                    <button disabled={cartItems.length === 0} type="button" className="btn-lg btn-block btn-light border-0">Checkout</button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}

export default CartPage;