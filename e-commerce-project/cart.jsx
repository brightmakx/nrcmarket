import { useState } from "react";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";

const INITIAL_ITEMS = [
  {
    id: 1,
    name: "Waxed Canvas Tote",
    variant: "Olive",
    price: 58,
    qty: 1,
    swatch: "#5B6B4F",
  },
  {
    id: 2,
    name: "Stoneware Mug",
    variant: "Ash",
    price: 22,
    qty: 2,
    swatch: "#B7B2A6",
  },
  {
    id: 3,
    name: "Linen Napkin Set",
    variant: "Natural / 4-pack",
    price: 34,
    qty: 1,
    swatch: "#D8CFBE",
  },
];

const money = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function Cart() {
  const [items, setItems] = useState(INITIAL_ITEMS);

  const setQty = (id, delta) =>
    setItems((prev) =>
      prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, it.qty + delta) } : it
      )
    );

  const removeItem = (id) =>
    setItems((prev) => prev.filter((it) => it.id !== id));

  const subtotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
  const shipping = items.length === 0 ? 0 : subtotal >= 75 ? 0 : 6;
  const tax = subtotal * 0.0825;
  const total = subtotal + shipping + tax;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F7F7F4",
        color: "#1F2421",
        fontFamily:
          "'Segoe UI', system-ui, -apple-system, sans-serif",
        padding: "0",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        .cart-display {
          font-family: Georgia, 'Iowan Old Style', 'Times New Roman', serif;
        }
        .qty-btn {
          width: 28px; height: 28px;
          display: flex; align-items: center; justify-content: center;
          background: transparent; border: 1px solid #1F2421;
          border-radius: 50%; cursor: pointer; color: #1F2421;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .qty-btn:hover { background: #1F2421; color: #F7F7F4; }
        .qty-btn:focus-visible, .remove-btn:focus-visible, .checkout-btn:focus-visible {
          outline: 2px solid #3D5A45; outline-offset: 2px;
        }
        .remove-btn {
          background: none; border: none; cursor: pointer; color: #8A857A;
          padding: 4px; transition: color 0.15s ease;
        }
        .remove-btn:hover { color: #B3401D; }
        .checkout-btn {
          width: 100%; border: none; border-radius: 4px;
          background: #3D5A45; color: #F7F7F4;
          padding: 14px 0; font-size: 15px; letter-spacing: 0.03em;
          cursor: pointer; transition: background 0.15s ease;
        }
        .checkout-btn:hover { background: #2E4636; }
        .receipt-rule {
          border: none;
          border-top: 1px dashed #C9C4B6;
          margin: 16px 0;
        }
        @media (max-width: 760px) {
          .cart-grid { grid-template-columns: 1fr !important; }
          .summary-col { order: 2; }
        }
      `}</style>

      <header
        style={{
          padding: "28px 24px 20px",
          borderBottom: "1px solid #E4E0D4",
          maxWidth: 1040,
          margin: "0 auto",
        }}
      >
        <div
          className="cart-display"
          style={{ fontSize: 26, display: "flex", alignItems: "center", gap: 10 }}
        >
          <ShoppingBag size={22} strokeWidth={1.5} />
          Your cart
        </div>
        <div style={{ fontSize: 13, color: "#6B665A", marginTop: 4 }}>
          {items.length} {items.length === 1 ? "item" : "items"}
        </div>
      </header>

      <main
        className="cart-grid"
        style={{
          maxWidth: 1040,
          margin: "0 auto",
          padding: "32px 24px 80px",
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 48,
          alignItems: "start",
        }}
      >
        {/* Item list */}
        <section>
          {items.length === 0 ? (
            <div
              style={{
                padding: "60px 0",
                textAlign: "center",
                color: "#6B665A",
              }}
            >
              <ShoppingBag size={32} strokeWidth={1.2} style={{ marginBottom: 12 }} />
              <p className="cart-display" style={{ fontSize: 18, margin: 0 }}>
                Your cart is empty
              </p>
              <p style={{ fontSize: 13, marginTop: 6 }}>
                Items you add will show up here.
              </p>
            </div>
          ) : (
            items.map((it, idx) => (
              <div key={it.id}>
                <div
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: "20px 0",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 6,
                      background: it.swatch,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      className="cart-display"
                      style={{ fontSize: 17, marginBottom: 2 }}
                    >
                      {it.name}
                    </div>
                    <div style={{ fontSize: 13, color: "#6B665A" }}>
                      {it.variant}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <button
                      className="qty-btn"
                      aria-label={`Decrease quantity of ${it.name}`}
                      onClick={() => setQty(it.id, -1)}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontSize: 14, width: 18, textAlign: "center" }}>
                      {it.qty}
                    </span>
                    <button
                      className="qty-btn"
                      aria-label={`Increase quantity of ${it.name}`}
                      onClick={() => setQty(it.id, 1)}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div
                    style={{
                      width: 70,
                      textAlign: "right",
                      fontSize: 15,
                    }}
                  >
                    {money(it.price * it.qty)}
                  </div>

                  <button
                    className="remove-btn"
                    aria-label={`Remove ${it.name} from cart`}
                    onClick={() => removeItem(it.id)}
                  >
                    <X size={16} />
                  </button>
                </div>
                {idx < items.length - 1 && (
                  <hr style={{ border: "none", borderTop: "1px solid #E4E0D4" }} />
                )}
              </div>
            ))
          )}
        </section>

        {/* Summary */}
        <aside
          className="summary-col"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E4E0D4",
            borderRadius: 8,
            padding: 24,
            position: "sticky",
            top: 24,
          }}
        >
          <div
            className="cart-display"
            style={{ fontSize: 16, marginBottom: 16 }}
          >
            Order summary
          </div>

          <Row label="Subtotal" value={money(subtotal)} />
          <Row
            label="Shipping"
            value={shipping === 0 ? "Free" : money(shipping)}
          />
          <Row label="Tax" value={money(tax)} />

          <hr className="receipt-rule" />

          <Row label="Total" value={money(total)} bold />

          {subtotal > 0 && subtotal < 75 && (
            <p style={{ fontSize: 12, color: "#6B665A", marginTop: 10 }}>
              Add {money(75 - subtotal)} more for free shipping.
            </p>
          )}

          <button
            className="checkout-btn"
            style={{ marginTop: 20 }}
            disabled={items.length === 0}
          >
            Checkout
          </button>
        </aside>
      </main>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: bold ? 16 : 14,
        fontWeight: bold ? 600 : 400,
        padding: "5px 0",
        color: bold ? "#1F2421" : "#4A463C",
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
