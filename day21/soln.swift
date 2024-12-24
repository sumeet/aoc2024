import Foundation

struct Point<T: Hashable>: Hashable {
    let x: T
    let y: T
}

typealias Grid = [Point<Int>: Character]

class Pad {
    static func initNumPad(numRobots: Int) -> Self {
        var pads = [Pad]()
    }

    static func num() -> Self {

    }

    let grid: Grid
    var parent: Pad?

    init(grid: Grid) {
        self.grid = grid
    }

    lazy var allShortestPaths: [Point<Character>: [[Character]]] = {
        let paths: [Point<Character>: [[Character]]] = [:]
        return paths
    }()
}

let SAMPLE = """
    029A
    980A
    179A
    456A
    379A
    """.trimmingCharacters(in: .whitespacesAndNewlines)

// const INPUT: &str = "341A
// 803A
// 149A
// 683A
// 208A";

print(SAMPLE)
