#pip install --upgrade git+https://github.com/huggingface/transformers

from langchain.prompts import PromptTemplate
from langchain.llms import GooglePalm
import sys
import os

try:
    api_key = 'AIzaSyBGUHSHP8L3o0LJiutdBiVRQ9ARocXjJzs'
    llm = GooglePalm(google_api_key=api_key, temperature=0.2)

    # path = sys.argv[1]
    path = 'I have a deep cut on my wrist'

    system1 = "Analyze the provided text describing an emergency situation and Classify the emergency being Medical, Criminal, Fire, Accident or Normal. Your evaluation should reflect the likelihood of the scenario fitting into each category"

    prompt = PromptTemplate.from_template("""{system}

    For Eg:
    TEXT: There's a lot of crowd here and there's a big car accident that has happened. The truck kind of crashed, dashed into the car and the truck is not visible anymore and the car driver, the car has almost collapsed. The car driver is bleeding heavily. What should I do right now?
    RESULT: Accident

    Query: {query}
    RESULT: """)

    msg = prompt.format(system=system1, query=path)
    response = llm(msg)

    print(response)
except e:
    print(e)
    print("Error")
