const words = [
  {
    text: "concession",
    meaning: "让步；妥协",
    example: "例句：The author makes a careful concession before giving the final judgment.",
    source: "阅读二 第三段",
    tag: "熟词生义",
    tagClass: "tag-familiar",
    selected: true,
  },
  {
    text: "insulate",
    meaning: "使隔绝；保护",
    example: "例句：Good habits can insulate your review plan from short-term anxiety.",
    source: "阅读一 第五段",
    tag: "核心动词",
    tagClass: "tag-verb",
    selected: true,
  },
  {
    text: "skeptical",
    meaning: "怀疑的",
    example: "例句：The author remains skeptical about quick technological promises.",
    source: "阅读四 第一段",
    tag: "态度词",
    tagClass: "tag-attitude",
    selected: true,
  },
  {
    text: "proliferation",
    meaning: "激增；扩散",
    example: "例句：The proliferation of information makes careful reading more important.",
    source: "阅读三 第二段",
    tag: "长难词",
    tagClass: "tag-hard",
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
const cardHint = document.querySelector("#card-hint");
const cardTag = document.querySelector("#card-tag");
const cardMeaning = document.querySelector("#card-meaning");
const cardExample = document.querySelector("#card-example");
const flashcard = document.querySelector("#flashcard");
const progressBar = document.querySelector("#progress-bar");
const masteredCount = document.querySelector("#mastered-count");
const allCount = document.querySelector("#all-count");
const masteredProgress = document.querySelector("#mastered-progress");
const newWordInput = document.querySelector("#new-word");
const scanStatus = document.querySelector("#scan-status");
const uploadCopy = document.querySelector("#upload-copy");
const paperUpload = document.querySelector("#paper-upload");
const paperImage = document.querySelector("#paper-image");
const paperPreview = document.querySelector("#paper-preview");
const dropzone = document.querySelector(".dropzone");

function selectedWords() {
  return words.filter((word) => word.selected);
}

function masteredWords() {
  return words.filter((word) => !word.selected);
}

function renderWords() {
  wordList.innerHTML = "";
  words.forEach((word, index) => {
    const row = document.createElement("button");
    row.type = "button";
    row.dataset.index = String(index + 1).padStart(2, "0");
    row.className = `word-row ${word.tagClass}${word.selected ? " selected" : " mastered"}`;
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
  const mastered = masteredWords();
  selectedCountTop.textContent = current.length;
  selectedCountSide.textContent = current.length;
  reviewTotal.textContent = current.length;
  reviewPosition.textContent = current.length ? reviewIndex + 1 : 0;
  progressBar.style.width = `${Math.min(current.length * 22, 100)}%`;
  masteredCount.textContent = mastered.length;
  allCount.textContent = words.length;
  masteredProgress.style.width = `${words.length ? (mastered.length / words.length) * 100 : 0}%`;

  flashcard.classList.toggle("flipped", showMeaning);

  if (!current.length) {
    cardSource.textContent = "暂无单词";
    cardWord.textContent = "请选择";
    cardHint.textContent = "选择单词后开始复习";
    cardTag.textContent = "完成";
    cardMeaning.textContent = "今天的待复习词已清空";
    cardExample.textContent = "可以从左侧重新选择单词继续复习。";
    return;
  }

  const word = current[reviewIndex % current.length];
  cardSource.textContent = word.source;
  cardWord.textContent = word.text;
  cardHint.textContent = "点击翻转查看释义";
  cardTag.textContent = word.tag;
  cardMeaning.textContent = word.meaning;
  cardExample.textContent = word.example;
}

function render() {
  renderWords();
  renderCard();
}

flashcard.addEventListener("click", () => {
  showMeaning = !showMeaning;
  renderCard();
});

document.querySelector("#show-meaning").addEventListener("click", () => {
  showMeaning = !showMeaning;
  renderCard();
});

document.querySelector("#prev-card").addEventListener("click", () => {
  const current = selectedWords();
  reviewIndex = current.length ? (reviewIndex - 1 + current.length) % current.length : 0;
  showMeaning = false;
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
    example: "例句：补录后可以在下一轮复盘中补充语境。",
    source: "手动添加",
    tag: "待复盘",
    tagClass: "tag-pending",
    selected: true,
  });
  newWordInput.value = "";
  reviewIndex = 0;
  showMeaning = false;
  render();
}

["dragenter", "dragover"].forEach((eventName) => {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropzone.addEventListener(eventName, () => {
    dropzone.classList.remove("is-dragging");
  });
});

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
