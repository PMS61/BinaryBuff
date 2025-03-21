from pydantic import BaseModel

class userReqMod(BaseModel):
    email:str
    password:str

class userResMod(BaseModel):
    error:bool
    token:str
