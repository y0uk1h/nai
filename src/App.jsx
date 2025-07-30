import { useEffect, useRef, useState } from "react";
import { TextArea } from "./TextArea";
import { chat } from "./ai";

const DEFAULT_TEMPLATE = [
  "日報（ここに日付）",
  "本日の作業内容：",
  "- ",
  "- ",
  "- ",
  "明日の作業内容：",
  "- ",
  "- ",
  "- ",
  "申し送り事項：",
  "- ",
  "- ",
  "- ",
  "その他：",
  "なし",
  "",
  "以上、ご査収ください。",
].join("\n");

export const App = () => {
  const [disabled, setDisabled] = useState(false);
  const [a, b, c, d, e] = [useRef(), useRef(), useRef(), useRef(), useRef()];
  useEffect(() => {
    const template = localStorage.getItem("nai-template");
    if (template) a.current?.(template);
    else a.current(DEFAULT_TEMPLATE);
  }, []);
  const handleSubmit = () => {
    const [aa, bb, cc, dd] = [
      a.current?.(),
      b.current?.(),
      c.current?.(),
      d.current?.(),
    ];
    const template = aa ? aa : DEFAULT_TEMPLATE;
    const resultForm = e.current;
    if (bb === "" || cc === "") {
      alert(
        "今日何をして、明日何をするかぐらい、\n愚痴っぽくてもいいから書いてください"
      );
      return;
    }
    const prompt = [
      "下記の情報から、仕事の文面らしく日報を作成してください。",
      "",
      "今日の作業：",
      bb,
      "明日の予定：",
      cc,
      ...(dd ? ["余談・備考：", dd] : []),
      "本日の日付：",
      new Date().toLocaleDateString(),
      "",
      "-- テンプレートまたは前回の日報 --",
      template,
    ].join("\n");
    localStorage.setItem("nai-template", template);
    setDisabled(true);
    chat(prompt)
      .then((res) => {
        console.log({ prompt, res });
        resultForm(res);
      })
      .catch((error) => {
        alert("エラーが発生しました");
        resultForm(error.toString());
        console.log({ prompt, error });
      })
      .finally(() => {
        setDisabled(false);
      });
  };
  return (
    <>
      <div className="container">
        <hr />
        <pre>
          {[
            "-- 初期設定",
            "1. Hugging Face API からトークンを取得する",
            `2. localStorage.setItem("nai-token", ここにトークン) を実行する`,
            "3. リロードする",
            "",
            "-- 使い方",
            "1. 「今日何をしたか」と「明日何をするか」を必ず埋める",
            "2. 「生成」をクリック",
            "3. 「生成結果」に出力結果が表示されるので、よしなにする",
            "",
            `-- ${
              localStorage.getItem("nai-token")
                ? "使用可能"
                : "初期設定が必要です"
            } --`,
          ].join("\n")}
        </pre>
        <TextArea
          ref={a}
          id="a"
          name="テンプレートまたは、前回の日報をコピペ"
          rows={10}
        />
        <TextArea ref={b} id="b" name="今日何をしたか" />
        <TextArea ref={c} id="c" name="明日何をするか" />
        <TextArea ref={d} id="d" name="余談・備考" />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleSubmit}
          disabled={disabled}
          style={{ marginRight: 8 }}
        >
          {disabled ? "生成中..." : "生成"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => localStorage.setItem("nai-template", a.current?.())}
        >
          テンプレを保存する
        </button>
        <hr />
        <TextArea ref={e} id="e" name="生成結果" rows={10} />
      </div>
    </>
  );
};
