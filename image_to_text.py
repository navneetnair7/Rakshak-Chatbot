import requests
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

raw_image = Image.open('accident.jpg').convert('RGB')

inputs = processor(raw_image, return_tensors="pt")

out = model.generate(**inputs)

print(processor.decode(out[0], skip_special_tokens=True))