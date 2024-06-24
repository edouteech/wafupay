import { ChangeEvent, useRef, FC, MouseEvent } from "react";

interface UploadButtonProps {
  text: string;
  onUpload: (file: File) => void;
}

const UploadButton: FC<UploadButtonProps> = ({ text, onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    fileInputRef.current?.click();
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="flex items-center">
      <button
        className="bg-gray-200 p-4 rounded-md flex items-center justify-center"
        onClick={handleClick}
      >
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
        </svg>
        <span className="mt-2 text-sm text-center">{text}</span>
      </button>
      <input
        type="file"
        className="hidden"
        ref={fileInputRef}
        onChange={handleChange}
        accept="image/*"
      />
    </div>
  );
};

export default UploadButton;
