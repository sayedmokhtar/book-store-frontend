export default function SecondaryHeader() {
  return (
    <div className="w-full  flex justify-between bg-black ">
      <h1 className="font-title font-extrabold text-xl text-white pt-14 pl-2">
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
