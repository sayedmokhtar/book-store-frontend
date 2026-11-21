export default function SuccessMessage({ successMessage }) {
  return (
    <>
      {successMessage && (
        <div className="w-[60%] h-15 rounded-lg ml-[20%] mt-10 bg-green-700">
          <p className="text-sm py-2 pl-2 font-body font-bold text-white lg:text-lg">
            {successMessage}
          </p>
        </div>
      )}
    </>
  );
}
