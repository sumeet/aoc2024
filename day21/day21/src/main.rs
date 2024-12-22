use std::collections::BTreeMap;
use std::iter::{once, repeat_n};
use std::sync::LazyLock;

fn main() {
    let mut pads = once(Pad::num())
        .chain(repeat_n(Pad::dir(), 3))
        .collect::<Vec<_>>();

    let code = SAMPLE.split("\n").next().unwrap();

    dbg!(code);
}

#[derive(Clone)]
struct Grid {
    char_by_pos: BTreeMap<(i8, i8), char>,
    pos_by_char: BTreeMap<char, (i8, i8)>,
}

impl Grid {
    fn new(pos_by_char: BTreeMap<char, (i8, i8)>) -> Self {
        let char_by_pos = pos_by_char.iter().map(|(c, p)| (*p, *c)).collect();
        Self {
            char_by_pos,
            pos_by_char,
        }
    }

    fn get_char(&self, c: char) -> Option<(i8, i8)> {
        self.pos_by_char.get(&c).copied()
    }

    // fn get_pos(&self, p: (i8, i8)) -> Option<char> {
    //     self.char_by_pos.get(&p).copied()
    // }

    fn has_pos(&self, p: (i8, i8)) -> bool {
        self.char_by_pos.contains_key(&p)
    }

    fn iter(&self) -> impl Iterator<Item = (&char, &(i8, i8))> {
        self.pos_by_char.iter()
    }
}

static DIR_BY_CHAR: LazyLock<BTreeMap<char, (i8, i8)>> = LazyLock::new(|| {
    let mut dirs = BTreeMap::new();
    dirs.insert('^', (-1, 0));
    dirs.insert('v', (1, 0));
    dirs.insert('<', (0, -1));
    dirs.insert('>', (0, 1));
    dirs
});

static CHAR_BY_DIR: LazyLock<BTreeMap<(i8, i8), char>> =
    LazyLock::new(|| DIR_BY_CHAR.iter().map(|(c, d)| (*d, *c)).collect());

#[derive(Clone)]
struct Pad {
    grid: Grid,
    all_shortest_paths: BTreeMap<(char, char), Vec<Vec<char>>>,
    current: char,
}

// fn paths_from(grid: Grid, from: char, to: char) -> Vec<Vec<char>> {
//     let mut paths = [];
//     let mut src = *grid.get(&from).unwrap();
//     let dst = *grid.get(&to).unwrap();
//     while (src != dst) {
//         for dir in using_dirs {
//             let dydx = *DIRS.get(dir).unwrap();
//             let new_src = (src.0 + dydx.0, src.1 + dydx.1);
//         }
//     }
//     paths
// }

impl Pad {
    fn new(pos_by_char: BTreeMap<char, (i8, i8)>) -> Self {
        let grid = Grid::new(pos_by_char);

        let mut all_shortest_paths = BTreeMap::new();
        for (from, (from_y, from_x)) in grid.iter() {
            for (to, (to_y, to_x)) in grid.iter() {
                let mut paths = vec![];
                if (from == to) {
                    paths.push(vec![]);
                }

                let dy = (*to_y - *from_y);
                let dx = (*to_x - *from_x);

                if (dy != 0) {
                    let mut path = vec![];
                    let mut cur = (*from_y, *from_x);
                    while (dy != 0 || dx != 0) {
                        while (dy != 0) {
                            let next = (cur.0 + dy.signum(), cur.1);
                            if !grid.has_pos(next) {
                                break;
                            }
                            path.push(if dy > 0 { 'v' } else { '^' });
                            cur = next;
                        }
                        while (dx != 0) {
                            let next = (cur.0, cur.1 + dx.signum());
                            if !grid.has_pos(next) {
                                break;
                            }
                            path.push(if dx > 0 { '>' } else { '<' });
                            cur = next;
                        }
                    }
                }

                all_shortest_paths.insert((*from, *to), paths);
            }
        }

        Self {
            grid,
            current: 'A',
            all_shortest_paths,
        }
    }

    //     +---+---+
    //     | ^ | A |
    // +---+---+---+
    // | < | v | > |
    // +---+---+---+
    fn dir() -> Self {
        let mut grid = BTreeMap::new();
        grid.insert('^', (0, 1));
        grid.insert('A', (0, 2));
        grid.insert('<', (1, 0));
        grid.insert('v', (1, 1));
        grid.insert('>', (1, 2));
        Self::new(grid)
    }

    // +---+---+---+
    // | 7 | 8 | 9 |
    // +---+---+---+
    // | 4 | 5 | 6 |
    // +---+---+---+
    // | 1 | 2 | 3 |
    // +---+---+---+
    //     | 0 | A |
    //     +---+---+
    fn num() -> Self {
        let mut grid = BTreeMap::new();
        grid.insert('7', (0, 0));
        grid.insert('8', (0, 1));
        grid.insert('9', (0, 2));
        grid.insert('4', (1, 0));
        grid.insert('5', (1, 1));
        grid.insert('6', (1, 2));
        grid.insert('1', (2, 0));
        grid.insert('2', (2, 1));
        grid.insert('3', (2, 2));
        grid.insert('0', (3, 1));
        grid.insert('A', (3, 2));
        Self::new(grid)
    }
}

const SAMPLE: &str = "029A
980A
179A
456A
379A";

const INPUT: &str = "341A
803A
149A
683A
208A";
