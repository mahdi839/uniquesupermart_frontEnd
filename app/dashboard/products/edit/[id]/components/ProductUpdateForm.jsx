"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CreateCategory from "./updateFormComponents/CreateCategory";
import CreateSize from "./updateFormComponents/CreateSize";
import './productEdit.css';
import SizesPricing from "./updateFormComponents/SizesPricing";
import ProductImages from "./updateFormComponents/ProductImages";
import Categories from "./updateFormComponents/Categories";
import Faq from "./updateFormComponents/Faq";
import Specifications from "./updateFormComponents/Specifications";
import SubmitButtonDiv from "./updateFormComponents/SubmitButtonDiv";
import Colors from "./updateFormComponents/Colors";
import BasicInfo from "./updateFormComponents/BasicInfo";
import { useRouter } from "next/navigation";
import { asProductArray } from "../../../components/productData";

export default function ProductUpdateForm({
  isEditMode = false,
  initialData = null,
  categoryData = [],
  productId = null,
}) {
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    video_url: "",
    description: "",
    discount: "",
    status: "in-stock",
    price: "",
    sku: "",
    images: [],
    colors: [],
    sizes: [],
    faqs: [],
    categories: [],
    specifications: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sidebar states
  const [newSize, setNewSize] = useState("");
  const [newCategory, setNewCategory] = useState({
    name: "",
    home_category: "0",
    priority: 0,
  });
  const [loadingSidebar, setLoadingSidebar] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    specifications: false,
    colors: false,
    sizes: false,
    images: false,
    categories: false,
    faqs: false
  });

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // ✅ FIX: Only fetch sizes here — NOT categories.
  // Categories come from the `categoryData` prop (admin endpoint).
  // Fetching from api/frontend/categories was overwriting the admin list
  // with a different/filtered dataset, causing missing categories.
  useEffect(() => {
    fetchSizes();
  }, []);

  useEffect(() => {
    const handler = (e) => setExistingImages(e.detail);
    window.addEventListener("update-existing-images", handler);
    return () => window.removeEventListener("update-existing-images", handler);
  }, []);

  // ✅ FIX: Normalize categoryData on arrival — handles both raw array
  // and { data: [...] } shaped responses from getData()
  useEffect(() => {
    const normalized = asProductArray(categoryData);
    setCategories(normalized);
  }, [categoryData]);

  useEffect(() => {
    if (isEditMode && initialData) {
      const parsedColors = asProductArray(initialData.colors);

      const transformedColors = parsedColors
        .filter((color) => color && typeof color === "object")
        .map(color => ({
        id: color.id,
        code: color.code || "#000000",
        name: color.name || "",
        image: null,
        existing_image: color.image || null
      }));

      const transformedData = {
        title: initialData.title || "",
        short_description: initialData.short_description || "",
        video_url: initialData.video_url || "",
        description: initialData.description || "",
        discount: initialData.discount || "",
        status: initialData.status || "in-stock",
        price: initialData.price || "",
        sku: initialData.sku || "",
        images: [],
        colors: transformedColors,
        sizes: asProductArray(initialData.sizes).filter(Boolean).map(size => ({
          id: size.pivot?.id,
          size_id: size.id,
          price: size.pivot?.price || "",
          stock: size.pivot?.stock || 0
        })),
        faqs: asProductArray(initialData.faqs).filter(Boolean).map(faq => ({
          id: faq.id,
          question: faq.question || "",
          answer: faq.answer || ""
        })),
        // ✅ FIX: Normalize category_id to String so react-select matching
        // never fails due to number vs string type mismatch
        categories: asProductArray(initialData.category).filter((cat) => cat?.id != null).map(cat => ({
          category_id: String(cat.id)
        })),
        specifications: asProductArray(initialData.specifications).filter(Boolean).map(spec => ({
          id: spec.id,
          key: spec.key || "",
          value: spec.value || ""
        })),
      };

      setFormData(transformedData);
      setExistingImages(asProductArray(initialData.images));
    }
  }, [isEditMode, initialData]);

  // ✅ Only fetch sizes from the client side
  const fetchSizes = async () => {
    try {
      const sizeRes = await axios.get(`${baseUrl}api/sizes`);
      setSizes(asProductArray(sizeRes.data));
    } catch (e) {
      toast.error(e.message);
    }
  };

  // Create new size
  const handleCreateSize = async (e) => {
    e.preventDefault();
    if (!newSize.trim()) {
      toast.error("Size name is required");
      return;
    }

    setLoadingSidebar(true);
    let token = null;
    if (typeof window !== "undefined") token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `${baseUrl}api/sizes`,
        { size: newSize },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSizes([res.data, ...sizes]);
      setNewSize("");
      toast.success("Size created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create size");
    } finally {
      setLoadingSidebar(false);
    }
  };

  // Create new category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setLoadingSidebar(true);
    let token = null;
    if (typeof window !== "undefined") token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `${baseUrl}api/categories`,
        newCategory,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // ✅ Prepend newly created category to the list immediately
      setCategories(prev => [res.data, ...prev]);
      setNewCategory({ name: "", home_category: "0", priority: 0 });
      toast.success("Category created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
    } finally {
      setLoadingSidebar(false);
    }
  };

  const handleColorChange = (index, field, value) => {
    const next = [...formData.colors];
    next[index] = { ...next[index], [field]: value };
    setFormData((s) => ({ ...s, colors: next }));
  };

  const handleSizeChange = (index, field, value) => {
    const next = [...formData.sizes];
    next[index] = { ...next[index], [field]: value };
    setFormData((s) => ({ ...s, sizes: next }));
  };

  const selectedSizeIds = formData.sizes
    .map((item) => item.size_id)
    .filter((id) => id !== "" && id !== null);

  const handleFAQChange = (index, field, value) => {
    const next = [...formData.faqs];
    next[index] = { ...next[index], [field]: value };
    setFormData((s) => ({ ...s, faqs: next }));
  };

  const handleSpecificationChange = (index, field, value) => {
    const next = [...formData.specifications];
    next[index] = { ...next[index], [field]: value };
    setFormData((s) => ({ ...s, specifications: next }));
  };

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((s) => ({ ...s, images: [...s.images, ...files] }));
    }
  };

  const handleColorImageUpload = (index, e) => {
    if (e.target.files && e.target.files[0]) {
      handleColorChange(index, "image", e.target.files[0]);
    }
  };

  const handleDeleteExistingImage = (imageId) => {
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleDeleteColorImage = (index) => {
    handleColorChange(index, "image", null);
    handleColorChange(index, "existing_image", null);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("short_description", formData.short_description);
    data.append("video_url", formData.video_url || "");
    data.append("description", formData.description || "");
    data.append("discount", formData.discount || "");
    data.append("status", formData.status);

    if (formData.price) data.append("price", formData.price);
    if (formData.sku) data.append("sku", formData.sku);

    if (isEditMode && existingImages.length > 0) {
      existingImages.forEach((img, index) => {
        data.append(`image_order[${index}][id]`, img.id);
        data.append(`image_order[${index}][position]`, index);
      });
    }

    if (isEditMode) data.append("_method", "PUT");

    formData.colors.forEach((color, i) => {
      data.append(`colors[${i}][code]`, color.code || "#000000");
      if (color.name) data.append(`colors[${i}][name]`, color.name);
      if (color.id && Number.isInteger(Number(color.id))) {
        data.append(`colors[${i}][id]`, color.id);
      }
      if (color.image) data.append(`colors[${i}][image]`, color.image);
      else if (color.existing_image) data.append(`colors[${i}][existing_image]`, color.existing_image);
    });

    formData.sizes.forEach((size, i) => {
      if (size.size_id) {
        data.append(`sizes[${i}][size_id]`, size.size_id);
        data.append(`sizes[${i}][price]`, size.price || "");
        data.append(`sizes[${i}][stock]`, size.stock || 0);
      }
    });

    formData.images.forEach((image) => data.append("image[]", image));

    if (isEditMode) {
      const initialImageIds = asProductArray(initialData?.images).map(img => img.id);
      const currentImageIds = existingImages.map(img => img.id);
      const deletedImages = initialImageIds.filter(id => !currentImageIds.includes(id));
      deletedImages.forEach(imgId => data.append("deleted_images[]", imgId));
    }

    // ✅ category_id was normalized to String, backend receives it correctly
    formData.categories.forEach((category, i) => {
      data.append(`categories[${i}][category_id]`, category.category_id);
    });

    const validFAQs = formData.faqs.filter(
      (f) => f.question?.trim() !== "" && f.answer?.trim() !== ""
    );
    validFAQs.forEach((faq, i) => {
      data.append(`faqs[${i}][question]`, faq.question);
      data.append(`faqs[${i}][answer]`, faq.answer);
    });

    const validSpecs = formData.specifications.filter(
      (s) => s.key?.trim() !== "" && s.value?.trim() !== ""
    );
    validSpecs.forEach((spec, i) => {
      data.append(`specifications[${i}][key]`, spec.key);
      data.append(`specifications[${i}][value]`, spec.value);
    });

    let token = null;
    if (typeof window !== "undefined") token = localStorage.getItem("token");

    try {
      const url = isEditMode
        ? `${baseUrl}api/products/${productId}`
        : `${baseUrl}api/products`;

      await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (!isEditMode) {
        setFormData({
          title: "",
          short_description: "",
          video_url: "",
          description: "",
          discount: "",
          status: "in-stock",
          price: "",
          sku: "",
          images: [],
          colors: [],
          sizes: [],
          faqs: [],
          categories: [],
          specifications: [],
        });
      }

      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tags: ["products"] }),
      });

      toast.success(`Product ${isEditMode ? 'Updated' : 'Created'} Successfully`);
      router.push('/dashboard/products');
    } catch (error) {
      console.error("Error:", error.response?.data);
      toast.error(error.response?.data?.message || "An Error Occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="d-flex align-items-center mb-4">
            <h3 className="mb-0 fw-bold text-gray-800">
              {isEditMode ? 'Edit Product' : 'Create New Product'}
            </h3>
          </div>

          <form onSubmit={handleSubmit} className="product-form">
            <BasicInfo
              toggleSection={toggleSection}
              formData={formData}
              setFormData={setFormData}
              expandedSections={expandedSections}
            />
            <Specifications
              toggleSection={toggleSection}
              expandedSections={expandedSections}
              formData={formData}
              handleSpecificationChange={handleSpecificationChange}
              setFormData={setFormData}
            />
            <Colors
              toggleSection={toggleSection}
              formData={formData}
              expandedSections={expandedSections}
              setFormData={setFormData}
              handleColorChange={handleColorChange}
              handleColorImageUpload={handleColorImageUpload}
              baseUrl={baseUrl}
              handleDeleteColorImage={handleDeleteColorImage}
            />
            <SizesPricing
              toggleSection={toggleSection}
              expandedSections={expandedSections}
              formData={formData}
              sizes={sizes}
              handleSizeChange={handleSizeChange}
              setFormData={setFormData}
              selectedSizeIds={selectedSizeIds}
            />
            <ProductImages
              handleDeleteExistingImage={handleDeleteExistingImage}
              toggleSection={toggleSection}
              existingImages={existingImages}
              isEditMode={isEditMode}
              handleImageUpload={handleImageUpload}
              formData={formData}
              setFormData={setFormData}
              expandedSections={expandedSections}
              baseUrl={baseUrl}
            />
            <Categories
              toggleSection={toggleSection}
              expandedSections={expandedSections}
              formData={formData}
              setFormData={setFormData}
              categories={categories}
            />
            <Faq
              toggleSection={toggleSection}
              expandedSections={expandedSections}
              formData={formData}
              handleFAQChange={handleFAQChange}
              setFormData={setFormData}
            />
            <SubmitButtonDiv
              isEditMode={isEditMode}
              isSubmitting={isSubmitting}
            />
          </form>
        </div>

        <div className="col-lg-4">
          <CreateSize
            sizes={sizes}
            handleCreateSize={handleCreateSize}
            newSize={newSize}
            loadingSidebar={loadingSidebar}
            setNewSize={setNewSize}
          />
          <CreateCategory
            setNewCategory={setNewCategory}
            newCategory={newCategory}
            loadingSidebar={loadingSidebar}
            categories={categories}
            handleCreateCategory={handleCreateCategory}
          />
        </div>
      </div>

      <style jsx>{`
        .border-dashed { border: 2px dashed #dee2e6; }
        .cursor-pointer { cursor: pointer; }
        .focus-border-primary:focus {
          border-color: #4e73df;
          box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
        }
        .border-gray-300 { border-color: #d1d3e2 !important; }
      `}</style>
    </div>
  );
}
