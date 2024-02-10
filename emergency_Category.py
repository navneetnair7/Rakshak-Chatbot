#pip install --upgrade git+https://github.com/huggingface/transformers

import torch
from transformers import AutoModelForSpeechSeq2Seq, AutoProcessor, pipeline
from langchain.prompts import PromptTemplate
# from langchain_community.llms import GooglePalm
from langchain.llms import GooglePalm
import ffmpeg
import sys

# print(*sys.argv)

# print("passes the import stage")
device = "cuda:0" if torch.cuda.is_available() else "cpu"
torch_dtype = torch.float16 if torch.cuda.is_available() else torch.float32

api_key = 'AIzaSyAjb_j6triUJgS97u8aaU4YQJni9lppYQc'
llm = GooglePalm(google_api_key=api_key, temperature=0.2)

# print("imported googlellm")
model_id = "openai/whisper-large-v3"
model = AutoModelForSpeechSeq2Seq.from_pretrained(
    model_id, torch_dtype=torch_dtype, low_cpu_mem_usage=True, use_safetensors=True
)
model.to(device)

processor = AutoProcessor.from_pretrained(model_id)

pipe = pipeline(
    "automatic-speech-recognition",
    model=model,
    tokenizer=processor.tokenizer,
    feature_extractor=processor.feature_extractor,
    # max_new_tokens=128,
    # chunk_length_s=30,
    # batch_size=10,
    return_timestamps=True,
    torch_dtype=torch_dtype,
    device=device,
)

# print("hello")
# print(sys.argv[1])
path = sys.argv[1]
# path = "uploads/1707567836588.ogg"
path = path.replace("\\","/")
upload = path.index("uploads")
path = path[upload:]
print(path)
# path.replace('\', '/')
# print(path)
# audio = ffmpeg.input("uploads/1707567836588.ogg")
# ffm
query = pipe(path)
# print("test")

system1 = "Analyze the provided text describing an emergency situation and Classify the emergency being Medical, Criminal, Fire, Accident or Normal. Your evaluation should reflect the likelihood of the scenario fitting into each category"

# print("Reached prompt")
prompt = PromptTemplate.from_template("""{system}

For Eg:
TEXT: There's a lot of crowd here and there's a big car accident that has happened. The truck kind of crashed, dashed into the car and the truck is not visible anymore and the car driver, the car has almost collapsed. The car driver is bleeding heavily. What should I do right now?
RESULT: Accident

Query: {query}
RESULT: """)

msg = prompt.format(system=system1, query=query)
# print("Hello,entered here ")
response = llm(msg)

print(response)