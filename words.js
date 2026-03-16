// ==========================================
// word.js - 單字庫管理引擎 (完整覆蓋版)
// ==========================================

let allWordsDb = [];        // 存放完整的 1198 字
let currentLevelWords = []; // 存放目前選定學期的單字

// 1. 遊戲一開啟就去載入 words.json
async function loadWordDatabase() {
    try {
        const response = await fetch('words.json');
        allWordsDb = await response.json();
        console.log(`✅ 成功載入 ${allWordsDb.length} 個單字！`);
        
        // 載入完成後，立刻根據當前下拉選單初始化題庫
        updateWordList(); 
    } catch (error) {
        console.error("❌ 無法載入 words.json，請確認檔案是否在同一個資料夾：", error);
    }
}

// 2. 根據下拉選單，過濾出該學期的單字
function updateWordList() {
    const levelSelect = document.getElementById('levelSelect');
    if (!levelSelect) return; // 防呆機制

    const level = levelSelect.value;
    
    if (level === "ALL") {
        currentLevelWords = [...allWordsDb]; // 地獄模式：1200字全上
    } else {
        currentLevelWords = allWordsDb.filter(word => word.level === level);
    }
    
    console.log(`切換至 ${level} 學期，準備了 ${currentLevelWords.length} 個國中單字出戰！`);
}

// 3. 網頁載入時，綁定事件與啟動引擎
window.addEventListener('DOMContentLoaded', () => {
    const levelSelect = document.getElementById('levelSelect');
    if (levelSelect) {
        // 當選單改變時，重新過濾單字
        levelSelect.addEventListener('change', updateWordList);
    }
    // 啟動讀取 JSON
    loadWordDatabase();
});

// ==========================================
// API: 提供給您遊戲主程式「抽單字」的專用函式
// ==========================================
function getRandomWord() {
    // 防呆：如果還沒載入完或沒資料
    if (currentLevelWords.length === 0) {
        return { en: "loading", ch: "載入中...", level: "N/A" }; 
    }
    // 隨機抽取一個單字回傳
    const randomIndex = Math.floor(Math.random() * currentLevelWords.length);
    return currentLevelWords[randomIndex];
}