const Breadcrumb = ({ menuData }: { menuData: { name: string; href: string }[] }) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {menuData.map(({ name, href }, index) => (
          <li className="flex items-center justify-center" key={name}>
            <a href={href} className="flex items-center text-sm font-medium text-gray-700 hover:text-black dark:text-gray-400 dark:hover:text-white">
              {name === "홈" ? (
                <div>
                  <svg className="w-3 h-3 me-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
                  </svg>
                </div>
              ) : (
                <div >
                  <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="m1 9 4-4-4-4" />
                  </svg>
                </div>
              )}
              {name}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
