import Logo from "../../ui/logos/Logo";
import { Link } from "react-router-dom";
import UserAvatar from "../../ui/avatar/UserAvatar";
import { ImHome } from "react-icons/im";
import { BsFillCupHotFill } from "react-icons/bs";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between">
      <Logo src={"/assets/logo/projecs.webp"} alt="art" width="300" />
      <div className="flex gap-2">
        <Link
          to={"/"}
          className="w-10 h-10 border-2 border-gray-400 rounded flex items-center justify-center hover:bg-gray-200">
          <BsFillCupHotFill className="w-7 h-7 p-0.5 bg-gray-200 text-[#02356A]" />

          {/* <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7 bg-gray-200 text-[#02356A] ">
            <path
              d="M22.5 52.5H37.5"
              stroke="#072A57"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M30 52.5V40"
              stroke="#072A57"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <mask id="path-4-inside-1_353_837" fill="white">
              <path d="M12.5 22C12.5 21.0572 12.5 20.5858 12.7929 20.2929C13.0858 20 13.5572 20 14.5 20H45.5C46.4428 20 46.9142 20 47.2071 20.2929C47.5 20.5858 47.5 21.0572 47.5 22V30.5C47.5 36.1569 47.5 38.9853 45.7426 40.7426C43.9853 42.5 41.1569 42.5 35.5 42.5H24.5C18.8431 42.5 16.0147 42.5 14.2574 40.7426C12.5 38.9853 12.5 36.1569 12.5 30.5V22Z" />
            </mask>
            <path
              d="M12.5 22C12.5 21.0572 12.5 20.5858 12.7929 20.2929C13.0858 20 13.5572 20 14.5 20H45.5C46.4428 20 46.9142 20 47.2071 20.2929C47.5 20.5858 47.5 21.0572 47.5 22V30.5C47.5 36.1569 47.5 38.9853 45.7426 40.7426C43.9853 42.5 41.1569 42.5 35.5 42.5H24.5C18.8431 42.5 16.0147 42.5 14.2574 40.7426C12.5 38.9853 12.5 36.1569 12.5 30.5V22Z"
              stroke="#072A57"
              strokeWidth="4"
              strokeLinecap="round"
              mask="url(#path-4-inside-1_353_837)"
            />
            <path
              d="M29.0385 29.7253C28.8868 30.2563 29.1942 30.8098 29.7253 30.9615C30.2563 31.1132 30.8098 30.8058 30.9615 30.2747L30 30L29.0385 29.7253ZM34.7305 13.4432L33.7818 13.127L33.775 13.1476L33.769 13.1685L34.7305 13.4432ZM35.9108 12.1357L35.5394 11.2072L35.9108 12.1357ZM34.7305 13.4432L35.6792 13.7594L35.6861 13.7388L35.692 13.7179L34.7305 13.4432ZM35.0845 12.5763L35.8268 13.2463L35.8268 13.2463L35.0845 12.5763ZM30 30L30.9615 30.2747L35.692 13.7179L34.7305 13.4432L33.769 13.1685L29.0385 29.7253L30 30ZM35.9108 12.1357L36.2822 13.0642L47.8714 8.42848L47.5 7.5L47.1286 6.57152L35.5394 11.2072L35.9108 12.1357ZM34.7305 13.4432L35.6792 13.7594L35.6792 13.7594L34.7305 13.4432L33.7818 13.127L33.7818 13.127L34.7305 13.4432ZM34.7305 13.4432L35.692 13.7179C35.7629 13.47 35.7995 13.3451 35.8328 13.2579C35.8593 13.1885 35.8599 13.2096 35.8268 13.2463L35.0845 12.5763L34.3422 11.9062C33.9947 12.2911 33.8743 12.7998 33.769 13.1685L34.7305 13.4432ZM35.9108 12.1357L35.5394 11.2072C35.1834 11.3496 34.6896 11.5213 34.3422 11.9062L35.0845 12.5763L35.8268 13.2463C35.7937 13.283 35.7726 13.2846 35.8389 13.2512C35.9223 13.2091 36.0428 13.1599 36.2822 13.0642L35.9108 12.1357Z"
              fill="#072A57"
            />
          </svg> */}
        </Link>
        <Link
          to={"/"}
          className="w-10 h-10 border-2 border-gray-400 rounded flex items-center justify-center hover:bg-gray-200">
          <ImHome className="w-7 h-7 p-0.5 bg-gray-200 text-[#02356A] " />
        </Link>
        <UserAvatar />
      </div>
    </div>
  );
};

export default Navbar;
