from fastapi import FastAPI
from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# ---- Config ----
model_id = "meta-llama/Meta-Llama-Guard-2-8B"
hf_token = "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"  # User's actual token

# ---- Load model and tokenizer once at startup ----
tokenizer = AutoTokenizer.from_pretrained(model_id, token=hf_token)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    device_map="auto",
    torch_dtype="auto",
    token=hf_token
)

# ---- FastAPI setup ----
app = FastAPI()

class PromptRequest(BaseModel):
    prompt: str
    max_new_tokens: int = 128

@app.post("/predict")
def predict(req: PromptRequest):
    inputs = tokenizer(req.prompt, return_tensors="pt").to(model.device)
    outputs = model.generate(**inputs, max_new_tokens=req.max_new_tokens)
    result = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return {"response": result} 