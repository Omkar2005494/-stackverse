

export function loadProgress() {
  try {
    const savedData = localStorage.getItem("stackverse-save");

    return savedData
      ? JSON.parse(savedData)
      : null;
  } catch (error) {
    console.error("Failed to load progress:", error);
    return null;
  }
}

export function saveProgress(data) {
  try {
    localStorage.setItem(
      "stackverse-save",
      JSON.stringify(data)
    );
  } catch (error) {
    console.error("Failed to save progress:", error);
  }
}