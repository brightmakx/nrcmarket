
import "./profile.css"

export default function ProfilePage() {
  return (
    <main className="profile-page">

      <div className="profile-container">

        {/* Profile Header */}
        <div className="profile-header">

          <div className="profile-avatar">
            <svg
              width="70"
              height="70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
          </div>

          <div>
            <h1>My Profile</h1>
            <p>Manage your personal information</p>
          </div>

        </div>


        {/* Personal Information */}
        <section className="profile-card">

          <div className="card-title">
            <h2>Personal Information</h2>

            <button className="edit-button">
              Edit Profile
            </button>
          </div>

          <div className="profile-info">

            <div className="info-item">
              <span className="info-label">Full Name</span>
              <span className="info-value">Customer Name</span>
            </div>

            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">
                customer@example.com
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Phone Number</span>
              <span className="info-value">
                +265 XXX XXX XXX
              </span>
            </div>

            <div className="info-item">
              <span className="info-label">Address</span>
              <span className="info-value">
                Lilongwe, Malawi
              </span>
            </div>

          </div>

        </section>


        {/* Account Actions */}
        <section className="profile-card">

          <h2>My Account</h2>

          <div className="account-links">

            <a href="/orders" className="account-link">
              <span className="account-icon">📦</span>

              <div>
                <strong>My Orders</strong>
                <small>View your previous orders</small>
              </div>

              <span className="arrow">›</span>
            </a>


            <a href="/cart" className="account-link">
              <span className="account-icon">🛒</span>

              <div>
                <strong>Shopping Cart</strong>
                <small>View items in your cart</small>
              </div>

              <span className="arrow">›</span>
            </a>


            <a href="#" className="account-link">
              <span className="account-icon">🔒</span>

              <div>
                <strong>Security</strong>
                <small>Change your password and security settings</small>
              </div>

              <span className="arrow">›</span>
            </a>

          </div>

        </section>

      </div>

    </main>
  )
}

