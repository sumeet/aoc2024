import Foundation

struct Cursor: Hashable {
    var pos: Point
    var dir: Point
}

struct State {
    var cur: Cursor
    // var path: [Point]
    var seen: Set<Cursor>
    var score: Int
    var dir: Point

    static func fresh(startingPoint: Point) -> State {
        return State(
            cur: Cursor(pos: startingPoint, dir: Point(0, 1)),
            seen: Set([Cursor(pos: startingPoint, dir: Point(0, 1))]), score: 0, dir: Point(0, 1))
    }

    func clone() -> Self {
        return State(cur: self.cur, seen: Set(self.seen), score: self.score, dir: self.dir)
    }

    func distanceFromEnd() -> Int {
        return abs(self.cur.pos.y - end!.y) + abs(self.cur.pos.x - end!.x)
    }

    func nextStates() -> [State] {
        var nextStates: [State] = []
        let forwardPos = self.cur.pos + self.cur.dir
        if let forwardChar = grid[forwardPos], forwardChar != "#",
            !self.seen.contains(Cursor(pos: forwardPos, dir: self.cur.dir))
        {
            var next = self.clone()
            next.cur.pos = forwardPos
            next.seen.insert(Cursor(pos: forwardPos, dir: self.cur.dir))
            next.score += 1
            nextStates.append(next)
        }
        let turnedCursor = Cursor(pos: self.cur.pos, dir: self.cur.dir.turnRight())
        if !self.seen.contains(turnedCursor) {
            var next = self.clone()
            next.cur.dir = self.cur.dir.turnRight()
            next.seen.insert(turnedCursor)
            next.score += 1000
            nextStates.append(next)
        }
        return nextStates
    }
}

struct Point: Hashable {
    var y: Int
    var x: Int

    init(_ y: Int, _ x: Int) {
        self.y = y
        self.x = x
    }

    func turnRight() -> Point {
        return Point(self.x, -self.y)
    }
}

extension Point {
    static func + (lhs: Point, rhs: Point) -> Point {
        return Point(lhs.y + rhs.y, lhs.x + rhs.x)
    }
}

let contents = try String(contentsOfFile: "sample.txt")
var grid: [Point: Character] = [:]

var start: Point? = nil
var end: Point? = nil
for (y, line) in contents.split(separator: "\n").enumerated() {
    for (x, char) in line.enumerated() {
        if char == "S" {
            start = Point(y, x)
        } else if char == "E" {
            end = Point(y, x)
        }

        grid[Point(y, x)] = char
    }
}

guard let start = start, let end = end else { fatalError() }

var q = [State.fresh(startingPoint: start)]
while !q.isEmpty {
    let state = q.removeFirst()
    // print("distance", state.distanceFromEnd())
    if state.cur.pos == end {
        print(state.score)
        break
    }
    q.append(contentsOf: state.nextStates())
    q.sort(by: { $0.score + $0.distanceFromEnd() < $1.score + $1.distanceFromEnd() })
}
