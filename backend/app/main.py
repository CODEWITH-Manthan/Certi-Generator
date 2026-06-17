import io
import json
import logging
import pandas as pd
# pyrefly: ignore [missing-import]
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Response
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]      
from app.services.generator import download_required_fonts, generate_certificates_zip


# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Certificate Generator API", version="1.0.0")

# CORS Middleware config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins in local dev env
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    logger.info("Initializing Certificate Generator Application...")
    # Cache fonts dynamically on start
    download_required_fonts()

@app.post("/api/parse-excel")
async def parse_excel(excel: UploadFile = File(...)):
    """
    Parses Excel spreadsheet in memory and returns columns and all row data as JSON.
    Does not save anything to disk.
    """
    # Verify extension
    if not excel.filename.endswith(".xlsx"):
        raise HTTPException(status_code=400, detail="Only .xlsx Excel spreadsheets are supported.")
    
    try:
        content = await excel.read()
        df = pd.read_excel(io.BytesIO(content), dtype=str).fillna("") # Load all rows
        columns = df.columns.tolist()
        data = df.to_dict(orient='records')
        sample_data = data[0] if len(data) > 0 else {}
        return {"columns": columns, "data": data, "sample_data": sample_data}
    except Exception as e:
        logger.error(f"Error parsing Excel columns: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to read spreadsheet: {str(e)}")

@app.post("/api/generate")
async def generate_certificates(
    template: UploadFile = File(...),
    excel_data: str = Form(...), # Sent as a serialized JSON string containing list of dicts
    mapping: str = Form(...) # Sent as a serialized JSON string
):
    """
    Receives graphic template, spreadsheet database, and layout mappings.
    Draws certificates in memory, compiles PDFs into a ZIP archive, and streams the download.
    """
    # 1. Validations
    if not template.filename.lower().endswith((".png", ".jpg", ".jpeg")):
        raise HTTPException(status_code=400, detail="Template must be a PNG or JPG graphic.")

    try:
        mapping_dict = json.loads(mapping)
        data_list = json.loads(excel_data)
    except Exception as e:
        logger.error(f"Invalid JSON payload: {e}")
        raise HTTPException(status_code=400, detail="Payloads must be valid JSON strings.")

    try:
        template_bytes = await template.read()
        
        # 2. Run Generation Service
        zip_data = generate_certificates_zip(
            template_bytes=template_bytes,
            excel_data=data_list,
            mapping_config=mapping_dict
        )
        
        # 3. Stream ZIP back as inline attachment response
        return Response(
            content=zip_data,
            media_type="application/zip",
            headers={
                "Content-Disposition": "attachment; filename=certificates.zip"
            }
        )

    except ValueError as val_err:
        # User error or formatting failures
        logger.error(f"Validation error during generation: {val_err}")
        raise HTTPException(status_code=400, detail=str(val_err))
    except Exception as err:
        # Unexpected server runtime failures
        logger.error(f"Internal generation error: {err}")
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(err)}")
