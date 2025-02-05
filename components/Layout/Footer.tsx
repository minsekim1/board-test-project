import getPackajsonVersion from "@components/constant/getPackajsonVersion";

export default function Footer() {
  const version = getPackajsonVersion();

  return (
    <footer className="pt-20 pb-20 dark:bg-gray-800" style={{ background: "#34393f", color: "white", display: "flex", textAlign: "center" }}>
      <div className="mx-auto max-w-screen-xl">
        <div className="">
          <div className="mb-6 md:mb-6" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <a href="https://flowbite.com" className="flex items-center">
              <img src="/logo.png" className="mr-3 h-8" alt="FlowBite Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Board Test Project</span>
            </a>
          </div>
          <div>Board Test Project - 테스트용 게시판 프로젝트</div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-2">
            <div>

              {/* <h2 className="mb-6 text-sm font-bold text-white uppercase dark:text-white">Follow us</h2> */}
              <ul className="text-white dark:text-white">
                <li>
                  <button className="hover:underline ">
                    디스코드
                  </button>
                </li>
              </ul>
            </div>
            <div>
              
              {/* <h2 className="mb-6 text-sm font-bold text-white uppercase dark:text-white">Legal</h2> */}
              <ul className="text-white dark:text-white">
                <li>
                  <button className="hover:underline">
                    트위터
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <div className="mt-10">
          <span className="text-sm text-white sm:text-center dark:text-white">
            © 2025{" "}
            <a href="https://localhost:3000" className="hover:underline">
              localhost:3000
            </a>
            . All Rights Reserved.
          </span>

          <div className="mt-1">
            <a href="/policy/privacy" target="_blank" className="hover:underline">
              Privacy Policy
            </a>
            &nbsp;|&nbsp;
            <a href="/policy/service" target="_blank" className="hover:underline">
              Terms &amp; Conditions
            </a>
          </div>

          <div className="flex mt-4 justify-center gap-4" style={{ alignItems: "center" }}>
            <a
              href="#"
              className="text-gray-500 hover:text-white  dark:hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="페이스북에 공유하기"
            >
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-white dark:hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="트위터에 공유하기"
            >
              <svg width="26" height="26" viewBox="0 0 18 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.1761 0H16.9362L10.9061 7.62462L18 18H12.4456L8.09512 11.7074L3.11723 18H0.355444L6.80517 9.84462L0 0H5.69545L9.62787 5.75169L14.1761 0ZM13.2073 16.1723H14.7368L4.86441 1.73169H3.2232L13.2073 16.1723Z" />
              </svg>
            </a>
            <a
              href="#"
              target="_blank"
              className="text-gray-500 hover:text-white dark:hover:text-white"
              rel="noopener noreferrer"
              aria-label="네이버 밴드에 공유하기"
            >
              <svg fill="currentColor" width="36" height="36" viewBox="0 0 24 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 4.21796C6.86701 4.21796 6.24361 4.29869 5.64898 4.46014V3.11806V2.95661C5.64898 2.92634 5.64898 2.88597 5.63939 2.8557C5.5243 1.2109 4.30627 0 2.82928 0C1.34271 0 0.12468 1.2109 0.00959079 2.8557C0 2.89606 0 8.47629 0 8.47629V12.109C0 12.1393 0 12.1594 0 12.1897C0.0383632 16.5086 3.38555 20.0101 7.5 20.0101C11.6432 20.0101 15 16.4783 15 12.1191C15 7.74975 11.6432 4.21796 7.5 4.21796ZM7.5 18.7891C3.99936 18.7891 1.1509 15.7921 1.1509 12.109V3.01715C1.1509 2.03835 1.89898 1.24117 2.82928 1.24117C3.75 1.24117 4.50767 2.03835 4.50767 3.01715V12.0283C4.50767 13.774 5.85038 15.2674 7.50959 15.2674C9.1688 15.2674 10.5115 13.8547 10.5115 12.109C10.5115 10.3633 9.1688 8.95056 7.50959 8.95056C6.80946 8.95056 6.17647 9.20283 5.65857 9.61655V8.25429C6.21483 7.96166 6.83824 7.79011 7.50959 7.79011C9.77302 7.79011 11.6049 9.71746 11.6049 12.0989C11.6049 14.4803 9.77302 16.4077 7.50959 16.4077C5.24616 16.4077 3.41432 14.4803 3.41432 12.0989V2.95661C3.41432 2.66398 3.15537 2.38143 2.83887 2.38143C2.52238 2.38143 2.26343 2.66398 2.26343 2.95661V12.109C2.26343 12.2503 2.27302 12.3814 2.28261 12.5227C2.48402 15.3784 4.74744 17.6388 7.51918 17.6388C10.4156 17.6388 12.7653 15.1665 12.7653 12.1191C12.7653 9.07165 10.4156 6.5994 7.51918 6.5994C6.86701 6.5994 6.24361 6.72049 5.66816 6.95257V5.7114C6.2532 5.51968 6.8766 5.41877 7.51918 5.41877C11.0294 5.41877 13.8683 8.40565 13.8683 12.0989C13.8491 15.7921 11.0102 18.7891 7.5 18.7891ZM5.64898 12.109C5.64898 11.0394 6.47379 10.1615 7.5 10.1615C8.51662 10.1615 9.35102 11.0293 9.35102 12.109C9.35102 13.1786 8.52622 14.0565 7.5 14.0565C6.48338 14.0464 5.64898 13.1786 5.64898 12.109Z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-10">v.{version}</div>
      </div>
    </footer>
  );
}
