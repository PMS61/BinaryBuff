import cv2
import os
import numpy as np

# Function to calculate sharpness using Laplacian variance
def calculate_sharpness(frame):
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)  # Convert to grayscale
    return cv2.Laplacian(gray, cv2.CV_64F).var()  # Calculate Laplacian variance for sharpness

# Set up input video and output folder
video_path = './public/Sample2.mp4'  # Path to your video file

# Open the video file
cap = cv2.VideoCapture(video_path)

# Get the frames per second (fps) of the video
fps = cap.get(cv2.CAP_PROP_FPS)

# Interval to extract frames (e.g., every 1 second)
frame_interval = int(fps)  # Extract 1 frame every second (fps)

frame_count = 0
max_sharpness = -1  # To track the sharpest frame
sharpest_frame = None  # To store the sharpest frame
frame_id = 0

# Create an output folder to save frames
output_folder = 'extracted_frames'
if not os.path.exists(output_folder):
    os.makedirs(output_folder)

while True:
    # Read the next frame from the video
    ret, frame = cap.read()
    
    if not ret:
        break  # Break if no more frames are available

    # Extract a frame at regular intervals
    if frame_count % frame_interval == 0:
        sharpness = calculate_sharpness(frame)  # Calculate sharpness of the frame
        
        # Save the frame as an image in the output folder
        frame_filename = f'{output_folder}/frame_{frame_id:04d}.jpg'
        cv2.imwrite(frame_filename, frame)
        print(f'Saved {frame_filename}')
        
        # Keep track of the sharpest frame
        if sharpness > max_sharpness:
            max_sharpness = sharpness
            sharpest_frame = frame  # Store the sharpest frame
        
        frame_id += 1

    frame_count += 1

# Release the video capture object
cap.release()

# If a sharpest frame is found, save or display it
if sharpest_frame is not None:
    cv2.imwrite('sharpest_frame.jpg', sharpest_frame)  # Save the sharpest frame
    print('Saved the sharpest frame as "sharpest_frame.jpg"')
else:
    print('No frames were extracted.')
