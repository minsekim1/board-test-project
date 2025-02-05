import { css } from "@emotion/react";

export default function Divider({ className, disableIcon = false }: { className?: string; disableIcon?: boolean }) {
  return (
    <div css={DividerStyle} className="inline-flex items-center justify-center w-full">
      <hr className={`w-full my-8 bg-gray-200 border-0 rounded dark:bg-gray-700 ${className}`} style={{ height: 1 }} />
      <div className="icon absolute px-4 -translate-x-1/2 bg-white left-1/2 dark:bg-gray-900">
        {!disableIcon && (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4 text-gray-700 dark:text-gray-300" aria-hidden="true" fill="#b8b8b8">
            <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
          </svg>
        )}
      </div>
    </div>
  );
}

const DividerStyle = css`
  .icon {
    border-radius: 50%;
    border: 1px solid #e5e7eb;
    padding: 0.25rem;
  }
  width: 100%;
  hr {
    height: 0.25px;
  }
`;
