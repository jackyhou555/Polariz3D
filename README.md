<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This project contains everything you need to run your app locally. 


---

## 🚀 快速上手步驟 (Run Locally)

**Prerequisites:** Node.js

1. **下載專案 (Clone Repository)**
   ```bash
   git clone [https://github.com/jackyhou555/Polariz3D.git](https://github.com/jackyhou555/Polariz3D.git)
   cd Polariz3D
   ```

2. **安裝依賴套件 (Install Dependencies)**
   ```bash
   npm install
   
```

3. **設定環境變數 (Set Environment Variables)**
   在專案根目錄建立一個名為 `.env.local` 的檔案，並填入你的 Gemini API Key：
   ```env
   GEMINI_API_KEY=你的_API_KEY
   
```

4. **啟動應用程式 (Run the App)**
   ```bash
   npm run dev
   
```
   啟動後，請在瀏覽器打開：`http://localhost:5173`

---

## 🛑 如何關閉 (How to Stop)

若要停止正在執行的本地伺服器，請回到終端機視窗並執行以下操作：

1. 按下鍵盤快捷鍵：**`Ctrl + C`**
2. 當畫面出現 `終止批次工作 (Y/N)?` 時，輸入 **`y`** 並按下 **Enter** 即可關閉。
