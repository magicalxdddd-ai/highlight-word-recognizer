const words = [
  {
    text: "concession",
    meaning: "让步；妥协",
    source: "阅读二 第三段",
    tag: "熟词生义",
    selected: true,
  },
  {
    text: "insulate",
    meaning: "使隔绝；保护",
    source: "阅读一 第五段",
    tag: "核心动词",
    selected: true,
  },
  {
    text: "skeptical",
    meaning: "怀疑的",
    source: "阅读四 第一段",
    tag: "态度词",
    selected: true,
  },
  {
    text: "proliferation",
    meaning: "激增；扩散",
    source: "阅读三 第二段",
    tag: "长难词",
    selected: false,
  },
];

let reviewIndex = 0;
let showMeaning = false;

const wordList = document.querySelector("#word-list");
const selectedCountTop = document.querySelector("#selected-count-top");
const selectedCountSide = document.querySelector("#selected-count-side");
const reviewPosition = document.querySelector("#review-position");
const reviewTotal = document.querySelector("#review-total");
const cardSource = document.querySelector("#card-source");
const cardWord = document.querySelector("#card-word");
const cardMeaning = document.querySelector("#card-meaning");
const progressBar = document.querySelector("#progress-bar");
const newWordInput = document.querySelector("#new-word");
const scanStatus = document.querySelector("#scan-status");
const uploadCopy = document.querySelector("#upload-copy");
const paperUpload = document.querySelector("#paper-upload");
const paperImage = document.querySelector("#paper-image");
const paperPreview = document.querySelector("#paper-preview");

function selectedWords() {
  return words.filter((word) => word.selected);
}

function renderWords() {
  wordList.innerHTML = "";
  words.forEach((word) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = `word-row${word.selected ? " selected" : ""}`;
    row.innerHTML = `
      <span>
        <strong>${word.text}</strong>
        <small>${word.source}</small>
      </span>
      <em>${word.tag}</em>
    `;
    row.addEventListener("click", () => {
      word.selected = !word.selected;
      reviewIndex = 0;
      showMeaning = false;
      render();
    });
    wordList.appendChild(row);
  });
}

function renderCard() {
  const current = selectedWords();
  selectedCountTop.textContent = current.length;
  selectedCountSide.textContent = current.length;
  reviewTotal.textContent = current.length;
  reviewPosition.textContent = current.length ? reviewIndex + 1 : 0;
  progressBar.style.width = `${Math.min(current.length * 22, 100)}%`;

  if (!current.length) {
    cardSource.textContent = "暂无单词";
    cardWord.textContent = "请选择";
    cardMeaning.textContent = "选择单词后开始复习";
    return;
  }

  const word = current[reviewIndex % current.length];
  cardSource.textContent = word.source;
  cardWord.textContent = word.text;
  cardMeaning.textContent = showMeaning ? word.meaning : `${word.tag} · 点一下看释义`;
}

function render() {
  renderWords();
  renderCard();
}

document.querySelector("#flashcard").addEventListener("click", () => {
  showMeaning = !showMeaning;
  renderCard();
});

document.querySelector("#show-meaning").addEventListener("click", () => {
  showMeaning = !showMeaning;
  renderCard();
});

document.querySelector("#next-card").addEventListener("click", () => {
  const current = selectedWords();
  reviewIndex = current.length ? (reviewIndex + 1) % current.length : 0;
  showMeaning = false;
  renderCard();
});

document.querySelector("#add-word-button").addEventListener("click", addWord);
newWordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") addWord();
});

function addWord() {
  const text = newWordInput.value.trim();
  if (!text) return;
  words.unshift({
    text,
    meaning: "待补充释义",
    source: "手动添加",
    tag: "待复盘",
    selected: true,
  });
  newWordInput.value = "";
  reviewIndex = 0;
  showMeaning = false;
  render();
}

paperUpload.addEventListener("change", () => {
  const file = paperUpload.files && paperUpload.files[0];
  if (!file) return;
  paperImage.src = URL.createObjectURL(file);
  paperImage.hidden = false;
  paperPreview.hidden = true;
  uploadCopy.textContent = "更换照片";
  scanStatus.textContent = "识别中";
  scanStatus.className = "status scanning";
  setTimeout(() => {
    scanStatus.textContent = "已整理";
    scanStatus.className = "status done";
    words.forEach((word, index) => {
      if (index < 3) word.selected = true;
    });
    render();
  }, 900);
});

render();
