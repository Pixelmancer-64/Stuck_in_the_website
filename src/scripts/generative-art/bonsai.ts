import {
  distance,
  start_canvas,
  Point,
  update_vector,
  normalize,
  Positioned_Vector,
  random_color,
  clear_canvas,
} from "../helpers/forge";

class Tree {
  leaves: Array<Leaf> = [];
  branches: Array<Branch> = [];
  max_branch_distance: number;
  min_branch_distance: number;
  growth_rate: number;

  constructor(min_dist: number, max_dist: number, growth_rate: number) {
    this.max_branch_distance = max_dist;
    this.min_branch_distance = min_dist;
    this.growth_rate = growth_rate;

    for (let i = 0; i < 1000; i++) {
      let position = {
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height - 200),
      };

      this.leaves.push(new Leaf(position));
    }

    const root = new Branch(
      { x: canvas.width / 2, y: canvas.height },
      {
        x: 0,
        y: -growth_rate,
        point: { x: canvas.width / 2, y: canvas.height - growth_rate },
      },
      5
    );

    this.branches.push(root);

    let current = root;
    let found_max = false;

    while (!found_max) {
      for (let i = 0; i < this.leaves.length; i++) {
        if (distance(current.end.point, this.leaves[i].position) < max_dist) {
          found_max = true;
          break;
        }
      }

      if (!found_max) {
        let branch = current.next_segment();
        this.branches.push(branch);
        current = branch;
      }
    }
  }

  grow() {
    this.leaves.forEach((leaf, index) => {
      const current_leaf = leaf;
      let closest_branch = null;
      let closest_branch_distance = this.max_branch_distance;
      for (let i = 0; i < this.branches.length; i++) {
        const current_branch = this.branches[i];
        const dist = distance(current_branch.end, current_leaf.position);
        if (dist < this.min_branch_distance) {
          this.leaves.splice(index, 1);
          closest_branch = null;
          break;
        } else if (dist < closest_branch_distance) {
          closest_branch = current_branch;
          closest_branch_distance = dist;
        }
      }

      if (closest_branch != null) {
        const new_Vector = {
          x: current_leaf.position.x + closest_branch.end.x,
          y: current_leaf.position.y + closest_branch.end.y,
        };

        const normalized = normalize(new_Vector);

        closest_branch.end.x -= normalized.direction;
        closest_branch.end.y -= normalized.direction;

        closest_branch.count++;
      }
    });

    this.branches.forEach((branch) => {
      if (branch.count > 0) {
        // fazer o avarage do direction baseado no count
        this.branches.push(branch.next_segment());
        branch.reset()
      }
      branch.count = 0;
    });
  }

  draw() {
    this.branches.forEach((e) => e.draw());
    this.leaves.forEach((e) => e.draw());
  }
}

class Leaf {
  position: Point;

  constructor(position: Point) {
    this.position = position;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 4, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}

class Branch {
  start: Point;
  end: Positioned_Vector;
  end_copy: Positioned_Vector;
  thickness: number;
  count: number = 0;
  color = random_color();

  constructor(start: Point, end: Positioned_Vector, thickness: number) {
    this.start = start;
    this.end = end;
    this.end_copy = structuredClone(end);

    this.thickness = thickness;
  }

  reset() {
    this.end.x = this.end_copy.x;
    this.end.y = this.end_copy.y;

    this.count = 0;
  }

  next_segment() {
    const next_position = update_vector(this.end, normalize(this.end));

    return new Branch(this.end.point, next_position, this.thickness * 0.95);
  }

  draw() {
    ctx.lineWidth = this.thickness;
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(this.end.point.x, this.end.point.y);
    ctx.closePath();
    ctx.stroke();
  }
}

const { canvas, ctx } = start_canvas(
  document.querySelector("canvas")!,
  window.innerWidth,
  window.innerHeight
);

const bonsai = new Tree(10, 100, 30);

clear_canvas(canvas, ctx)

for (let i = 0; i < 50; i++) {
  bonsai.grow();
}

bonsai.draw();
