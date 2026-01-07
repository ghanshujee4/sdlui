import axiosInstance from "./axiosInstance";

/**
 * Fetch ID card data (for web preview)
 */
export const fetchIdCardData = async () => {
  const res = await axiosInstance.get("/idcard/card-data");
  return res.data;
};

const downloadIdCard = async () => {
  try {
    // Axios interceptor already injects token
    const res = await axiosInstance.get(
      "/idcard/download",
      { responseType: "blob" }
    );

    // 🔐 Validate blob
    if (!res.data || res.data.size === 0) {
      alert("ID Card is empty. Please contact admin.");
      return;
    }

    const url = window.URL.createObjectURL(res.data);

    const a = document.createElement("a");
    a.href = url;
    a.download = "SDL_ID_CARD.pdf";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

  } catch (err) {
    if (err.response?.status === 403) {
      alert("ID Card not available. Please complete payment or activate account.");
      return;
    }

    if (err.response?.status === 401) {
      // handled by interceptor → no duplicate redirect
      return;
    }

    console.error("ID Card download error:", err);
    alert("Failed to download ID Card");
  }
};

export { downloadIdCard };
