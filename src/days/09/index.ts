export interface Vector {
  direction: string;
  distance: number;
}

export interface Coordinate {
  x: number;
  y: number;
}

export class Rope {
  readonly knotPositions: Coordinate[] = [];
  readonly head: Coordinate;

  constructor(knots: number = 2) {
    if (knots < 2) {
      throw Error("Must be at least two knots in a rope");
    }

    for (let i = 0; i < knots; i++) {
      this.knotPositions.push({ x: 0, y: 0 });
    }

    this.head = this.knotPositions[0];
  }

  move = (vector: Vector): Coordinate[] => {
    const visited: Coordinate[] = [];

    for (let _ = 0; _ < vector.distance; _++) {
      this.moveHead(vector.direction);

      let knotMoved = true;
      for (let i = 1; i < this.knotPositions.length && knotMoved; i++) {
        const tail = this.knotPositions[i];
        const head = this.knotPositions[i - 1];

        if (Math.abs(head.x - tail.x) > 1 || Math.abs(head.y - tail.y) > 1) {
          const distanceToMove = {
            x: Math.min(Math.max(head.x - tail.x, -1), 1),
            y: Math.min(Math.max(head.y - tail.y, -1), 1),
          };

          if (distanceToMove.x !== 0 || distanceToMove.y !== 0) {
            tail.x += distanceToMove.x;
            tail.y += distanceToMove.y;
          } else {
            knotMoved = false;
          }

          if (i === this.knotPositions.length - 1) {
            visited.push(Object.assign({}, this.knotPositions[i]));
          }
        }
      }
    }

    return visited;
  };

  moveHead = (direction: string): void => {
    if (direction === "R") {
      this.head.x++;
    }
    if (direction === "L") {
      this.head.x--;
    }
    if (direction === "U") {
      this.head.y--;
    }
    if (direction === "D") {
      this.head.y++;
    }
  };

  simulate = (vectors: Vector[]): number => {
    const visited: Coordinate[] = [{ x: 0, y: 0 }];

    for (let i = 0; i < vectors.length; i++) {
      const visitedCoordinatesThisMove = this.move(vectors[i]);

      for (let visitedCoordinateThisMove of visitedCoordinatesThisMove) {
        if (
          !visited.find(
            (coord) =>
              coord.x === visitedCoordinateThisMove.x &&
              coord.y === visitedCoordinateThisMove.y
          )
        ) {
          visited.push(visitedCoordinateThisMove);
        }
      }
    }

    return visited.length;
  };
}

export const parseInput = (input: string): Vector[] => {
  return input
    .trim()
    .split("\n")
    .map((line) => {
      const items = line.split(" ");

      return {
        direction: items[0],
        distance: parseInt(items[1]),
      };
    });
};

export const getPart1Answer = (input: string): number => {
  const instructions = parseInput(input);
  const rope = new Rope();
  return rope.simulate(instructions);
};

export const getPart2Answer = (input: string): number => {
  const instructions = parseInput(input);
  const rope = new Rope(10);
  return rope.simulate(instructions);
};
