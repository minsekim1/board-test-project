import { css } from "@emotion/react";
import { useState } from "react";

const Tab = ({ tabData = [], children = <></> }: { tabData?: { name: string; listHref?: string; writeHref?: string }[]; children?: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState(0);

  const onClickTabHeader = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div css={TabStyle}>
      <div className="border-b border-gray-200 dark:border-gray-700">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" data-tabs-toggle="#default-tab-content" role="tablist">
          {tabData.map(({ name }, index) => (
            <li className="tab-header me-2" role="presentation" key={index}>
              <button
                css={ActiveTabStyle(activeTab === index, index === 0)}
                className={`tab hover:text-black text-black`}
                data-tabs-target={`#tab-${index}`}
                type="button"
                // role="tab"
                aria-controls={name}
                aria-selected={activeTab === index}
                onClick={() => onClickTabHeader(index)}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div id="tab-content" className="p-4 gap-5 flex flex-col">
        {/* 여러 탭이 있을 때, 각 탭의 내용을 표시 */}
        {Array.isArray(children) ? (
          children.map((child, index) => (
            <div
              style={{ display: activeTab === index ? "block" : "none" }}
              className="rounded-lg dark:bg-gray-800"
              id={tabData[index].name}
              role="tabpanel"
              aria-labelledby={tabData[index].name}
              key={tabData[index].name + index}
            >
              {child}
            </div>
          ))
        ) : (
          <div style={{ display: activeTab === 0 ? "block" : "none" }} className="rounded-lg dark:bg-gray-800" id={tabData[0].name} role="tabpanel" aria-labelledby={tabData[0].name}>
            {children}
          </div>
        )}
        <div className="flex flex-row">
          {tabData[activeTab].listHref && (
            <a href={tabData[activeTab].listHref} className="font-thin text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 border">
              {">"} 더보기
            </a>
          )}
          {tabData[activeTab].writeHref && (
            <a href={tabData[activeTab].writeHref} className="ml-4 font-thin text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 border">
              {">"} 새 게시물 작성
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tab;

const TabStyle = css`
  .tab {
    font-size: 1em;
    padding: 10px 15px;
  }
  .tab-header:last-child {
    /* border-right: 1px solid #e2e8f0; */
  }
  li.me-2 {
    margin-right: 0px;
  }
  #tab-content {
    border-right: 1px solid #e2e8f0;
    border-bottom: 1px solid #e2e8f0;
    border-left: 1px solid #e2e8f0;
  }
`;

const ActiveTabStyle = (isActive: boolean, isFirst: boolean) => css`
  background-color: ${isActive ? "white" : "#f7fafc"};
  border-top-width: ${isActive ? "4px" : "1px"};
  /* border: 1px solid ${isActive ? "#e2e8f0" : "#e2e8f0"}; */
  border-bottom-color: ${isActive ? "white" : "#e2e8f0"};
  color: ${isActive ? "black" : "gray"};
  border-top: ${isActive ? "2px solid black" : "1px solid #e2e8f0"};

  border-left: ${isFirst ? "1px solid #e2e8f0" : "none"};
  border-right: 1px solid #e2e8f0;

  &:hover {
    font-weight: 600;
  }
`;
