"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import "../../components/styles/become-provider.css";

export default function BecomeProviderPage() {
  let user: any;

  const [form, setForm] = useState({
    name: "Manda Bright",
    email: "manda@example.com",
    phone: "+265 991 234 567",
    location: "Blantyre, Malawi",
    title: "",
    availability: "",
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          user = await res.json();
          setForm({
            name: user.name || "",
            email: user.email || "",
            phone: user.phone || "",
            location: user.location || "",
            title: "",
            availability: "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUserData();
  }, []);

  /*
   * Handle normal form fields
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleImages = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    setImages((prev) => [...prev, ...selectedFiles]);

    const previews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setImagePreviews((prev) => [...prev, ...previews]);

    // Allow selecting the same file again later
    e.target.value = "";
  };
 
  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);

    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setImagePreviews((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  /*
   * Submit provider application
   */
  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const titleWords = form.title
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (titleWords.length > 5) {
      alert("Professional title must not exceed 5 words.");
      return;
    }
 
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("location", form.location);
    formData.append("title", form.title);
    formData.append("availability", form.availability);

    images.forEach((image) => {
      formData.append("images", image);
    });
 
    const response = await fetch( "/api/providers",
       {
         method: "POST",
         body: formData,
       }
     );
    response.ok && setSubmitted(true);
  };

  /*
   * Success screen
   */
  if (submitted) {
    return (
      <main className="provider-page">
        <div className="provider-success">
          <div className="success-icon">
            ✓
          </div>

          <h1>
            Application Submitted
          </h1>

          <p>
            Your service provider application has been
            submitted successfully.
          </p>

          <p className="success-note">
            We will review your information and get back to you.
          </p>

          <div className="success-actions">
            <Link
              href="/account"
              className="primary-button"
            >
              Back to Account
            </Link>

            <Link
              href="/service"
              className="secondary-button"
            >
              Browse Services
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="provider-page">
      <div className="provider-container">

        {/* =========================
            HEADER
        ========================== */}

        <div className="provider-header">
          <div>
            <Link
              href="/account"
              className="back-link"
            >
              ← Back to Account
            </Link>

            <h1>
              Become a Service Provider
            </h1>

            <p>
              Share your skills and services with people
              looking for professionals like you.
            </p>
          </div>
        </div>

        <div className="provider-layout">

          {/* =========================
              MAIN FORM
          ========================== */}

          <section className="provider-form-card">

            <form onSubmit={handleSubmit}>

              {/* =========================
                  PERSONAL INFORMATION
              ========================== */}

              <div className="form-section">

                <div className="section-heading">
                  <span className="section-number">
                    1
                  </span>

                  <div>
                    <h2>
                      Personal Information
                    </h2>

                    <p>
                      Tell us a little about yourself.
                    </p>
                  </div>
                </div>

                <div className="form-grid">

                  {/* NAME */}

                  <div className="form-group">
                    <label htmlFor="name">
                      Full Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                   

                  {/* PHONE */}

                  <div className="form-group">
                    <label htmlFor="phone">
                      Phone Number
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>

                  {/* LOCATION */}

                  <div className="form-group">
                    <label htmlFor="location">
                      Location
                    </label>

                    <input
                      id="location"
                      name="location"
                      type="text"
                      value={form.location}
                      onChange={handleChange}
                      placeholder="e.g. Angonia"
                      required
                    />
                  </div>

                </div>
              </div>

              {/* =========================
                  PROFESSIONAL INFORMATION
              ========================== */}

              <div className="form-section">

                <div className="section-heading">
                  <span className="section-number">
                    2
                  </span>

                  <div>
                    <h2>
                      Professional Information
                    </h2>

                    <p>
                      Describe what you do professionally.
                    </p>
                  </div>
                </div>

                {/* TITLE */}

                <div className="form-group">

                  <label htmlFor="title">
                    Professional Title
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={(e) => {
                      const value = e.target.value;

                      const words = value
                        .trim()
                        .split(/\s+/)
                        .filter(Boolean);

                      if (words.length <= 5) {
                        setForm((prev) => ({
                          ...prev,
                          title: value,
                        }));
                      }
                    }}
                    placeholder="e.g. Professional Plumber"
                    required
                  />

                  <span className="input-hint">
                    Maximum 5 words.
                  </span>

                </div>

                {/* AVAILABILITY */}

                <div className="form-group">

                  <label htmlFor="availability">
                    Availability
                  </label>

                  <textarea
                    id="availability"
                    name="availability"
                    value={form.availability}
                    onChange={handleChange}
                    placeholder="e.g. Monday to Friday, 8:00 AM - 5:00 PM. Available for emergency work on weekends."
                    rows={5}
                    required
                  />
                  <span className="input-hint">
                    Tell customers when you are normally
                    available.
                  </span>

                </div>

              </div>
              {/* =========================
                  WORK IMAGES
              ========================== */}

              <div className="form-section">

                <div className="section-heading">
                  <span className="section-number">
                    3
                  </span>

                  <div>
                    <h2>
                      Work Images
                    </h2>

                    <p>
                      Add photos that show your work or
                      professional experience.
                    </p>
                  </div>
                </div>
                {/* IMAGE UPLOAD */}

                <label
                  htmlFor="images"
                  className="image-upload"
                >
                  <div className="upload-icon">
                    ＋
                  </div>

                  <strong>
                    Upload images
                  </strong>

                  <span>
                    Click to select photos of your work
                  </span>

                  <small>
                    JPG, PNG or WEBP
                  </small>
                </label>

                <input
                  id="images"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={handleImages}
                  className="hidden-file-input"
                />

                {/* IMAGE PREVIEWS */}

                {imagePreviews.length > 0 && (
                  <div className="image-preview-grid">

                    {imagePreviews.map(
                      (image, index) => (
                        <div
                          className="image-preview"
                          key={`${image}-${index}`}
                        >

                          <img
                            src={image}
                            alt={`Work sample ${
                              index + 1
                            }`}
                          />

                          <button
                            type="button"
                            onClick={() =>
                              removeImage(index)
                            }
                            className="remove-image"
                            aria-label="Remove image"
                          >
                            ×
                          </button>

                        </div>
                      )
                    )}

                  </div>
                )}

              </div>

              {/* =========================
                  SUBMIT
              ========================== */}

              <div className="form-footer">

                <p>
                  By submitting this application, you
                  confirm that the information provided is
                  accurate.
                </p>

                <button
                  type="submit"
                  className="submit-provider-button"
                >
                  Submit Application
                </button>

              </div>

            </form>

          </section>

          {/* =========================
              SIDEBAR
          ========================== */}

          <aside className="provider-sidebar">

            {/* BENEFITS */}

            <div className="benefits-card">

              <h2>
                Why become a provider?
              </h2>

              <div className="benefit">

                <div className="benefit-icon">
                  👤
                </div>

                <div>
                  <h3>
                    Build Your Profile
                  </h3>

                  <p>
                    Create a professional profile that
                    customers can discover.
                  </p>
                </div>

              </div>

              <div className="benefit">

                <div className="benefit-icon">
                  📈
                </div>

                <div>
                  <h3>
                    Reach More Customers
                  </h3>

                  <p>
                    Make your skills visible to people
                    looking for professional services.
                  </p>
                </div>

              </div>

              <div className="benefit">

                <div className="benefit-icon">
                  ⭐
                </div>

                <div>
                  <h3>
                    Build Your Reputation
                  </h3>

                  <p>
                    Customers can discover your profile
                    and eventually rate your services.
                  </p>
                </div>

              </div>

            </div>

            {/* HELP */}

            <div className="provider-help-card">

              <div className="help-icon">
                ?
              </div>

              <h3>
                Need Help?
              </h3>

              <p>
                Make sure your information is accurate
                and use clear images that represent your
                work.
              </p>

            </div>

          </aside>

        </div>

      </div>
    </main>
  );
}