import io
import sys
from pathlib import Path
# Add backend root to sys.path to allow absolute imports
sys.path.append(str(Path(__file__).resolve().parent.parent))

import zipfile  
import pandas as pd
# pyrefly: ignore [missing-import]
from PIL import Image
from app.services.generator import generate_certificates_zip, download_required_fonts


def test_certificate_generator():
    print("--- Starting Certificate Generator Integration Tests ---")
    
    # 1. Download fonts first to make sure they are cached for testing
    print("Step 1: Caching required fonts...")
    download_required_fonts()

    # 2. Create in-memory mock template image (RGB, 1000x700, deep violet background)
    print("Step 2: Generating mock certificate graphic template...")
    img = Image.new('RGB', (1000, 700), color='#1e1b4b')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    template_bytes = img_byte_arr.getvalue()

    # 3. Create in-memory mock Excel file
    print("Step 3: Creating mock database spreadsheet...")
    mock_data = {
        "Student Name": ["Alice Johnson", "Bob Smith", "Charlie Brown"],
        "Course Name": ["Intro to Robotics", "Mastering Python", "Quantum Computing"],
        "Issue Date": ["2026-06-08", "2026-06-09", "2026-06-10"],
        "Cert ID": ["CERT-001", "CERT-002", "CERT-003"]
    }
    df = pd.DataFrame(mock_data)
    excel_byte_arr = io.BytesIO()
    with pd.ExcelWriter(excel_byte_arr, engine='openpyxl') as writer:
        df.to_excel(writer, index=False)
    excel_bytes = excel_byte_arr.getvalue()

    # 4. Create mapping configuration matching our mock data
    mapping_config = {
        "name": {
            "column": "Student Name",
            "x": 0.5,
            "y": 0.4,
            "fontSize": 0.05,
            "color": "#ffffff",
            "font": "sans",
            "align": "center"
        },
        "course": {
            "column": "Course Name",
            "x": 0.5,
            "y": 0.55,
            "fontSize": 0.035,
            "color": "#818cf8",
            "font": "serif",
            "align": "center"
        },
        "date": {
            "column": "Issue Date",
            "x": 0.3,
            "y": 0.75,
            "fontSize": 0.022,
            "color": "#9ca3af",
            "font": "sans",
            "align": "center"
        },
        "cert_id": {
            "column": "Cert ID",
            "x": 0.7,
            "y": 0.75,
            "fontSize": 0.022,
            "color": "#9ca3af",
            "font": "sans",
            "align": "center"
        }
    }

    # 5. Run the generator pipeline
    print("Step 4: Executing certificate generation pipeline...")
    try:
        zip_bytes = generate_certificates_zip(
            template_bytes=template_bytes,
            excel_bytes=excel_bytes,
            mapping_config=mapping_config
        )
        assert len(zip_bytes) > 0, "Generated ZIP byte stream is empty!"
        print(f"Success: Generated ZIP archive of size {len(zip_bytes)} bytes.")
    except Exception as e:
        print(f"Error during generator processing: {e}")
        assert False, f"Generation failed: {e}"

    # 6. Verify ZIP contents
    print("Step 5: Verifying PDF files packed into ZIP archive...")
    zip_buffer = io.BytesIO(zip_bytes)
    with zipfile.ZipFile(zip_buffer, 'r') as zip_file:
        file_list = zip_file.namelist()
        print(f"Files inside ZIP: {file_list}")
        
        # Verify length
        assert len(file_list) == 3, f"Expected 3 certificate PDFs, but found {len(file_list)}"
        
        # Verify sanitized names
        expected_names = [
            "Certificate_Alice Johnson.pdf",
            "Certificate_Bob Smith.pdf",
            "Certificate_Charlie Brown.pdf"
        ]
        for name in expected_names:
            assert name in file_list, f"Expected file '{name}' was not found in the ZIP archive!"
            
    print("--- All Tests Completed Successfully! (Green Status) ---")

if __name__ == "__main__":
    test_certificate_generator()
