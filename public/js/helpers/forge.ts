export interface Color_Formats {
  rgb: string;
  rgba: string;
  hsl: string;
  hsla: string;
  hex: string;
}

export function random(end: number = 1, start: number = 0) {
  return Math.random() * (end - start) + start;
}

export function random_int(end = 1, start = 0) {
  return Math.floor(Math.random() * (end - start + 1)) + start;
}

export function random_sign() {
  return Math.random() < 0.5 ? -1 : 1;
}

export function map(
  value: number,
  end: number,
  start: number,
  end_2: number,
  start_2: number
) {
  return ((value - start) / (end - start)) * (end_2 - start_2) + start_2;
}

export function random_color(alpha = 1, format: keyof Color_Formats = "rgb") {
  const r = random_int(256);
  const g = random_int(256);
  const b = random_int(256);
  const a = alpha;

  const formats: Color_Formats = {
    rgb: `rgb(${r}, ${g}, ${b})`,
    rgba: `rgba(${r}, ${g}, ${b}, ${a})`,
    hsl: `hsl(${random_int(360)}, ${random_int(100)}%, ${random_int(100)}%)`,
    hsla: `hsla(${random_int(360)}, ${random_int(100)}%, ${random_int(
      100
    )}%, ${a})`,
    hex: `#${r.toString(16).padStart(2, "0")}${g
      .toString(16)
      .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`,
  };

  return formats[format];
}

export function start_canvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  options: any = ""
) {
  canvas.width = width;
  canvas.height = height;
  return {
    canvas,
    ctx: canvas.getContext("2d", options)! as CanvasRenderingContext2D,
  };
}

export function clear_canvas(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
) {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

export function save_canvas(canvas: HTMLCanvasElement, link: string) {
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.download = link;
  a.href = canvas.toDataURL("image/png");
  a.click();
  document.body.removeChild(a);
}

export interface Point {
  x: number;
  y: number;
}

export interface Vector {
  x: number;
  y: number;
}

export interface Positioned_Vector extends Vector {
  point: Point;
}

export function distance(point_1: Point, point_2: Point): number {
  return Math.sqrt((point_1.x - point_2.x) ** 2 + (point_1.y - point_2.y) ** 2);
}

export function squared_distance(point_1: Point, point_2: Point): number {
  return (point_1.x - point_2.x) ** 2 + (point_1.y - point_2.y) ** 2;
}

export interface NormalizedVector {
  vector: Vector;
  magnitude: number;
  direction: number;
}

export function normalize(vector: Vector): NormalizedVector {
  const length = Math.sqrt(vector.x ** 2 + vector.y ** 2);
  const normalized = { x: vector.x / length, y: vector.y / length };
  const direction = Math.atan2(normalized.y, normalized.x);
  return { vector: normalized, magnitude: length, direction };
}

export function radians_to_degrees(radians: number): number {
  return radians * (180 / Math.PI);
}

export function degrees_to_radians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function update_vector(
  vector: Positioned_Vector,
  normalized: NormalizedVector
): Positioned_Vector {
  const deltaX = normalized.magnitude * Math.cos(normalized.direction);
  const deltaY = normalized.magnitude * Math.sin(normalized.direction);

  let new_Vector = structuredClone(vector);

  new_Vector.point.x += deltaX;
  new_Vector.point.y += deltaY;

  return new_Vector;
}

export function update_point(
  point: Point,
  normalized: NormalizedVector
): Point {
  const deltaX = normalized.magnitude * Math.cos(normalized.direction);
  const deltaY = normalized.magnitude * Math.sin(normalized.direction);

  let new_Point = structuredClone(point);

  new_Point.x += deltaX;
  new_Point.y += deltaY;

  return new_Point;
}
