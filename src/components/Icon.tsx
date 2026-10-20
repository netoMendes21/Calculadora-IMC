import heart from "../assets/icons/heart-pulse.svg";
import arrow from "../assets/icons/arrow-right.svg";
import reset from "../assets/icons/rotate-ccw.svg";
import info from "../assets/icons/info.svg";

const icons = { heart, arrow, reset, info };

type IconProps = { name: keyof typeof icons };

export default function Icon({ name }: IconProps) {
  return <img className="icon" src={icons[name]} alt="" aria-hidden="true" />;
}
