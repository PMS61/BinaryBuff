/**
 * Utility functions for YouTube video processing
 */

// Extract YouTube video ID from various URL formats
export const extractYoutubeVideoId = (url) => {
  // Support both youtube.com and youtu.be URLs
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Validate if a URL is a valid YouTube video URL
export const isValidYoutubeUrl = (url) => {
  if (!url) return false;
  
  // Check if URL is from youtube.com or youtu.be
  const youtubeRegExp = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  if (!youtubeRegExp.test(url)) return false;
  
  // Check if we can extract a valid video ID
  return !!extractYoutubeVideoId(url);
};

// Convert a YouTube video URL to an embed URL
export const getYoutubeEmbedUrl = (url) => {
  const videoId = extractYoutubeVideoId(url);
  if (!videoId) return null;
  
  return `https://www.youtube.com/embed/${videoId}`;
};

// Get YouTube thumbnail URL from video ID
export const getYoutubeThumbnailUrl = (videoId, quality = 'hq') => {
  if (!videoId) return null;
  
  // Quality options: default, hq, mq, sd
  switch (quality) {
    case 'max':
      return `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    case 'hq':
      return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    case 'mq':
      return `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
    case 'sd':
      return `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`;
    default:
      return `https://i.ytimg.com/vi/${videoId}/default.jpg`;
  }
};

// This function would fetch video metadata from YouTube API
// In a real implementation, you would need a YouTube API key
export const fetchYoutubeVideoData = async (videoId) => {
  // In a real implementation, this would be an API call to YouTube Data API v3
  // Example: https://developers.google.com/youtube/v3/getting-started
  
  // For now, we'll return mock data
  return {
    id: videoId,
    title: `YouTube Video (ID: ${videoId})`,
    description: "Video description would appear here",
    duration: "Unknown", // In a real API, this would be in ISO 8601 format
    thumbnailUrl: getYoutubeThumbnailUrl(videoId, 'hq'),
    publishedAt: new Date().toISOString()
  };
};

// In a real app, you would implement functions to:
// 1. Download YouTube videos (backend only, with proper API key and legal compliance)
// 2. Extract segments from YouTube videos
// 3. Convert YouTube timestamps to seconds
