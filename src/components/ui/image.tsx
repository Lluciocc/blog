import type { CSSProperties, ImgHTMLAttributes } from "react";

interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "width" | "height"> {
  width?: number | string;
  height?: number | string;
  fill?: boolean;
  quality?: number;
  priority?: boolean;
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
}

const Image = ({ fill, priority, quality: _quality, placeholder: _placeholder, blurDataURL: _blurDataURL, style, ...props }: ImageProps) => {
  const fillStyle: CSSProperties = fill ? { position: "absolute", inset: 0, width: "100%", height: "100%" } : {};
  return <img {...props} loading={priority ? "eager" : props.loading || "lazy"} decoding="async" style={{ ...fillStyle, ...style }} />;
};

export default Image;
