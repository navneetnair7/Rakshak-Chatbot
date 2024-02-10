import google.generativeai as genai

genai.configure(api_key="AIzaSyAk7gt4eMf1GHY-ZCQBL7LGqNp0c98bK1I")

## function to load Gemini Pro model and get repsonses
model=genai.GenerativeModel(model_name="gemini-pro") 
chat = model.start_chat(history=[])

def get_first_aid(question):

    msg = f"""Based on the emergency situation described below, as an experienced doctor, outline a first aid response plan in bullet points to stabilize the situation until professional medical help arrives. Ensure your plan addresses critical care priorities and is adaptable to the specifics of the scenario provided.
    {question}"""

    print(msg)
    
    response=chat.send_message(msg,stream=True)
    return response
get_first_aid(sys.argv[1])