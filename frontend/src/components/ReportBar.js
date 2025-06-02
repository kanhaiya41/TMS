import React from "react";

const ReportBar = ({ reportData, fetchData, setSearchTerm }) => {
    // Format values based on key and value type
    const formatValue = (key, val) => {
        if ((key === "department" || key === "comments") && Array.isArray(val)) {
            return val
                .map((obj) => {
                    return Object.entries(obj)
                        .map(([k, v]) => {
                            if (Array.isArray(v)) {
                                return `${k}: [${v.join(", ")}]`;
                            } else {
                                return `${k}: ${v}`;
                            }
                        })
                        .join("\n");
                })
                .join("\n---\n"); // Separate objects by ---
        } else if (Array.isArray(val)) {
            // For other arrays (if any), join items with comma
            return val.join(", ");
        } else if (typeof val === "object" && val !== null) {
            // For other objects, stringify but remove outer braces
            const str = JSON.stringify(val, null, 2);
            return str.slice(1, -1).trim();
        } else {
            return val;
        }
    };

    // Convert data to CSV string (flatten nested objects as JSON strings)
    const convertToCSV = (data) => {
    if (!data.length) return "";

    // Collect all unique keys from all objects to ensure no missing headers
    const allKeys = Array.from(
        new Set(data.flatMap(obj => Object.keys(obj)))
    );

    const headers = allKeys.join(",");

    const rows = data.map(row =>
        allKeys.map(key => {
            const val = row[key];

            // Handle nested objects/arrays properly
            if (key === "department" || key === "comments" || key === "file") {
                return `"${JSON.stringify(val || "").replace(/"/g, '""')}"`;
            }

            if (typeof val === "object" && val !== null) {
                return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
            }

            return `"${val !== undefined ? val : ""}"`;
        }).join(",")
    );

    return [headers, ...rows].join("\n");
};


    // Download helper function
    const downloadFile = (content, fileName, type) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Export handlers
    const exportCSV = () => {
        const csv = convertToCSV(reportData);
        downloadFile(csv, "report.csv", "text/csv");
    };

    const exportJSON = () => {
        const json = JSON.stringify(reportData, null, 2);
        downloadFile(json, "report.json", "application/json");
    };

const exportPDF = async () => {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    const title = "Report";
    doc.text(title, 10, 10);

    // Collect all unique headers across all rows
    const allHeaders = Array.from(new Set(reportData.flatMap(row => Object.keys(row))));
    let y = 20;

    reportData.forEach((row) => {
        const lines = allHeaders.map((h) => {
            const val = row[h];

            if (h === "department") {
                // Format department array of objects nicely with line breaks
                if (Array.isArray(val)) {
                    return val
                        .map((obj, i) => {
                            const objText = Object.entries(obj)
                                .map(([k, v]) => {
                                    if (Array.isArray(v)) {
                                        return `${k}: [${v.join(", ")}]`;
                                    } else {
                                        return `${k}: ${v}`;
                                    }
                                })
                                .join("\n");
                            return objText + (i < val.length - 1 ? "\n---" : "");
                        })
                        .join("\n");
                }
                return "";
            } 
            else if (h === "comments") {
                if (Array.isArray(val)) {
                    return val
                        .map(comment => {
                            const createdAtFormatted = comment.createdAt
                                ? new Date(comment.createdAt).toLocaleString()
                                : "";
                            return `Content: ${comment.content || ""}\nCommenter: ${comment.commenter || ""}\nCreated At: ${createdAtFormatted}`;
                        })
                        .join("\n---\n");
                }
                return "";
            }
            else if (h === "file") {
                // file is a string, just print it
                return val || "";
            }
            else if (typeof val === "object" && val !== null) {
                return JSON.stringify(val);
            } 
            else {
                return val || "";
            }
        });

        const text = allHeaders
            .map((h, i) => `${h}: ${lines[i]}`)
            .join("\n\n");

        const splitText = doc.splitTextToSize(text, 180);
        doc.text(splitText, 10, y);
        y += splitText.length * 7 + 10;

        if (y > 280) {
            doc.addPage();
            y = 10;
        }
    });

    doc.save("report.pdf");
};



    return (
        <div
            className="report-bar"
            style={{
                padding: "10px",
                border: "1px solid #ccc",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
            }}
        >
            <div className="left-buttons" style={{ display: "flex", gap: "10px" }}>
                <button onClick={fetchData} className="green-btn" style={{ padding: "8px 16px" }}>
                    🔄 Refresh
                </button>
                <button
                    onClick={() => setSearchTerm()}
                    className="blue-btn"
                    style={{ padding: "8px 16px" }}
                >
                    ❌ Clear Filters
                </button>
            </div>

            <div className="right-buttons" style={{ display: "flex", gap: "10px" }}>
                <button
                    onClick={exportCSV}
                    className="blue-btn"
                    style={{ padding: "8px 16px" }}
                >
                    📄 Export to CSV
                </button>
                <button
                    onClick={exportJSON}
                    className="blue-btn"
                    style={{ padding: "8px 16px" }}
                >
                    📘 Export to JSON
                </button>
                <button
                    onClick={exportPDF}
                    className="blue-btn"
                    style={{ padding: "8px 16px" }}
                >
                    📕 Export to PDF
                </button>
            </div>
        </div>
    );
};

export default ReportBar;
