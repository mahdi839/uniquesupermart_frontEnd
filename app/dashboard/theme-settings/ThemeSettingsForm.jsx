"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { FaCheck, FaPalette, FaSave } from "react-icons/fa";
import { toast } from "react-toastify";
import Loading from "@/app/loading";
import { useTheme } from "@/app/components/theme/ThemeProvider";
import {
  DEFAULT_PRIMARY_COLOR,
  normalizeHex,
  PRESET_COLORS,
} from "@/lib/theme";
import "./themeSettings.css";

export default function ThemeSettingsForm() {
  const { primaryColor, setPrimaryColor } = useTheme();
  const [selectedColor, setSelectedColor] = useState(DEFAULT_PRIMARY_COLOR);
  const [savedColor, setSavedColor] = useState(DEFAULT_PRIMARY_COLOR);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const savedColorRef = useRef(savedColor);
  savedColorRef.current = savedColor;

  const token = () => (typeof window !== "undefined" ? localStorage.getItem("token") : null);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get(`${baseUrl}api/site-settings`);
        const color = normalizeHex(data?.data?.primary_color || primaryColor);
        setSelectedColor(color);
        setSavedColor(color);
        setPrimaryColor(color);
      } catch {
        const fallback = normalizeHex(primaryColor);
        setSelectedColor(fallback);
        setSavedColor(fallback);
        toast.error("Could not load the saved website color.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
    // Load once on mount.

    return () => {
      setPrimaryColor(savedColorRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl]);

  const previewColor = (color) => {
    const next = normalizeHex(color);
    setSelectedColor(next);
    setPrimaryColor(next);
  };

  const handleHexChange = (event) => {
    const value = event.target.value.trim();
    setSelectedColor(value.startsWith("#") ? value : `#${value}`);
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value.startsWith("#") ? value : `#${value}`)) {
      previewColor(value);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const color = normalizeHex(selectedColor);
    setSaving(true);

    try {
      const { data } = await axios.put(
        `${baseUrl}api/site-settings`,
        { primary_color: color },
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      const saved = normalizeHex(data?.data?.primary_color || color);
      setSelectedColor(saved);
      setSavedColor(saved);
      setPrimaryColor(saved);
      toast.success("Website color saved. The storefront now uses this color.");

      fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: ["site-settings"] }),
      }).catch(() => {});
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save website color.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Loading animation="border" /> Loading...
      </div>
    );
  }

  return (
    <div className="theme-settings-page">
      <div className="theme-settings-card">
        <div className="theme-settings-header">
          <span className="theme-settings-icon">
            <FaPalette />
          </span>
          <div>
            <h1>Website Color</h1>
            <p>Pick a brand color. Buttons, menus, links, and highlights across the whole website will follow it.</p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="theme-picker-row">
            <label className="theme-color-input-wrap">
              <span>Choose color</span>
              <input
                type="color"
                value={/^#[0-9a-fA-F]{6}$/.test(selectedColor) ? selectedColor : normalizeHex(savedColor)}
                onChange={(event) => previewColor(event.target.value)}
                aria-label="Website color picker"
              />
            </label>

            <label className="theme-hex-wrap">
              <span>Hex code</span>
              <input
                type="text"
                value={selectedColor}
                onChange={handleHexChange}
                maxLength={7}
                spellCheck={false}
              />
            </label>
          </div>

          <div className="theme-preset-grid">
            {PRESET_COLORS.map((preset) => {
              const isActive = normalizeHex(selectedColor) === normalizeHex(preset.value);
              return (
                <button
                  key={preset.value}
                  type="button"
                  className={`theme-preset-swatch ${isActive ? "active" : ""}`}
                  style={{ backgroundColor: preset.value }}
                  onClick={() => previewColor(preset.value)}
                  title={preset.label}
                  aria-label={preset.label}
                >
                  {isActive && <FaCheck />}
                </button>
              );
            })}
          </div>

          <div className="theme-preview-panel">
            <span className="theme-preview-label">Live preview</span>
            <div className="theme-preview-bar" style={{ background: selectedColor }}>
              Unique Super Mart
            </div>
            <div className="theme-preview-actions">
              <button type="button" className="btn btn-primary">Add to Cart</button>
              <button type="button" className="btn btn-outline-primary">View Details</button>
              <button type="button" className="btn-grad">Buy Now</button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary theme-save-btn"
            disabled={saving || normalizeHex(selectedColor) === normalizeHex(savedColor)}
          >
            <FaSave />
            {saving ? "Saving..." : "Save website color"}
          </button>
        </form>
      </div>
    </div>
  );
}
