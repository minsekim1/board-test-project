import { useEffect, useState } from "react";

const NumberInput = ({ onSubmit }: { onSubmit?: (value: string) => void }) => {
  const [values, setValues] = useState<string[]>(Array(6).fill(""));

  useEffect(() => {
    if (values.every((value) => value.length === 1)) handleSubmit();
  }, [values]);

  const handleSubmit = () => {
    if (onSubmit) onSubmit(values.join(""));
  };

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValues = [...values];
    newValues[index] = e.target.value;
    setValues(newValues);
  };

  const focusNextInput = (index: number, direction: "next" | "prev") => {
    const targetIndex = direction === "next" ? index + 1 : index - 1;
    const inputs = document.querySelectorAll("[data-focus-input-init]");
    if (inputs[targetIndex]) (inputs[targetIndex] as HTMLInputElement).focus();
  };

  const handleKeyUp = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const { value, key } = e.target as any;
    const isPrev = key === "Backspace" && !value && index > 0 ? "prev" : value.length === 1 && index < 5 ? "next" : null;
    if (isPrev) focusNextInput(index, isPrev);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pasteData = e.clipboardData?.getData("text") || "";
    const digits = pasteData.replace(/\D/g, "");
    const newValues = [...values];
    digits.split("").forEach((digit, i) => {
      if (newValues[index + i] !== undefined) newValues[index + i] = digit;
    });
    setValues(newValues);
  };

  return (
    <form className="max-w-sm mx-auto flex justify-center">
      <div className="flex mb-2 space-x-2 rtl:space-x-reverse">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index}>
            <label htmlFor={`code-${index + 1}`} className="sr-only">
              {`${index + 1}th code`}
            </label>
            <input
              type="text"
              maxLength={1}
              value={values[index]}
              onChange={(e) => handleChange(index, e)}
              onKeyUp={(e) => handleKeyUp(index, e)}
              onPaste={(e) => handlePaste(e, index)}
              id={`code-${index + 1}`}
              data-focus-input-init
              data-focus-input-prev={`code-${index}`}
              data-focus-input-next={`code-${index + 2}`}
              className="block w-9 h-9 py-3 text-sm font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              required
            />
          </div>
        ))}
      </div>
    </form>
  );
};

export default NumberInput;
