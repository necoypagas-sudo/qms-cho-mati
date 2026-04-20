// src/utils/indexedDB.js
// IndexedDB storage for large files like videos

const DB_NAME = "cho_qms_db";
const DB_VERSION = 1;
const STORE_NAME = "campaign_videos";

// Initialize IndexedDB
export const initIndexedDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
  });
};

// Store video in IndexedDB
export const storeVideo = async (videoId, videoData) => {
  try {
    const db = await initIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put({ id: videoId, data: videoData, timestamp: Date.now() });

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(videoId);
    });
  } catch (error) {
    console.error("Error storing video in IndexedDB:", error);
    throw error;
  }
};

// Retrieve video from IndexedDB
export const getVideo = async (videoId) => {
  try {
    const db = await initIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(videoId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result?.data || null);
    });
  } catch (error) {
    console.error("Error retrieving video from IndexedDB:", error);
    return null;
  }
};

// Delete video from IndexedDB
export const deleteVideo = async (videoId) => {
  try {
    const db = await initIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(videoId);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.error("Error deleting video from IndexedDB:", error);
  }
};

// Clear all videos
export const clearAllVideos = async () => {
  try {
    const db = await initIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  } catch (error) {
    console.error("Error clearing videos from IndexedDB:", error);
  }
};
