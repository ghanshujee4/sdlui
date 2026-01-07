import { useState, useEffect } from "react";

const Tabs = () => {
  const tabs = ["Meeting", "Chat", "Files"];


  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "Meeting";
  });


  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

  return (
    <div style={{ width: "500px", margin: "40px auto", fontFamily: "Arial" }}>
  
      <div style={{ display: "flex", borderBottom: "2px solid #ddd" }}>
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "12px 20px",
              cursor: "pointer",
              borderBottom:
                activeTab === tab ? "4px solid #1976d2" : "4px solid transparent",
              fontWeight: activeTab === tab ? "bold" : "normal",
              color: activeTab === tab ? "#1976d2" : "#555",
            }}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: "20px", background: "#f9f9f9" }}>
        {activeTab === "Meeting" && (
          <p>📅 This is the Meeting content</p>
        )}

        {activeTab === "Chat" && (
          <p>💬 This is the Chat content</p>
        )}

        {activeTab === "Files" && (
          <p>📁 This is the Files content</p>
        )}
      </div>
    </div>
  );
};

export default Tabs;
