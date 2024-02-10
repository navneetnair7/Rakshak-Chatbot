from flask import Flask, request, jsonify
import requests
import os
import shutil
import subprocess

app = Flask(__name__)

account_sid = "AC85cc74a4a440bfcd82a87af3739e6aad"
auth_token = "9fdff760d22717e78193a97de08d78bf"
twilio_number = "+1-415-523-8886"

emergency_contacts = []

@app.route("/webhook", methods=["POST"])
def webhook():
    try:
        incoming_message = request.form.get("Body", "").lower()
        media_url = request.form.get("MediaUrl0", "")
        media_content_type = request.form.get("MediaContentType0", "")
        latitude = request.form.get("Latitude", "")
        longitude = request.form.get("Longitude", "")

        if incoming_message == "hello":
            response_message = "Hi there! How can I help you?"
            if not emergency_contacts:
                response_message += " Enter emergency contact numbers."
        elif media_url:
            # Handle media file
            response_message = process_media(media_url, media_content_type)
        elif latitude and longitude:
            # Handle location
            response_message = process_location(latitude, longitude)
        elif incoming_message.isdigit():
            emergency_contacts.append(incoming_message)
            response_message = "Emergency contact added successfully."
        else:
            response_message = "Sorry, I don't understand that command."

        return (response_message, 200)

    except Exception as e:
        print(f"Error: {str(e)}")
        return ("Internal Server Error", 500)

def process_media(media_url, media_content_type):
    try:
        response = requests.get(media_url, auth=(account_sid, auth_token))
        file_path = f"uploads/{int(time.time())}.{media_content_type.split('/')[1]}"
        with open(file_path, "wb") as f:
            f.write(response.content)
        
        # Call the function to process the media file
        category = emergency(file_path)
        print("Category:", category)

        # Handle sending messages to emergency contacts

        return "Thanks for the file! I'll take a look and get back to you."

    except Exception as e:
        print(f"Error processing media: {str(e)}")
        return "Sorry, I couldn't process the image."

def process_location(latitude, longitude):
    try:
        latitude2 = 19.11736541881868
        longitude2 = 72.83513139220759
        response_message = f"https://www.google.com/maps/dir/?api=1&origin={latitude},{longitude}&destination={latitude2},{longitude2}&travelmode=driving"
        return response_message
    except Exception as e:
        print(f"Error processing location: {str(e)}")
        return "Sorry, an error occurred while processing your location."

def emergency(file_path):
    try:
        process = subprocess.Popen(["python", "emergency_Category.py", file_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        output, _ = process.communicate()
        return output.decode("utf-8").strip()
    except Exception as e:
        print(f"Error processing media: {str(e)}")
        return ""

if __name__ == "__main__":
    app.run(port=3000, debug=True)
