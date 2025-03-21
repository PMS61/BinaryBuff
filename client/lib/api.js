const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Generic function to make API requests to the FastAPI backend
 */
async function apiRequest(endpoint, method = "GET", data = null, token = null) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
    // Change to 'same-origin' for production, 'include' for development
    credentials: "include",
    mode: 'cors',
  };

  if (data && method !== "GET") {
    config.body = JSON.stringify(data);
  }

  console.log(`Making ${method} request to ${API_URL}${endpoint}`);
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || `API Error: ${response.status}`;
      } catch (e) {
        errorMessage = `API Error: ${response.status} - ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    
    return response.json();
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    
    // Check if it's a network error (Failed to fetch)
    if (error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to the server. Please make sure the backend server is running.');
    }
    
    throw error;
  }
}

// Auth endpoints
export const authApi = {
  login: (email, password) => {
    return apiRequest("/auth/login", "POST", { email, password });
  },
  
  register: (email, password) => {
    return apiRequest("/auth/register", "POST", { email, password });
  },
  
  googleAuth: (idToken) => {
    return apiRequest("/auth/google", "POST", { id_token: idToken });
  },
  
  logout: (token) => {
    return apiRequest("/auth/logout", "POST", {}, token);
  },
  
  getUser: (token) => {
    return apiRequest("/auth/me", "GET", null, token);
  }
};

// Video processing endpoints
export const videosApi = {
  uploadVideo: (formData, token, onProgress) => {
    return new Promise(async (resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress && onProgress(percentComplete);
        }
      });
      
      // Handle response
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (e) {
            reject(new Error("Invalid response from server"));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };
      
      // Handle errors
      xhr.onerror = function() {
        reject(new Error("Network error occurred during upload"));
      };
      
      // Open connection and send
      xhr.open("POST", `${API_URL}/videos/upload`, true);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send(formData);
    });
  },
  
  getVideos: (token) => {
    return apiRequest("/videos", "GET", null, token);
  },
  
  getShorts: (videoId, token) => {
    return apiRequest(`/shorts/list/${videoId}`, "GET", null, token);
  },
  
  generateShorts: (videoId, count = 3, token) => {
    return apiRequest(`/shorts/generate-timestamps`, "POST", { 
      video_id: videoId,
      count: count
    }, token);
  },
  
  saveShort: (shortData, token) => {
    return apiRequest(`/shorts/save-short`, "POST", {
      video_id: shortData.videoId,
      start_time: shortData.startTime,
      end_time: shortData.endTime,
      title: shortData.title,
      description: shortData.description
    }, token);
  }
};
