import google.generativeai as genai
import sys

try:
    genai.configure(api_key="AIzaSyAk7gt4eMf1GHY-ZCQBL7LGqNp0c98bK1I")

    ## function to load Gemini Pro model and get repsonses
    model=genai.GenerativeModel(model_name="gemini-pro") 
    chat = model.start_chat(history=[])

    def get_first_aid(question):

        msg = f"""Based on the emergency situation described below, as an experienced doctor, outline a first aid response plan in a numerical list to stabilize the situation until professional medical help arrives. Ensure your plan addresses critical care priorities and is adaptable to the specifics of the scenario provided in strictly 20 words.
        {question}"""

        # print(msg)
        
        response=chat.send_message(msg,stream=True)
        return response

    # text = get_first_aid('I have a deep cut on my wrist')
    text = sys.argv[1]
    res = get_first_aid(text)
    result = ''
    for x in res:
        # print(x.text)
        result += x.text + '\n'

    print(result)
except Exception as e:
    print(e)
    # # print('test 1')

    # print("""
    # 1. *Immediate Action:*
    #    - Apply direct pressure to the wound to
    #  reduce bleeding.
    #    - Raise the injured limb above the level of the heart to reduce further bleeding.
    #    - Remove any constricting articles of clothing
    # , jewelry, or objects from the injured area to prevent swelling.


    # 2. *Secure the Wound:*
    #    - Once the bleeding is under control, clean the wound with clean water and pat dry.
    #    - Apply a sterile bandage or clean cloth to the wound. Secure the bandage firmly in place to minimize movement
    #  of the wound.


    # 3. *Splinting:*
    #    - If the wrist is severely cut or if there is any suspicion of a bone fracture or tendon injury, immobilize the wrist by splinting it. Use a rigid material like a splint or a rolled-up newspaper to provide support.


    # 4. *Obtain Professional Medical Help:*
    #    - Call for emergency medical services or transport the injured person to the nearest medical facility if available.
    #    - Inform the medical personnel about the incident and provide as much information as possible, including the time and nature of the injury.


    # 5. *Additional Care:*
    #    - Monitor
    #  the pulse, skin color, and temperature of the injured area to assess the condition of the wrist.
    #    - If the wound is deep or extensive, it may require sutures or special medical attention.
    #    - Keep the wound clean, dry, and covered until professional medical help arrives""")