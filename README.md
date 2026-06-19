# 🎓 Certi-Generator

Certi-Generator is a modern, high-performance web application designed to automate the generation of certificates in bulk. It takes a template image and an Excel spreadsheet as input, maps the data, and outputs a ZIP file containing personalized certificates in PDF format.

## 🚀 Features

- **Bulk Certificate Generation:** Upload an Excel (`.xlsx`) file containing participant details and instantly generate certificates for everyone.
- **Custom Mapping:** Dynamically map spreadsheet columns to specific locations on your certificate template.
- **In-Memory Processing:** Data and images are processed completely in memory without being saved to disk, ensuring high speed and strict privacy.
- **Instant ZIP Download:** Compiles all generated certificates into a single ZIP archive for easy distribution.
- **Modern Tech Stack:** Built with a blazing-fast React frontend and a robust FastAPI backend.

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Language:** TypeScript

### Backend
- **Framework:** FastAPI (Python)
- **Image Processing:** Pillow (PIL)
- **Data Handling:** Pandas & Openpyxl
- **Server:** Uvicorn

## 📂 Project Structure

```text
Certi-Generator/
├── backend/          # FastAPI server and image processing logic
│   ├── app/          # Main application code (routes, services, utils)
│   ├── fonts/        # TTF fonts used for certificate text
│   └── tests/        # Backend test suite
├── src/              # React frontend source code
│   ├── assets/       # Static assets like images
│   └── components/   # Reusable UI components
├── public/           # Public assets (icons, etc.)
└── students.xlsx     # Sample Excel data for testing
```

## 💻 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (3.11 or higher)

### 1. Clone the repository
```bash
git clone https://github.com/CODEWITH-Manthan/Certi-Generator.git
cd Certi-Generator
```

### 2. Setup Backend
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python run.py
```
The backend API will run on `http://localhost:8000`.

### 3. Setup Frontend
Open a new terminal and navigate to the project root:
```bash
npm install
npm run dev
```
The frontend application will run on `http://localhost:5173` (or another port specified by Vite).

## 📝 Usage

1. **Upload Template:** Upload a blank certificate template in `.png` or `.jpg` format.
2. **Upload Data:** Upload an Excel file (`.xlsx`) containing the participant details.
3. **Map Data:** Use the interactive designer to place text fields exactly where they belong on the certificate.
4. **Generate:** Click generate! The application will process the data and prompt you to download a `certificates.zip` file.

## 🤝 Contributing

Please feel free to submit a Pull Request.

## 📜 License

This project is licensed under the MIT License.
