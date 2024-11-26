# Emergency Assistance System

## Overview

The **Emergency Assistance System** is a responsive platform designed to provide instant support during emergency situations. Users can quickly get help through **WhatsApp**, add and manage **emergency contacts**, locate **nearby emergency services**, and receive **first aid advice** based on the nature of the emergency. This project integrates machine learning for intelligent decision-making and uses messaging services to ensure swift communication.

## Features

- **Instant Access via WhatsApp**: Reach out for assistance instantly through WhatsApp.
- **Emergency Contacts**: Add and manage emergency contacts who will be notified in case of an emergency.
- **Nearby Emergency Services**: Automatically locate nearby hospitals, fire stations, or police stations based on the user’s location. The system allocates resources based on distance, severity of the emergency, and available resources at the location.
- **First Aid Guidance**: Receive real-time first aid advice based on the type of emergency.

## Tech Stack

- **Python**: Used for building machine learning models for decision-making and resource allocation.
- **JavaScript**: Used for creation of chatbot and serving requests.
- **Twilio**: Integrated for the WhatsApp chatbot to send and receive messages during an emergency.
- **Google Maps API**: Used for geolocation and mapping nearby emergency services.

## Installation

### Prerequisites

- Python 3.x
- Node.js and npm
- Twilio account for WhatsApp messaging
- Google Maps API key

### Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/navneetnair7/Rakshak-Chatbot.git
    cd Rakshak-Chatbot
    ```

2. Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```

3. Install Node.js dependencies:
    ```bash
    npm install
    ```

4. Set up environment variables for Twilio and Google Maps API:
    - Create a `.env` file in the root directory with the following content:
      ```bash
      TWILIO_ACCOUNT_SID=your_twilio_account_sid
      TWILIO_AUTH_TOKEN=your_twilio_auth_token
      TWILIO_PHONE_NUMBER=your_twilio_whatsapp_number
      GOOGLE_MAPS_API_KEY=your_google_maps_api_key
      ```

### Testing the WhatsApp Bot

- Send a WhatsApp message to the Twilio number with the keyword `SOS`.
- The bot will respond based on the emergency type you specify.

## Usage

Once the system is set up and running:

1. Open the app on your browser or mobile device.
2. Add emergency contacts through first message.
3. Use the chatbot via WhatsApp to report an emergency.
4. The system will automatically locate nearby services and allocate resources as needed.
5. First aid instructions will be sent based on the emergency.
