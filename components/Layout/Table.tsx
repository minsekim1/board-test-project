import { css } from "@emotion/react";
import { AiOutlineEye, AiOutlineLike } from "react-icons/ai";

const Table = ({
  list,
  isSearch = false,
  hiddenHeader = false,
  onClickRow,
}: {
  list: { id: number; title: string; author: string; created_at: string; view_count: number; like_count: number; comment_count: number }[];
  isSearch?: boolean;
  hiddenHeader?: boolean;
  onClickRow?: (id: number) => void;
}) => {
  return (
    <div css={TableStyle}>
      <div className={`w-full relative sm:rounded-lg ${hiddenHeader ? "" : "shadow-sm"}`}>
        <div className={`flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between ${hiddenHeader ? "" : "pb-4"}`}>
          <div>
            {/* <button
              id="dropdownRadioButton"
              data-dropdown-toggle="dropdownRadio"
              className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
              type="button"
            >
              <svg className="w-3 h-3 text-gray-500 dark:text-gray-400 me-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm3.982 13.982a1 1 0 0 1-1.414 0l-3.274-3.274A1.012 1.012 0 0 1 9 10V6a1 1 0 0 1 2 0v3.586l2.982 2.982a1 1 0 0 1 0 1.414Z" />
              </svg>
              Last 30 days
              <svg className="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
            </button> */}
            {/* <div
              id="dropdownRadio"
              className="z-10 hidden w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
              data-popper-reference-hidden=""
              data-popper-escaped=""
              data-popper-placement="top"
              style={{
                position: "absolute",
                inset: "auto auto 0px 0px",
                margin: 0,
                transform: "translate3d(522.5px, 3847.5px, 0px)",
              }}
            >
              <ul className="p-3 space-y-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownRadioButton">
                <li>
                  <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      checked={false}
                      id="filter-radio-example-1"
                      type="radio"
                      value=""
                      name="filter-radio"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="filter-radio-example-1" className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                      Last day
                    </label>
                  </div>
                </li>
                <li>
                  <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      checked={false}
                      id="filter-radio-example-2"
                      type="radio"
                      value=""
                      name="filter-radio"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="filter-radio-example-2" className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                      Last 7 days
                    </label>
                  </div>
                </li>
                <li>
                  <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      checked={false}
                      id="filter-radio-example-3"
                      type="radio"
                      value=""
                      name="filter-radio"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="filter-radio-example-3" className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                      Last 30 days
                    </label>
                  </div>
                </li>
                <li>
                  <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      checked={false}
                      id="filter-radio-example-4"
                      type="radio"
                      value=""
                      name="filter-radio"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="filter-radio-example-4" className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                      Last month
                    </label>
                  </div>
                </li>
                <li>
                  <div className="flex items-center p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-600">
                    <input
                      checked={false}
                      id="filter-radio-example-5"
                      type="radio"
                      value=""
                      name="filter-radio"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="filter-radio-example-5" className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300">
                      Last year
                    </label>
                  </div>
                </li>
              </ul>
            </div> */}
          </div>
          {isSearch && (
            <>
              <label htmlFor="table-search" className="sr-only">
                Search
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 rtl:inset-r-0 rtl:right-0 flex items-center ps-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path>
                  </svg>
                </div>
                <input
                  type="text"
                  id="table-search"
                  className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="검색어"
                />
              </div>
            </>
          )}
        </div>
        <table className="w-full text-sm text-center rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-800 uppercase dark:text-gray-400" style={{ top: hiddenHeader ? "-9999px" : undefined, visibility: hiddenHeader ? "collapse" : undefined }}>
            <tr>
              {!hiddenHeader && (
                <th scope="col" className="px-4 py-3 whitespace-pre text-center">
                  번호
                </th>
              )}
              <th scope="col" className="px-4 py-3 whitespace-pre text-center w-full">
                제목
              </th>
              <th scope="col" className="px-4 py-3 whitespace-pre text-center">
                글쓴이
              </th>
              {!hiddenHeader && (
                <th scope="col" className="px-4 py-3 whitespace-pre text-center">
                  날짜
                </th>
              )}
              <th scope="col" className="px-4 py-3 whitespace-pre text-center">
                조회
              </th>
              <th scope="col" className="px-3 py-3 whitespace-pre text-center">
                추천
              </th>
            </tr>
          </thead>
          <tbody>
            {list.length == 0 ? (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                {!hiddenHeader && <td className="p-3 text-gray-700"></td>}
                <th className="p-3 pl-2 text-left font-medium text-gray-800 whitespace-nowrap dark:text-white">게시물이 없습니다.</th>
                <td className="text-gray-900"></td>
                {!hiddenHeader && <td className="whitespace-pre text-gray-700"></td>}
                <td className="text-gray-700"></td>
                <td className="text-gray-700"></td>
              </tr>
            ) : (
              list.map(({ id, title, author, created_at, view_count, like_count, comment_count }, index) => (
                <tr
                  className={`bg-white dark:bg-gray-800 dark:border-gray-700${onClickRow ? " hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer" : ""}${!hiddenHeader ? " border-b" : index === list.length - 1 ? "" : " border-b"}`}
                  key={id + "-" + index}
                  onClick={() => (onClickRow ? onClickRow(id) : onClickRow)}
                >
                  {!hiddenHeader && <td className="p-3 text-gray-700">{id}</td>}
                  <td className="grid grid-flow-col gap-2 p-3 pl-2 grid-cols-1 text-left font-medium text-gray-800 dark:text-white">
                    <div className="" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>
                      {title}
                    </div>
                    {!comment_count ? null : <span className="flex items-center text-orange-400 font-bold">+{comment_count}</span>}
                  </td>
                  <td className="text-gray-900 whitespace-pre">{author}</td>
                  {!hiddenHeader && <td className="whitespace-pre text-gray-700">{created_at}</td>}
                  <td className="text-gray-700 text-center">
                    <div className="flex items-center justify-center">
                      {hiddenHeader && <AiOutlineEye className="text-gray-500 mr-2 text-sm" />}
                      {view_count}
                    </div>
                  </td>

                  <td className="text-gray-700 text-center">
                    <div className="flex items-center justify-center">
                      {hiddenHeader && <AiOutlineLike className="text-gray-500 mr-2 text-sm" />}
                      {like_count}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;

const TableStyle = css`
  table thead {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
    border-top: 2px solid black;
  }
`;
