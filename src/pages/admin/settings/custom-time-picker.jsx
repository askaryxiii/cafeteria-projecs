import { useState, useRef, useEffect } from "react";
import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";

const CustomTimePicker = ({ value, onChange, label }) => {
  const hourDivRef = useRef(null);
  const minuteDivRef = useRef(null);

  const [hour, setHour] = useState("00");
  const [minute, setMinute] = useState("00");

  // ✅ Sync when parent updates value (API loaded)
  useEffect(() => {
    if (!value) return;
    const [h, m] = value.split(":");
    setHour(h);
    setMinute(m);
  }, [value]);

  const handleHourChange = (amount) => {
    setHour((prevHour) => {
      let newHour = parseInt(prevHour) + amount;

      // Wrap around: 0-23 for 24-hour format
      if (newHour < 0) {
        newHour = 23;
      } else if (newHour > 23) {
        newHour = 0;
      }

      const formattedHour = String(newHour).padStart(2, "0");

      // Update parent with new time
      if (onChange) {
        onChange(`${formattedHour}:${minute}`);
      }

      return formattedHour;
    });
  };

  const handleMinuteChange = (amount) => {
    setMinute((prevMinute) => {
      let newMinute = parseInt(prevMinute) + amount;

      // Wrap around: 0-59 for minutes
      if (newMinute < 0) {
        newMinute = 59;
      } else if (newMinute > 59) {
        newMinute = 0;
      }

      const formattedMinute = String(newMinute).padStart(2, "0");

      // Update parent with new time
      if (onChange) {
        onChange(`${hour}:${formattedMinute}`);
      }

      return formattedMinute;
    });
  };

  const handleWheel = (e, isHour) => {
    e.preventDefault();
    const isScrollingDown = e.deltaY > 0;
    if (isHour) {
      handleHourChange(isScrollingDown ? -1 : 1);
    } else {
      handleMinuteChange(isScrollingDown ? -1 : 1);
    }
  };

  // Touch support for mobile
  const handleTouchStart = useRef({ y: 0 });
  const handleTouchMove = (e, isHour) => {
    if (!handleTouchStart.current) return;

    const currentY = e.touches[0].clientY;
    const deltaY = handleTouchStart.current.y - currentY;

    // Threshold for detecting swipe (at least 10px movement)
    if (Math.abs(deltaY) > 10) {
      if (isHour) {
        handleHourChange(deltaY > 0 ? 1 : -1);
      } else {
        handleMinuteChange(deltaY > 0 ? 1 : -1);
      }
      handleTouchStart.current.y = currentY;
    }
  };

  const handleTouchEnd = () => {
    handleTouchStart.current = { y: 0 };
  };

  useEffect(() => {
    const hourDiv = hourDivRef.current;
    const minuteDiv = minuteDivRef.current;

    if (hourDiv) {
      hourDiv.addEventListener("wheel", (e) => handleWheel(e, true), {
        passive: false,
      });
      hourDiv.addEventListener("touchstart", (e) => {
        handleTouchStart.current = { y: e.touches[0].clientY };
      });
      hourDiv.addEventListener("touchmove", (e) => handleTouchMove(e, true), {
        passive: true,
      });
      hourDiv.addEventListener("touchend", handleTouchEnd);
    }

    if (minuteDiv) {
      minuteDiv.addEventListener("wheel", (e) => handleWheel(e, false), {
        passive: false,
      });
      minuteDiv.addEventListener("touchstart", (e) => {
        handleTouchStart.current = { y: e.touches[0].clientY };
      });
      minuteDiv.addEventListener(
        "touchmove",
        (e) => handleTouchMove(e, false),
        {
          passive: true,
        }
      );
      minuteDiv.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (hourDiv) {
        hourDiv.removeEventListener("wheel", handleWheel);
        hourDiv.removeEventListener("touchstart", null);
        hourDiv.removeEventListener("touchmove", null);
        hourDiv.removeEventListener("touchend", handleTouchEnd);
      }
      if (minuteDiv) {
        minuteDiv.removeEventListener("wheel", handleWheel);
        minuteDiv.removeEventListener("touchstart", null);
        minuteDiv.removeEventListener("touchmove", null);
        minuteDiv.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-4 lg:gap-4">
      <label className="text-sm font-medium text-muted-foreground ">
        {label}
      </label>

      <div className="flex flex-row items-center gap-4">
        {/* Hour */}
        <div className="flex flex-col items-center">
          <button type="button" onClick={() => handleHourChange(1)}>
            <MdArrowDropUp className="w-6 h-6" />
          </button>
          <div
            ref={hourDivRef}
            className="px-6 py-2 bg-muted rounded-lg text-2xl font-bold">
            {hour}
          </div>
          <button type="button" onClick={() => handleHourChange(-1)}>
            <MdArrowDropDown className="w-6 h-6" />
          </button>
          <p className="text-xs text-muted-foreground text-center mt-1">Hour</p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-foreground"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-foreground"></div>
        </div>

        {/* Minute */}
        <div className="flex flex-col items-center">
          <button type="button" onClick={() => handleMinuteChange(1)}>
            <MdArrowDropUp className="w-6 h-6" />
          </button>
          <div
            ref={minuteDivRef}
            className="px-6 py-2 bg-muted rounded-lg text-2xl font-bold">
            {minute}
          </div>
          <button type="button" onClick={() => handleMinuteChange(-1)}>
            <MdArrowDropDown className="w-6 h-6" />
          </button>
          <p className="text-xs text-muted-foreground text-center mt-1">
            Minute
          </p>
        </div>
      </div>
    </div>
  );
};

export default CustomTimePicker;
