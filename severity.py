import google.generativeai as genai
import sys

genai.configure(api_key="AIzaSyAk7gt4eMf1GHY-ZCQBL7LGqNp0c98bK1I")

## function to load Gemini Pro model and get repsonses
model=genai.GenerativeModel(model_name="gemini-pro") 
chat = model.start_chat(history=[])

def get_severity(question):

    msg = f"""Based on the emergency situation described below, as an experienced doctor give me only a severity score from 0 - 1. 
    Consider parameters like:
    1. No. of people (Higher the number more severity)
    2. Age of people (Old and Young more severity)
    3. described emergency

    Sample response:
    Severity : 0.65
    One line explanation of severity score

    {question}"""
    
    response=chat.send_message(msg,stream=True)
    return response

# text = get_severity('I am feeling very weak and I am having a lot of pain in my chest. I am also having difficulty in breathing. I am also feeling very dizzy. I think I am having a heart attack. Please help me.')
# print(text.text)
text = get_severity(sys.argv[1])
for x in text:
    print(x.text)