import { ChangeEvent } from "react";

interface LabelledInputType {
  label: string;
  type: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const LabelledInput = ({
  label,
  type,
  placeholder,
  onChange,
}: LabelledInputType) => {
  return (
    <div className="mt-4 w-full">
      <p>{label}</p>
      <input
        type={type}
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        onChange={onChange}
        required
      />
    </div>
  );
};

export default LabelledInput;
