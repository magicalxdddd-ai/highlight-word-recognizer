"use client";

import { ChangeEvent, useMemo, useState } from "react";

type Word = {
  text: string;
  meaning: string;
  source: string;
  tag: string;
  selected: boolean;
};

const initialWords: Word[] = [
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

export default function Home() {
  const [words, setWords] = useState<Word[]>(initialWords);
  const [preview, setPreview] = useState<string | null>(null);
  const [scanState, setScanState] = useState<"idle" | "scanning" | "done">(
    "idle",
  );
  const [newWord, setNewWord] = useState("");
  const [reviewIndex, setReviewIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);

  const selectedWords = useMemo(
    () => words.filter((word) => word.selected),
    [words],
  );
  const currentWord =
    selectedWords[reviewIndex % Math.max(selectedWords.length, 1)];

  function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setScanState("scanning");
    window.setTimeout(() => {
      setScanState("done");
      setWords((current) =>
        current.map((word, index) => ({
          ...word,
          selected: index < 3 ? true : word.selected,
        })),
      );
    }, 900);
  }

  function toggleWord(text: string) {
    setWords((current) =>
      current.map((word) =>
        word.text === text ? { ...word, selected: !word.selected } : word,
      ),
    );
  }

  function addWord() {
    const normalized = newWord.trim();
    if (!normalized) return;
    setWords((current) => [
      {
        text: normalized,
        meaning: "待补充释义",
        source: "手动添加",
        tag: "待复盘",
        selected: true,
      },
      ...current,
    ]);
    setNewWord("");
    setReviewIndex(0);
  }

  function nextCard() {
    setShowMeaning(false);
    setReviewIndex((index) =>
      selectedWords.length ? (index + 1) % selectedWords.length : 0,
    );
  }

  return (
    <main className="app-shell">
      <section className="workspace">
        <header className="topbar">
          <div className="brand-lockup">
            <span className="brand-mark">研</span>
            <div>
              <p className="eyebrow">考研英语阅读复盘</p>
              <h1>研词荧光</h1>
            </div>
          </div>
          <div className="top-actions" aria-label="复习概览">
            <span>2026 阅读词库</span>
            <strong>{selectedWords.length} 个待复习</strong>
          </div>
        </header>

        <section className="scanner-panel" aria-label="高光单词提取工作台">
          <div className="upload-card hero-card">
            <div className="upload-head">
              <div>
                <p className="section-label">卷面扫描</p>
                <h2>今日阅读复盘</h2>
                <p className="muted-copy">第二套试卷 · 阅读一至四 · 黄笔标记</p>
              </div>
              <span className={`status ${scanState}`}>
                {scanState === "idle"
                  ? "待上传"
                  : scanState === "scanning"
                    ? "识别中"
                    : "已整理"}
              </span>
            </div>

            <label className="dropzone">
              <input accept="image/*" type="file" onChange={handleUpload} />
              {preview ? (
                <img src={preview} alt="上传的阅读卷面" />
              ) : (
                <div className="paper-preview" aria-hidden="true">
                  <div className="paper-title" />
                  <div className="paper-line wide" />
                  <div className="paper-line" />
                  <mark className="highlight one">concession</mark>
                  <div className="paper-line short" />
                  <div className="paper-line wide" />
                  <mark className="highlight two">skeptical</mark>
                  <div className="paper-line" />
                  <mark className="highlight three">insulate</mark>
                </div>
              )}
              <span className="drop-copy">
                {preview ? "更换照片" : "上传试卷照片"}
              </span>
            </label>

            <div className="scan-summary" aria-label="识别摘要">
              <span>
                <strong>21</strong>
                高光区域
              </span>
              <span>
                <strong>4</strong>
                篇阅读
              </span>
              <span>
                <strong>92%</strong>
                识别置信度
              </span>
            </div>
          </div>

          <div className="word-card dock-card">
            <div className="section-heading">
              <p className="section-label">提取结果</p>
              <strong>{selectedWords.length} 个待复习词</strong>
            </div>
            <div className="filter-pills" aria-label="词库筛选">
              <span className="active">全部</span>
              <span>熟词生义</span>
              <span>态度词</span>
            </div>

            <div className="word-list">
              {words.map((word) => (
                <button
                  className={`word-row ${word.selected ? "selected" : ""}`}
                  key={word.text}
                  onClick={() => toggleWord(word.text)}
                  type="button"
                >
                  <span>
                    <strong>{word.text}</strong>
                    <small>{word.source}</small>
                  </span>
                  <em>{word.tag}</em>
                </button>
              ))}
            </div>

            <div className="add-word">
              <input
                aria-label="补录单词"
                onChange={(event) => setNewWord(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") addWord();
                }}
                placeholder="漏识别的词"
                value={newWord}
              />
              <button onClick={addWord} type="button">
                补录
              </button>
            </div>
          </div>
        </section>

        <section className="study-grid">
          <div className="review-card">
            <div className="section-heading">
              <p className="section-label">电子复习</p>
              <strong>
                {selectedWords.length ? reviewIndex + 1 : 0}/
                {selectedWords.length}
              </strong>
            </div>
            {currentWord ? (
              <button
                className="flashcard"
                onClick={() => setShowMeaning((visible) => !visible)}
                type="button"
              >
                <span>{currentWord.source}</span>
                <strong>{currentWord.text}</strong>
                <small>
                  {showMeaning ? currentWord.meaning : `${currentWord.tag} · 点一下看释义`}
                </small>
              </button>
            ) : (
              <div className="flashcard empty">选择单词后开始复习</div>
            )}
            <div className="review-actions">
              <button onClick={nextCard} type="button">
                下一张
              </button>
              <button
                onClick={() => setShowMeaning((visible) => !visible)}
                type="button"
              >
                显示释义
              </button>
            </div>
          </div>

          <div className="insight-panel">
            <div className="section-heading">
              <p className="section-label">本次复盘</p>
              <strong>72%</strong>
            </div>
            <div className="metric-row">
              <span>高频错因</span>
              <strong>熟词生义</strong>
            </div>
            <div className="metric-row">
              <span>建议节奏</span>
              <strong>每天 18 词</strong>
            </div>
            <div className="metric-row">
              <span>复习方式</span>
              <strong>卷面来源 + 卡片记忆</strong>
            </div>
            <div className="progress-track">
              <span style={{ width: `${Math.min(selectedWords.length * 22, 100)}%` }} />
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
