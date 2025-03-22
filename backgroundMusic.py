from googleapiclient.discovery import build

# Set up YouTube API key
API_KEY = "AIzaSyATALMM2RO1cniAtP6W4dUY98DAwh-SBzw"
YOUTUBE_API_SERVICE_NAME = "youtube"
YOUTUBE_API_VERSION = "v3"

def fetch_music_by_theme(theme):
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=API_KEY)

    # Search query: Fetch top 5 results based on mood
    request = youtube.search().list(
        part="snippet",
        q=f"{theme} background music",
        type="video",
        maxResults=5
    )
    
    response = request.execute()

    # Extract relevant details
    music_videos = []
    for item in response["items"]:
        video_id = item["id"]["videoId"]
        title = item["snippet"]["title"]
        music_videos.append({"title": title, "url": f"https://www.youtube.com/watch?v={video_id}"})

    return music_videos

# Example Usage
theme = "Sad"
music_list = fetch_music_by_theme(theme)
for music in music_list:
    print(f"🎵 {music['title']} - {music['url']}")
