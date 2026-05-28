import { createElement, type CSSProperties } from "react";
import type { IconType } from "react-icons";
import {
  FaArrowRight,
  FaArrowUpRightFromSquare,
  FaCalendarCheck,
  FaEnvelope,
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaLocationDot,
  FaMedium,
  FaPhone,
  FaSquareWhatsapp,
  FaTelegram,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

export const ICONS: Record<string, IconType> = {
  FaArrowRight,
  FaArrowUpRightFromSquare,
  FaCalendarCheck,
  FaEnvelope,
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaLocationDot,
  FaMedium,
  FaPhone,
  FaSquareWhatsapp,
  FaTelegram,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
};

export const ICON_NAMES = Object.keys(ICONS).sort();

export function getIcon(name: string): IconType {
  return ICONS[name] ?? FaGlobe;
}

type IconProps = {
  name: string;
  size?: number;
  color?: string;
  className?: string;
  style?: CSSProperties;
};

export function RenderIcon({ name, size, color, className, style }: IconProps) {
  return createElement(getIcon(name), {
    size,
    className,
    style: color ? { ...style, color } : style,
  });
}
