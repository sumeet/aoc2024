import Foundation

public struct PriorityQueue<T: Comparable> {
    fileprivate(set) var heap = [T]()
    private let ordered: (T, T) -> Bool
    public init(ascending: Bool = false, startingValues: [T] = []) {
        self.init(order: ascending ? { $0 > $1 } : { $0 < $1 }, startingValues: startingValues)
    }
    public init(order: @escaping (T, T) -> Bool, startingValues: [T] = []) {
        ordered = order
        heap = startingValues
        var i = heap.count / 2 - 1
        while i >= 0 {
            sink(i)
            i -= 1
        }
    }
    public var count: Int { return heap.count }
    public var isEmpty: Bool { return heap.isEmpty }
    public mutating func push(_ element: T) {
        heap.append(element)
        swim(heap.count - 1)
    }
    public mutating func push(_ element: T, maxCount: Int) -> T? {
        precondition(maxCount > 0)
        if count < maxCount {
            push(element)
        } else {  // heap.count >= maxCount
            // find the min priority element (ironically using max here)
            if let discard = heap.max(by: ordered) {
                if ordered(discard, element) { return element }
                push(element)
                remove(discard)
                return discard
            }
        }
        return nil
    }
    public mutating func pop() -> T? {

        if heap.isEmpty { return nil }
        let count = heap.count
        if count == 1 { return heap.removeFirst() }  // added for Swift 2 compatibility
        // so as not to call swap() with two instances of the same location
        fastPop(newCount: count - 1)

        return heap.removeLast()
    }
    public mutating func remove(_ item: T) {
        if let index = heap.firstIndex(of: item) {
            heap.swapAt(index, heap.count - 1)
            heap.removeLast()
            if index < heap.count {  // if we removed the last item, nothing to swim
                swim(index)
                sink(index)
            }
        }
    }
    public mutating func removeAll(_ item: T) {
        var lastCount = heap.count
        remove(item)
        while heap.count < lastCount {
            lastCount = heap.count
            remove(item)
        }
    }
    public func peek() -> T? {
        return heap.first
    }
    public mutating func clear() {
        heap.removeAll(keepingCapacity: false)
    }
    private mutating func sink(_ index: Int) {
        var index = index
        while 2 * index + 1 < heap.count {

            var j = 2 * index + 1

            if j < (heap.count - 1) && ordered(heap[j], heap[j + 1]) { j += 1 }
            if !ordered(heap[index], heap[j]) { break }

            heap.swapAt(index, j)
            index = j
        }
    }
    private mutating func fastPop(newCount: Int) {
        var index = 0
        heap.withUnsafeMutableBufferPointer { bufferPointer in
            let _heap = bufferPointer.baseAddress!  // guaranteed non-nil because count > 0
            swap(&_heap[0], &_heap[newCount])
            while 2 * index + 1 < newCount {
                var j = 2 * index + 1
                if j < (newCount - 1) && ordered(_heap[j], _heap[j + 1]) { j += 1 }
                if !ordered(_heap[index], _heap[j]) { return }
                swap(&_heap[index], &_heap[j])
                index = j
            }
        }
    }
    private mutating func swim(_ index: Int) {
        var index = index
        while index > 0 && ordered(heap[(index - 1) / 2], heap[index]) {
            heap.swapAt((index - 1) / 2, index)
            index = (index - 1) / 2
        }
    }
}
extension PriorityQueue: IteratorProtocol {

    public typealias Element = T
    mutating public func next() -> Element? { return pop() }
}
extension PriorityQueue: Sequence {

    public typealias Iterator = PriorityQueue
    public func makeIterator() -> Iterator { return self }
}
extension PriorityQueue: Collection {
    public typealias Index = Int
    public var startIndex: Int { return heap.startIndex }
    public var endIndex: Int { return heap.endIndex }
    public subscript(position: Int) -> T {
        precondition(
            startIndex..<endIndex ~= position,
            "SwiftPriorityQueue subscript: index out of bounds"
        )
        return heap[position]
    }
    public func index(after i: PriorityQueue.Index) -> PriorityQueue.Index {
        return heap.index(after: i)
    }

}
extension PriorityQueue: CustomStringConvertible, CustomDebugStringConvertible {
    public var description: String { return heap.description }
    public var debugDescription: String { return heap.debugDescription }
}

struct Cursor: Hashable {
    var pos: Point
    var dir: Point
}

struct State {
    var cur: Cursor
    var score: Int
    var dir: Point
    var visited: Set<Point>

    static func fresh(startingPoint: Point) -> State {
        return State(
            cur: Cursor(pos: startingPoint, dir: Point(0, 1)),
            score: 0, dir: Point(0, 1), visited: [startingPoint])
    }

    func cost() -> Int {
        return self.score + self.distanceFromEnd()
    }

    func distanceFromEnd() -> Int {
        return abs(self.cur.pos.y - end!.y) + abs(self.cur.pos.x - end!.x)
    }

    func nextStates() -> [State] {
        var nextStates: [State] = []
        let forwardPos = self.cur.pos + self.cur.dir
        if let forwardChar = grid[forwardPos], forwardChar != "#" {
            var next = self
            next.cur.pos = forwardPos
            next.score += 1
            next.visited.insert(forwardPos)
            nextStates.append(next)
        }

        // right
        var right = self
        right.cur.dir = self.cur.dir.turnRight()
        right.score += 1000
        nextStates.append(right)

        // left
        var left = self
        left.cur.dir = self.cur.dir.turnLeft()
        left.score += 1000
        nextStates.append(left)

        return nextStates
    }
}

extension State: Comparable {
    static func < (lhs: State, rhs: State) -> Bool {
        return lhs.cost() < rhs.cost()
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

    func turnLeft() -> Point {
        return Point(-self.x, self.y)
    }
}

extension Point {
    static func + (lhs: Point, rhs: Point) -> Point {
        return Point(lhs.y + rhs.y, lhs.x + rhs.x)
    }
}

let contents = try String(contentsOfFile: "input.txt")
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

func part1() -> Int {
    var bestCosts: [Cursor: Int] = [:]
    // var q = [State.fresh(startingPoint: start)]
    var q = PriorityQueue<State>(
        ascending: true, startingValues: [State.fresh(startingPoint: start)])
    while !q.isEmpty {
        let state = q.pop()!
        if bestCosts[state.cur, default: Int.max] <= state.cost() { continue }
        bestCosts[state.cur] = state.cost()
        if state.cur.pos == end {
            return state.score
        }
        for nextState in state.nextStates() {
            if nextState.cost() < bestCosts[nextState.cur, default: Int.max] {
                q.push(nextState)
            }
        }
        // q.push(
        // contentsOf: state.nextStates().filter {
        // $0.cost() < bestCosts[$0.cur, default: Int.max]
        // })
        // q.removeAll(where: { $0.cost() > bestCosts[$0.cur, default: Int.max] })
        // q.sort(by: { $0.cost() < $1.cost() })
    }
    fatalError("unreachable")
}

func part2() -> Int {
    var bestTiles = Set<Point>()
    var winnerScore: Int? = nil
    var bestCosts: [Cursor: Int] = [:]
    var q = PriorityQueue<State>(
        ascending: true, startingValues: [State.fresh(startingPoint: start)])
    while !q.isEmpty {
        let state = q.pop()!
        if bestCosts[state.cur, default: Int.max] < state.cost() { continue }
        bestCosts[state.cur] = state.cost()
        if state.cur.pos == end {
            if winnerScore == nil {
                winnerScore = state.cost()
                bestTiles.formUnion(state.visited)
                // print("updating: \(bestTiles.count)")
            } else if state.cost() < winnerScore! {
                fatalError("this should never happen")
            } else if state.cost() == winnerScore! {
                bestTiles.formUnion(state.visited)
                // print("updating: \(bestTiles.count)")
            } else if state.cost() > winnerScore! {
                break
            }
            continue
        }
        for nextState in state.nextStates() {
            if nextState.cost() <= bestCosts[nextState.cur, default: Int.max] {
                q.push(nextState)
            }
        }
    }
    return bestTiles.count
}

print("part 1:")
print(part1())

print(part2())
