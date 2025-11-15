import React, { useState, useEffect } from "react";
import { getSettings, updateSettings, uploadFile } from "../utils/api";
import { Settings } from "../utils/types";
import { useLanguage } from "../utils/LanguageContext";
import { languageNames, Language } from "../utils/translations";

const SettingsPage: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [formData, setFormData] = useState({
    charge_type: "per_day" as "per_day" | "per_night",
    auto_accept_bookings: true,
    business_name: "",
    business_email: "",
    business_phone: "",
    company_color: "#3B82F6",
    company_logo: "",
    language: "en" as Language,
    booking_page_language: "en" as Language,
    minimum_booking_days: 1,
    maximum_booking_days: 365,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const settingsData = await getSettings();
      setSettings(settingsData);
      setFormData({
        charge_type: settingsData.charge_type,
        auto_accept_bookings: settingsData.auto_accept_bookings,
        business_name: settingsData.business_name,
        business_email: settingsData.business_email || "",
        business_phone: settingsData.business_phone || "",
        company_color: settingsData.company_color,
        company_logo: settingsData.company_logo || "",
        language: settingsData.language,
        booking_page_language: settingsData.booking_page_language,
        minimum_booking_days: settingsData.minimum_booking_days,
        maximum_booking_days: settingsData.maximum_booking_days,
      });
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB");
      return;
    }

    setUploadingLogo(true);
    try {
      const result = await uploadFile(file);
      setFormData({ ...formData, company_logo: `http://localhost:8000${result.url}` });
    } catch (error) {
      console.error("Error uploading logo:", error);
      alert("Failed to upload logo");
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(formData);
      setLanguage(formData.language);
      await loadData();
      alert(t("settingsSaved"));
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings");
    } finally {
      setSaving(false);
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
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800">{t("settings")}</h1>
      </div>

      {/* Booking Link */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-4">{t("bookingLink")}</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            value={`${window.location.origin}/book`}
            readOnly
            className="flex-1 bg-white text-gray-800 px-4 py-2 rounded-lg"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(`${window.location.origin}/book`);
              alert("Link copied to clipboard!");
            }}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Main Settings Card */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <form onSubmit={handleSaveSettings} className="space-y-8">
          {/* Business & Branding Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
              Business & Branding
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("businessName")}
                </label>
                <input
                  type="text"
                  value={formData.business_name}
                  onChange={(e) =>
                    setFormData({ ...formData, business_name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Truckify"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("businessEmail")}
                </label>
                <input
                  type="email"
                  value={formData.business_email}
                  onChange={(e) =>
                    setFormData({ ...formData, business_email: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="info@truckify.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t("businessPhone")}
                </label>
                <input
                  type="tel"
                  value={formData.business_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, business_phone: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+31 6 12345678"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dashboard Language
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => {
                    const newLang = e.target.value as Language;
                    setFormData({ ...formData, language: newLang });
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(languageNames).map(([code, name]) => (
                    <option key={code} value={code}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Logo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    disabled={uploadingLogo}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {uploadingLogo ? "Uploading..." : "Max 2MB. Appears on booking page."}
                  </p>
                  {formData.company_logo && (
                    <div className="mt-2">
                      <img
                        src={formData.company_logo}
                        alt="Logo Preview"
                        className="h-12 w-auto border border-gray-200 rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, company_logo: "" })}
                        className="text-xs text-red-600 hover:text-red-800 mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("companyColor")}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={formData.company_color}
                      onChange={(e) =>
                        setFormData({ ...formData, company_color: e.target.value })
                      }
                      className="h-10 w-16 border-2 border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.company_color}
                      onChange={(e) =>
                        setFormData({ ...formData, company_color: e.target.value })
                      }
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Settings Section */}
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
              {t("bookingSettings")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Booking Page Default Language
                  </label>
                  <select
                    value={formData.booking_page_language}
                    onChange={(e) => {
                      const newLang = e.target.value as Language;
                      setFormData({ ...formData, booking_page_language: newLang });
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {Object.entries(languageNames).map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Customers can switch on booking page
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("minimumBookingDays")}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.minimum_booking_days}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        minimum_booking_days: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("maximumBookingDays")}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maximum_booking_days}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maximum_booking_days: parseInt(e.target.value),
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {t("chargeType")}
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        value="per_day"
                        checked={formData.charge_type === "per_day"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            charge_type: e.target.value as any,
                          })
                        }
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-700">{t("perDay")}</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        value="per_night"
                        checked={formData.charge_type === "per_night"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            charge_type: e.target.value as any,
                          })
                        }
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="text-gray-700">{t("perNight")}</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.auto_accept_bookings}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          auto_accept_bookings: e.target.checked,
                        })
                      }
                      className="w-5 h-5 text-blue-600 rounded"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      {t("autoAcceptBookings")}
                    </span>
                  </label>
                  <p className="text-xs text-gray-500 mt-1 ml-7">
                    {formData.auto_accept_bookings
                      ? "Bookings auto-confirmed"
                      : "Manual confirmation required"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving || uploadingLogo}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? t("loading") + "..." : t("saveSettings")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
