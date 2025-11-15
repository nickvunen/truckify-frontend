import React, { useState, useEffect } from "react";
import { getCampers, createCamper, updateCamper, deleteCamper, getAttributes, createAttribute, deleteAttribute } from "../utils/api";
import { Camper, Attribute } from "../utils/types";
import { useLanguage } from "../utils/LanguageContext";

const TrucksPage: React.FC = () => {
  const { t } = useLanguage();
  const [campers, setCampers] = useState<Camper[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showAttributeModal, setShowAttributeModal] = useState(false);
  const [editingCamper, setEditingCamper] = useState<Camper | null>(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    license_plate: "",
    price_per_day: 50,
    color: "#3B82F6",
    description: "",
    facilities: [] as string[],
    images: [] as string[],
    max_passengers: 2,
    year: new Date().getFullYear(),
  });

  const [attributeForm, setAttributeForm] = useState({
    name: "",
    description: "",
    price: 0,
  });

  const [newFacility, setNewFacility] = useState("");
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [campersData, attributesData] = await Promise.all([
        getCampers(),
        getAttributes(),
      ]);
      setCampers(campersData);
      setAttributes(attributesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (camper?: Camper) => {
    if (camper) {
      setEditingCamper(camper);
      setFormData({
        name: camper.name,
        license_plate: camper.license_plate || "",
        price_per_day: camper.price_per_day,
        color: camper.color,
        description: camper.description || "",
        facilities: camper.facilities || [],
        images: camper.images || [],
        max_passengers: camper.max_passengers,
        year: camper.year || new Date().getFullYear(),
      });
    } else {
      setEditingCamper(null);
      setFormData({
        name: "",
        license_plate: "",
        price_per_day: 50,
        color: "#3B82F6",
        description: "",
        facilities: [],
        images: [],
        max_passengers: 2,
        year: new Date().getFullYear(),
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCamper(null);
    setNewFacility("");
    setNewImage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Form submitted with data:", formData);
    
    // Validate price
    if (!formData.price_per_day || formData.price_per_day <= 0) {
      alert("Please enter a valid price per day");
      return;
    }
    
    try {
      console.log("Sending request to API...");
      if (editingCamper) {
        const result = await updateCamper(editingCamper.id, formData);
        console.log("Update result:", result);
      } else {
        const result = await createCamper(formData);
        console.log("Create result:", result);
      }
      await loadData();
      closeModal();
      alert("Truck saved successfully!");
    } catch (error: any) {
      console.error("Error saving truck:", error);
      alert(`Failed to save truck: ${error.message || 'Unknown error'}. Check console for details.`);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this truck?")) {
      try {
        await deleteCamper(id);
        await loadData();
      } catch (error: any) {
        console.error("Error deleting truck:", error);
        alert(`Failed to delete truck: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const addFacility = () => {
    if (newFacility.trim()) {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, newFacility.trim()],
      });
      setNewFacility("");
    }
  };

  const removeFacility = (index: number) => {
    setFormData({
      ...formData,
      facilities: formData.facilities.filter((_, i) => i !== index),
    });
  };

  const addImage = () => {
    if (newImage.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, newImage.trim()],
      });
      setNewImage("");
    }
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleAddAttribute = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAttribute(attributeForm);
      await loadData();
      setShowAttributeModal(false);
      setAttributeForm({ name: "", description: "", price: 0 });
    } catch (error) {
      console.error("Error adding attribute:", error);
    }
  };

  const handleDeleteAttribute = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this add-on?")) {
      try {
        await deleteAttribute(id);
        await loadData();
      } catch (error) {
        console.error("Error deleting attribute:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{t("trucks")}</h1>
          </div>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>{t("addCamper")}</span>
          </button>
        </div>
      </div>

      {/* Camper Grid */}
      {campers.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-600 mb-4">
            {t("noCampersYet")}
          </h3>
          <button
            onClick={() => openModal()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Add Your First Truck
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campers.map((camper) => (
            <div
              key={camper.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              {/* Camper Image */}
              <div
                className="h-48 bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center"
                style={{
                  backgroundColor: camper.color,
                  backgroundImage:
                    camper.images && camper.images[0]
                      ? `url(${camper.images[0]})`
                      : undefined,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {(!camper.images || camper.images.length === 0) && (
                  <svg
                    className="w-20 h-20 text-white opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                    />
                  </svg>
                )}
              </div>

              {/* Camper Details */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    {camper.name}
                  </h3>
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: camper.color }}
                  />
                </div>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {camper.description || "No description"}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price per day:</span>
                    <span className="font-semibold text-gray-800">
                      €{camper.price_per_day}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Max passengers:</span>
                    <span className="font-semibold text-gray-800">
                      {camper.max_passengers}
                    </span>
                  </div>
                  {camper.year && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Year:</span>
                      <span className="font-semibold text-gray-800">
                        {camper.year}
                      </span>
                    </div>
                  )}
                </div>

                {camper.facilities && camper.facilities.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {camper.facilities.slice(0, 3).map((facility, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                        >
                          {facility}
                        </span>
                      ))}
                      {camper.facilities.length > 3 && (
                        <span className="text-blue-600 text-xs px-2 py-1">
                          +{camper.facilities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex space-x-2">
                  <button
                    onClick={() => openModal(camper)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                  >
                    {t("edit")}
                  </button>
                  <button
                    onClick={() => handleDelete(camper.id)}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add-ons Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{t("addOns")}</h2>
          </div>
          <button
            onClick={() => setShowAttributeModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md flex items-center space-x-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>{t("add")} Add-on</span>
          </button>
        </div>

        {attributes.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No add-ons yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {attributes.map((attribute) => (
              <div
                key={attribute.id}
                className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition hover:border-blue-300"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-800 text-lg flex-1">
                    {attribute.name}
                  </h3>
                  <button
                    onClick={() => handleDeleteAttribute(attribute.id)}
                    className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
                {attribute.description && (
                  <p className="text-sm text-gray-600 mb-3">
                    {attribute.description}
                  </p>
                )}
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    €{attribute.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-blue-700">per day</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Camper Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingCamper ? t("editCamper") : t("addNewCamper")}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("camperName")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="VW California Ocean"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("licensePlate")}
                  </label>
                  <input
                    type="text"
                    value={formData.license_plate}
                    onChange={(e) =>
                      setFormData({ ...formData, license_plate: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="ABC-123"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("pricePerDay")} (€) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0.01"
                    step="0.01"
                    value={formData.price_per_day}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price_per_day: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("maxPassengers")} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.max_passengers}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_passengers: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("year")}
                  </label>
                  <input
                    type="number"
                    min="1900"
                    max={new Date().getFullYear() + 1}
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        year: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("calendarColor")} *
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="h-10 w-20 border border-gray-300 rounded cursor-pointer"
                  />
                  <span className="text-sm text-gray-600">
                    This color will be used in the calendar view
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("description")}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe your truck..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("facilities")}
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={newFacility}
                    onChange={(e) => setNewFacility(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFacility())}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Kitchen, Shower, Bed"
                  />
                  <button
                    type="button"
                    onClick={addFacility}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    {t("add")}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.facilities.map((facility, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center space-x-2"
                    >
                      <span>{facility}</span>
                      <button
                        type="button"
                        onClick={() => removeFacility(idx)}
                        className="text-blue-700 hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("images")} (URLs)
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="url"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg"
                  />
                  <button
                    type="button"
                    onClick={addImage}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    {t("add")}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {formData.images.map((image, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${idx}`}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  {editingCamper ? "Update Truck" : t("addCamper")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Attribute Modal */}
      {showAttributeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {t("add")} Add-on
                </h2>
                <button
                  onClick={() => setShowAttributeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleAddAttribute} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={attributeForm.name}
                  onChange={(e) =>
                    setAttributeForm({ ...attributeForm, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Porta-Potty, Bike Rack"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("description")}
                </label>
                <textarea
                  value={attributeForm.description}
                  onChange={(e) =>
                    setAttributeForm({
                      ...attributeForm,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional description"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("pricePerDay")} (€) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={attributeForm.price}
                  onChange={(e) =>
                    setAttributeForm({
                      ...attributeForm,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAttributeModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  {t("add")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrucksPage;
