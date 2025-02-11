import dynamic from "next/dynamic";
import { useState } from "react";

// ReactQuill을 dynamic import로 불러와서 SSR을 비활성화
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const Editor = () => {
  const [editorValue, setEditorValue] = useState("");

  const handleChange = (value: string) => {
    setEditorValue(value);
  };

  return (
    <div>
      <h2>텍스트 편집기</h2>
      <ReactQuill
        value={editorValue}
        onChange={handleChange}
        theme="snow"
        modules={{
          toolbar: [[{ header: "1" }, { header: "2" }, { font: [] }], [{ list: "ordered" }, { list: "bullet" }], ["bold", "italic", "underline"], ["link"], [{ align: [] }], ["clean"]],
        }}
      />
      <div>
        <h3>편집된 내용</h3>
        <div>{editorValue}</div>
      </div>
    </div>
  );
};

export default Editor;
