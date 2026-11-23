export default function SecondaryHeader() {
  return (
    <div className="w-full flex justify-between bg-black ">
      <h1 className="mb-1 p-4 font-title font-extrabold lg:text-xl text-white lg:pt-10 pl-2">
        Book Nook
      </h1>
      <img
        src="./headerprimary.avif"
        alt="img"
        className="hidden lg:block lg:size-35 mr-10 lg:rounded-full"
      />
    </div>
  );
}
