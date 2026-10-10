
"use client";

import { useState } from "react";
import "../../components/styles/addService.css";

export default function AddServicePage() {
  // =========================
  // STEP 1
  // =========================

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [fee, setFee] = useState("");

  // ID returned after POST
  const [serviceId, setServiceId] = useState<string | null>(null);

  // =========================
  // STEP 2
  // =========================

  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  const [conditions, setConditions] = useState<string[]>([]);
  const [conditionInput, setConditionInput] = useState("");

  // =========================
  // STATUS
  // =========================

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [completed, setCompleted] = useState(false);

  // =========================
  // STEP 1
  // CREATE SERVICE
  // =========================

  async function createService(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          price: Number(fee),
        }),
      });

      if (!response.ok) {
        const dt = await response.json();

        throw new Error(
          dt.error || "Failed to create service"
        );
      }

      const data = await response.json();

      const id = data?.data?.id;

      if (!id) {
        throw new Error(
          "Service was created but no service ID was returned"
        );
      }

      setServiceId(id);

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  }

  // =========================
  // CONDITIONS
  // =========================

  function addCondition() {
    const value = conditionInput.trim();

    if (!value) {
      return;
    }

    setConditions((current) => [
      ...current,
      value,
    ]);

    setConditionInput("");
  }

  function removeCondition(index: number) {
    setConditions((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  // =========================
  // STEP 2
  // UPDATE SERVICE
  // =========================

  async function updateService(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!serviceId) {
      return;
    }

    // =========================
    // REQUIRE IMAGE + VIDEO
    // =========================

    if (!image) {
      setError("Please select a service image.");
      return;
    }

    if (!video) {
      setError("Please select a service video.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      // =========================
      // IMAGE
      // =========================

      formData.append(
        "image",
        image
      );

      // =========================
      // VIDEO
      // =========================

      formData.append(
        "video",
        video
      );

      // =========================
      // CONDITIONS
      // =========================

      for (const c of conditions) {
        formData.append(
          "conditions",
          c
        );
      }

      // =========================
      // SERVICE ID
      // =========================

      formData.append(
        "serviceId",
        serviceId
      );

      const response = await fetch(
        "/api/services",
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to update service"
        );
      }

      console.log(
        "Service completed:",
        data
      );

      setCompleted(true);

    } catch (error) {

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  }

  // =========================
  // JSX
  // =========================

  return (
    <main className="add-service-page">

      <div className="form-container">

        {/* HEADER */}

        <div className="page-header">

          <h1>
            Add Service
          </h1>

          <p>
            Create a service and provide
            additional details.
          </p>

        </div>


        {/* PROGRESS */}

        <div className="progress">

          <div
            className={`progress-step ${
              !serviceId
                ? "active"
                : "completed"
            }`}
          >

            <span>
              {serviceId
                ? "✓"
                : "1"}
            </span>

            <p>
              Basic Information
            </p>

          </div>


          <div className="progress-line" />


          <div
            className={`progress-step ${
              serviceId
                ? "active"
                : ""
            }`}
          >

            <span>
              2
            </span>

            <p>
              Media & Conditions
            </p>

          </div>

        </div>


        {/* ERROR */}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}


        {/* =================================
            STEP 1
        ================================= */}

        {!serviceId && (

          <form
            onSubmit={createService}
          >

            {/* NAME */}

            <div className="form-group">

              <label htmlFor="name">
                Service Name
                <span>*</span>
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="e.g. Website Development"
                required
              />

            </div>


            {/* DESCRIPTION */}

            <div className="form-group">

              <label htmlFor="description">
                Description
                <span>*</span>
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Describe what this service includes..."
                rows={7}
                required
              />

            </div>


            {/* PRICE */}

            <div className="form-group">

              <label htmlFor="fee">
                Service Price
                <span>*</span>
              </label>

              <input
                id="fee"
                type="number"
                min="0"
                step="0.01"
                value={fee}
                onChange={(e) =>
                  setFee(e.target.value)
                }
                placeholder="e.g. 50000"
                required
              />

            </div>


            {/* SUBMIT */}

            <div className="form-actions">

              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading
                  ? "Creating..."
                  : "Create Service"}
              </button>

            </div>

          </form>

        )}


        {/* =================================
            STEP 2
        ================================= */}

        {serviceId && (

          <form
            onSubmit={updateService}
          >

            {/* =================================
                SERVICE IMAGE
            ================================= */}

            <div className="form-group">

              <label>
                Service Image
                <span>*</span>
              </label>

              <div className="media-upload">

                <input
                  type="file"
                  id="service-image"
                  accept="image/*"
                  required={!image}
                  onChange={(e) => {

                    const file =
                      e.target.files?.[0] ??
                      null;

                    setImage(file);
                    setError("");

                  }}
                />

                <label
                  htmlFor="service-image"
                  className="media-upload-label"
                >

                  <div className="upload-icon">
                    +
                  </div>

                  <strong>
                    {image
                      ? image.name
                      : "Upload Service Image"}
                  </strong>

                  <span>
                    Click to choose an image
                  </span>

                  <small>
                    PNG, JPG, JPEG or WEBP
                  </small>

                </label>

              </div>

            </div>


            {/* =================================
                SERVICE VIDEO
            ================================= */}

            <div className="form-group">

              <label>
                Service Video
                <span>*</span>
              </label>

              <div className="media-upload">

                <input
                  type="file"
                  id="service-video"
                  accept="video/*"
                  required={!video}
                  onChange={(e) => {

                    const file =
                      e.target.files?.[0] ??
                      null;

                    setVideo(file);
                    setError("");

                  }}
                />

                <label
                  htmlFor="service-video"
                  className="media-upload-label"
                >

                  <div className="upload-icon">
                    +
                  </div>

                  <strong>
                    {video
                      ? video.name
                      : "Upload Service Video"}
                  </strong>

                  <span>
                    Click to choose a video
                  </span>

                  <small>
                    MP4, WebM or MOV
                  </small>

                </label>

              </div>

            </div>


            {/* =================================
                CONDITIONS
            ================================= */}

            <div className="form-group">

              <div className="conditions-header">

                <div>

                  <label>
                    Conditions
                  </label>

                  <small>
                    Add any requirements or
                    conditions customers should
                    know about.
                  </small>

                </div>

              </div>


              {/* ADD CONDITION */}

              <div className="condition-input-wrapper">

                <input
                  type="text"
                  value={conditionInput}
                  placeholder="Enter a service condition..."
                  onChange={(e) =>
                    setConditionInput(
                      e.target.value
                    )
                  }
                  onKeyDown={(e) => {

                    if (e.key === "Enter") {

                      e.preventDefault();

                      addCondition();

                    }

                  }}
                />


                <button
                  type="button"
                  className="add-condition-button"
                  onClick={addCondition}
                >
                  + Add
                </button>

              </div>


              {/* CONDITIONS LIST */}

              {conditions.length > 0 && (

                <div className="saved-conditions">

                  <div className="saved-conditions-title">

                    <span>
                      Added Conditions
                    </span>

                    <span className="condition-count">
                      {conditions.length}
                    </span>

                  </div>


                  <div className="conditions-list">

                    {conditions.map(
                      (
                        condition,
                        index
                      ) => (

                        <div
                          className="saved-condition"
                          key={index}
                        >

                          <div className="condition-check">
                            ✓
                          </div>


                          <span className="saved-condition-text">
                            {condition}
                          </span>


                          <button
                            type="button"
                            className="remove-condition"
                            onClick={() =>
                              removeCondition(index)
                            }
                            aria-label={`Remove condition ${
                              index + 1
                            }`}
                          >
                            ×
                          </button>

                        </div>

                      )
                    )}

                  </div>

                </div>

              )}

            </div>


            {/* SAVE */}

            {!completed && (

              <div className="form-actions">

                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading
                    ? "Saving..."
                    : "Save Service"}
                </button>

              </div>

            )}


            {/* COMPLETED */}

            {completed && (

              <div className="service-completed">

                <span className="completed-mark">
                  ✓
                </span>

                <span>
                  Service completed successfully
                </span>

              </div>

            )}

          </form>

        )}

      </div>

    </main>
  );
}
Response
