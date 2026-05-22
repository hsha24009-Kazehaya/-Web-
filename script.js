// ==========================================
// データ定義（通告テキスト ＆ ダンス設定）
// ==========================================
const database = {
    work: {
        normal: {
            rank: "現状維持",
            text: "悩む前に、自分のやるべき仕事をしてください。周りのせいにしても何も変わりません。"
        },
        penalty: {
            rank: "自業自得（警告）",
            text: "本日3回目の申請です。そんなに暇なら、溜まっている仕事を片付けたらどうですか？"
        }
    },
    love: {
        normal: {
            rank: "脈なし",
            text: "残念ですが、相手はあなたに興味がありません。期待するだけ時間の無駄です。"
        },
        penalty: {
            rank: "現実逃避（警告）",
            text: "本日3回目の申請です。これ以上現実から目を背けて画面を叩いても、恋愛ステータスは変動しません。"
        }
    }
};

const appealReplies = [
    "【自動送信】異議は却下されました。あなたの感情論に付き合う時間はありません。",
    "【自動送信】ここでお客様の機嫌をとる予定はありません。自分の部屋でふて寝してください。"
];

// キャラクター定義（絵文字でチープさを表現）
const dancersConfig = [
    { emoji: "🕴️", animation: "shake-dance", duration: "1.2s" },
    { emoji: "🕊️", animation: "pigeon-dance", duration: "1.8s" },
    { emoji: "💀", animation: "shake-dance", duration: "0.9s" },
    { emoji: "🕺", animation: "pigeon-dance", duration: "1.4s" }
];

// ==========================================
// 状態管理（ステート）
// ==========================================
let dailyCount = 0;

// ==========================================
// DOM要素の取得
// ==========================================
const screenInput = document.getElementById("screen-input");
const screenResult = document.getElementById("screen-result");
const genreSelect = document.getElementById("genre-select");

const btnSubmit = document.getElementById("btn-submit");
const btnAppeal = document.getElementById("btn-appeal");
const btnReset = document.getElementById("btn-reset");

const resultRank = document.getElementById("result-rank");
const resultText = document.getElementById("result-text");
const infoCount = document.getElementById("info-count");
const infoDate = document.getElementById("info-date");
const infoId = document.getElementById("info-id");

const popupOverlay = document.getElementById("popup-overlay");
const popupMessage = document.getElementById("popup-message");
const btnPopupClose = document.getElementById("btn-popup-close");
const backgroundLayer = document.getElementById("background-layer");

// ==========================================
// ロジック関数
// ==========================================

// 日付の設定（仕様に準拠したフォーマット）
function updateMetaDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    infoDate.textContent = `${year}年${month}月${day}日`;
    infoId.textContent = `${year}-${String(Math.floor(Math.random() * 9000) + 1000)}`;
}

// 背後の「おかしなダンス」を生成・起動する関数
function triggerBackgroundDancers(isPenalty) {
    backgroundLayer.innerHTML = ""; // 前回のダンサーを消去

    // 画面に散りばめるダンサーの数
    const count = isPenalty ? 12 : 4; // 3回目以降は増殖

    for (let i = 0; i < count; i++) {
        const config = dancersConfig[Math.floor(Math.random() * dancersConfig.length)];
        const el = document.createElement("div");
        el.className = "dancer active";
        el.textContent = config.emoji;

        // ランダムに配置
        el.style.left = `${Math.random() * 90}%`;
        el.style.top = `${Math.random() * 70 + 10}%`;
        
        // アニメーション設定
        el.style.animation = `${config.animation} ${config.duration} steps(4) infinite`;

        // 3回以上の申請（ペナルティ）なら速度を3倍に
        if (isPenalty) {
            el.classList.add("speed-up");
            el.style.transform = `scale(${Math.random() * 1.5 + 1})`; // サイズもバラバラに暴れさせる
        }

        backgroundLayer.appendChild(el);
    }
}

// ==========================================
// イベントリスナー（ボタン操作）
// ==========================================

// 1. 申請ボタンが押されたとき
btnSubmit.addEventListener("click", () => {
    dailyCount++;
    const selectedGenre = genreSelect.value;
    const isPenalty = dailyCount >= 3;

    // データ抽出
    const mode = isPenalty ? "penalty" : "normal";
    const resultData = database[selectedGenre][mode];

    // UIのテキストを書き換え
    resultRank.textContent = resultData.rank;
    resultText.textContent = resultData.text;
    infoCount.textContent = dailyCount;
    updateMetaDate();

    // 画面遷移
    screenInput.classList.add("hidden");
    screenResult.classList.remove("hidden");

    // ダンス演出開始
    triggerBackgroundDancers(isPenalty);
});

// 2. 異議申し立てボタンが押されたとき
btnAppeal.addEventListener("click", () => {
    // ランダムな却下文言を選択
    const randomReply = appealReplies[Math.floor(Math.random() * appealReplies.length)];
    popupMessage.textContent = randomReply;

    // ポップアップ表示
    popupOverlay.classList.remove("hidden");
});

// 3. ポップアップを閉じるとき（ここでダンスがさらに狂う）
btnPopupClose.addEventListener("click", () => {
    popupOverlay.classList.add("hidden");

    // ダンスをさらにカオスに（全ダンサーの反転＆変形）
    const dancers = document.querySelectorAll(".dancer");
    dancers.forEach(d => {
        d.style.transform = "rotate(180deg) scale(2)"; // 逆さまになって巨大化（煽りポーズ）
        d.style.transition = "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
    });
});

// 4. 再申請ボタンが押されたとき（初期画面に戻る）
btnReset.addEventListener("click", () => {
    backgroundLayer.innerHTML = ""; // ダンス終了
    screenResult.classList.add("hidden");
    screenInput.classList.remove("hidden");
});