import { JSX } from "preact/jsx-runtime";

interface Color {
  r: number;
  g: number;
  b: number;
}

export default function AnimatedBorder() {
  const default_color: Color = { r: 170, g: 15, b: 150 };
  const glow_color: Color = { r: 222, g: 24, b: 205 };

  const stringify_color = (color: Color) => {
    return `rgb(${color.r}, ${color.g}, ${color.b})`;
  };

  const get_hovered_color = (
    percentage: number,
    default_col: Color = default_color,
    glow_col: Color = glow_color,
  ) => {
    const diff_color: Color = {
      r: glow_col.r - default_color.r,
      g: glow_col.g - default_color.g,
      b: glow_col.b - default_color.b,
    };

    const perf_color: Color = {
      r: default_col.r + Math.floor(diff_color.r * percentage),
      g: default_col.g + Math.floor(diff_color.g * percentage),
      b: default_col.b + Math.floor(diff_color.b * percentage),
    };

    return stringify_color(perf_color);
  };

  const get_box_shadow = (
    width_percentage: number,
    height_percentage: number,
    position: number = 20,
    blur_radius: number = 30,
    spread_radius: number = -10,
    default_col: Color = default_color,
    glow_col: Color = glow_color,
  ) => {
    const avg_percentage =
      (Math.abs(width_percentage) + Math.abs(height_percentage)) / 2;

    const horizontal_offset = width_percentage < 0
      ? `-${Math.floor(position * -1 * width_percentage)}`
      : `${Math.floor(position * width_percentage)}`;

    const vertical_offset = height_percentage < 0
      ? `-${Math.floor(position * -1 * height_percentage)}`
      : `${Math.floor(position * height_percentage)}`;

    return `${horizontal_offset}px ${vertical_offset}px ${
      Math.floor(blur_radius * avg_percentage)
    }px ${Math.floor(spread_radius * avg_percentage)}px ${
      get_hovered_color(avg_percentage, default_col, glow_col)
    }`;
  };

  const onMouseMove: JSX.MouseEventHandler<HTMLDivElement> = (event) => {
    const elem_rect = event.currentTarget.getBoundingClientRect();

    const x = event.clientX - elem_rect.left;
    const y = event.clientY - elem_rect.top;
    const half_width = elem_rect.width / 2;
    const half_height = elem_rect.height / 2;

    const width_diff = (x - half_width) / half_width;
    const height_diff = (y - half_height) / half_height;

    event.currentTarget.style.boxShadow = get_box_shadow(
      width_diff,
      height_diff,
    );

    if (width_diff < 0) {
      event.currentTarget.style.borderLeftColor = get_hovered_color(
        -1 * width_diff,
      );
    } else {
      event.currentTarget.style.borderRightColor = get_hovered_color(
        width_diff,
      );
    }

    if (height_diff < 0) {
      event.currentTarget.style.borderTopColor = get_hovered_color(
        -1 * height_diff,
      );
    } else {
      event.currentTarget.style.borderBottomColor = get_hovered_color(
        height_diff,
      );
    }
  };

  const onMouseLeave: JSX.MouseEventHandler<HTMLDivElement> = (event) => {
    event.currentTarget.style.boxShadow = `0 0 0 0 ${
      stringify_color(default_color)
    }`;
    event.currentTarget.style.borderColor = stringify_color(default_color);
  };

  return (
    <div
      className={"animated_border"}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
    </div>
  );
}
