# 📸 Instagram Video Downloader API

**Created by Umar J**

## 🚀 Introduction

A powerful and reliable Instagram video downloader API built with Node.js. Features multiple extraction methods for maximum success rate and a beautiful modern web interface.

## ✨ Features

- 📹 Download Instagram videos, reels, and IGTV
- 🔄 Multiple extraction methods for reliability
- 🎨 Modern, responsive web interface
- ⚡ Fast and efficient processing
- 🔒 CORS enabled for cross-origin requests

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Instagram-Downloder
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   npm start
   ```

## 📚 API Usage

### Endpoint
```
GET /api/igdl?url=<instagram_url>
```

### Example
```
http://localhost:3000/api/igdl?url=https://www.instagram.com/p/DLHQfPiyucu/
```

### Response
```json
{
  "success": true,
  "developer": "@SamiHann",
  "data": [
    {
      "quality": "HD",
      "url": "https://video-url.mp4"
    }
  ]
}
```

## 🌐 Web Interface

Access the beautiful web interface at `http://localhost:3000` to download videos directly from your browser.

## 📝 License

This project is for educational purposes only. Please respect Instagram's terms of service.

---

**Made with ❤️ by Umar J**
