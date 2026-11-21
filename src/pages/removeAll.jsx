import Header from "../components/headerLogin";
import Footer from "../components/footer";
import RemoveButton from "../components/removeButton";
export default function RemoveALL() {
  return (
    <>
      <Header />
      <div className="w[90%] ml-[5%] flex flex-col mt-10 animate-slide-in lg:w-[50%] lg:ml-[25%]">
        <span className="flex gap-2 animate-bounce items-center w-full mb-5">
          <h2 className="text-white ml-[25%] text-sm font-body font-bold lg:text-lg">
            Any Action Will Delete All Data
          </h2>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-6 text-white"
          >
            <path
              fill-rule="evenodd"
              d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
        <RemoveButton value={"Remove Books"} />
        <RemoveButton value={"Remove Authors"} />
        <RemoveButton value={"Remove Users"} />
      </div>
      <div className="w-[80%] ml-[10%] mt-10 border-8 rounded-2xl border-purple-500 shadow-xl shadow-blue-50">
        <video src="/earthtoland.mp4" muted autoPlay loop playsInline></video>
      </div>
      <Footer />
    </>
  );
}
