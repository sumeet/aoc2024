#![feature(slice_partition_dedup)]

use std::collections::BTreeMap;
use std::iter::{once, repeat_n};

fn main() {
    let mut total = 0;
    for code in SAMPLE.split("\n") {
        let mut num_pad = Pad::init_num_pad();
        num_pad.go_to_path_via_shortest_path(&code.chars().collect::<Vec<_>>());
        let path = num_pad.last_path();
        let num_part_of_code = code[0..3].parse::<usize>().unwrap();
        total += num_part_of_code * path.len();
        println!(
            "{num_part_of_code} * {path_len} => {path}",
            path_len = path.len(),
            path = path.iter().collect::<String>()
        );
        num_pad.print(0);
    }
    println!("part 1: {total}");
}

#[derive(Clone, Debug)]
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

    // fn get_char(&self, c: char) -> Option<(i8, i8)> {
    //     self.pos_by_char.get(&c).copied()
    // }

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

// static DIR_BY_CHAR: LazyLock<BTreeMap<char, (i8, i8)>> = LazyLock::new(|| {
//     let mut dirs = BTreeMap::new();
//     dirs.insert('^', (-1, 0));
//     dirs.insert('v', (1, 0));
//     dirs.insert('<', (0, -1));
//     dirs.insert('>', (0, 1));
//     dirs
// });
//
// static CHAR_BY_DIR: LazyLock<BTreeMap<(i8, i8), char>> =
//     LazyLock::new(|| DIR_BY_CHAR.iter().map(|(c, d)| (*d, *c)).collect());

#[derive(Clone, Debug)]
struct Pad {
    grid: Grid,
    all_shortest_paths: BTreeMap<(char, char), Vec<Vec<char>>>,
    current: char,
    moves_so_far: Vec<char>,
    parent: Option<Box<Pad>>,
}

impl Pad {
    fn init_num_pad() -> Self {
        let mut pads = once(Pad::num())
            .chain(repeat_n(Pad::dir(), 2))
            .collect::<Vec<_>>();
        let mut prev_pad = pads.pop().unwrap();
        while let Some(mut pad) = pads.pop() {
            pad.parent = Some(Box::new(prev_pad));
            prev_pad = pad;
        }
        prev_pad
    }

    fn print(&self, depth: usize) {
        let moves = self.moves_so_far.iter().collect::<String>();
        println!("{depth}: {moves}");
        if let Some(parent) = &self.parent {
            parent.print(depth + 1);
        }
    }

    fn last_path(&self) -> &[char] {
        if let Some(parent) = &self.parent {
            parent.last_path()
        } else {
            &self.moves_so_far
        }
    }

    fn go_to_path_via_shortest_path(&mut self, path: &[char]) {
        let paths = self.all_paths(path);
        println!("all paths to {path:?}: {:?}", paths);
        let path_to_follow = match (paths.len(), &self.parent) {
            (0, _) => unreachable!(),
            (1, _) => paths.first().unwrap(),
            (_, Some(parent)) => paths
                .iter()
                .min_by_key(|p| parent.distance_to_path(p))
                .unwrap(),
            // there's no parent, so it doesn't matter, just pick one
            (_, None) => paths.iter().next().unwrap(),
        };
        let path_to_follow = path_to_follow.iter().copied().chain(once('A'));
        self.moves_so_far.extend(path_to_follow.clone());

        // TODO: gotta recomment this in to get parents working
        if let Some(parent) = &mut self.parent {
            parent.go_to_path_via_shortest_path(&path_to_follow.collect::<Vec<_>>());
        }
    }

    // fn go_to_char_via_shortest_path(&mut self, c: char) {
    //     let paths = self.shortest_paths_to(c);
    //     let path_to_follow = match (paths.len(), &self.parent) {
    //         (0, _) => unreachable!(),
    //         (1, _) => paths.first().unwrap(),
    //         (_, Some(parent)) => paths
    //             .iter()
    //             // .min_by_key(|p| parent.distance_to_char(*p.iter().next().unwrap()))
    //             .min_by_key(|p| parent.distance_to_path(p))
    //             .unwrap(),
    //         // it doesn't matter, just pick one
    //         (_, None) => paths.iter().next().unwrap(),
    //     };
    //     let path_to_follow = path_to_follow.iter().copied().chain(once('A'));
    //
    //     self.moves_so_far.extend(path_to_follow.clone());
    //     self.current = c;
    //
    //     if let Some(parent) = &mut self.parent {
    //         for parent_c in path_to_follow {
    //             parent.go_to_char_via_shortest_path(parent_c);
    //         }
    //     }
    // }

    // fn distance_to_char(&self, c: char) -> usize {
    //     // TODO: if this is slow, this could be optimized to just choose the first one
    //     // since they're all the same length anyway
    //     self.shortest_paths_to(c)
    //         .into_iter()
    //         .min_by_key(|p| p.len())
    //         .unwrap()
    //         .len()
    // }

    fn distance_to_path(&self, path: &[char]) -> usize {
        let mut total = 0;
        let mut from = self.current;
        for to in path {
            total += self
                .shortest_paths_from_to(from, *to)
                .into_iter()
                .min_by_key(|p| p.len())
                .unwrap()
                .len();
            from = *to;
        }
        total
    }

    fn all_paths(&self, to: &[char]) -> Vec<Vec<char>> {
        if to.len() == 0 {
            return vec![];
        }
        let mut prev_char = *to.first().unwrap();
        let mut all_paths_to_char = self.shortest_paths_to(prev_char);
        //for path in all_paths_to_char.iter_mut() {
        //    path.push('A');
        //}

        for &char in to.iter().skip(1) {
            all_paths_to_char = all_paths_to_char
                .iter()
                .flat_map(move |path| {
                    let mut paths = vec![];
                    for next_path in self.shortest_paths_from_to(prev_char, char) {
                        let mut path = path.clone();
                        path.push('A');
                        path.extend(next_path);
                        paths.push(path);
                    }
                    paths
                })
                .collect();

            prev_char = char;
        }
        all_paths_to_char
    }

    fn new(pos_by_char: BTreeMap<char, (i8, i8)>) -> Self {
        let grid = Grid::new(pos_by_char);

        let mut all_shortest_paths = BTreeMap::new();
        for (from, (from_y, from_x)) in grid.iter() {
            for (to, (to_y, to_x)) in grid.iter() {
                let mut paths = vec![];
                if from == to {
                    paths.push(vec![]);
                }

                let dy = *to_y - *from_y;
                let dx = *to_x - *from_x;

                if dy != 0 {
                    let mut path = vec![];
                    let mut cur = (*from_y, *from_x);
                    let mut dy = dy;
                    let mut dx = dx;
                    while dy != 0 || dx != 0 {
                        dy = Self::move_in_y_direction(&grid, dy, &mut path, &mut cur);
                        dx = Self::move_in_x_direction(&grid, dx, &mut path, &mut cur);
                    }
                    if path.len() > 0 {
                        paths.push(path);
                    }
                }
                if dx != 0 {
                    let mut path = vec![];
                    let mut cur = (*from_y, *from_x);
                    let mut dy = dy;
                    let mut dx = dx;
                    while dy != 0 || dx != 0 {
                        dx = Self::move_in_x_direction(&grid, dx, &mut path, &mut cur);
                        dy = Self::move_in_y_direction(&grid, dy, &mut path, &mut cur);
                    }
                    if path.len() > 0 {
                        paths.push(path);
                    }
                }

                let min_path_length = paths.iter().map(|p| p.len()).min().unwrap();
                paths.retain(|p| p.len() == min_path_length);
                let min_num_dir_changes = paths.iter().map(|p| num_dir_changes(p)).min().unwrap();
                paths.retain(|p| num_dir_changes(p) == min_num_dir_changes);
                let (dedup, _) = paths.partition_dedup();
                all_shortest_paths.insert((*from, *to), dedup.to_vec());
            }
        }

        Self {
            moves_so_far: vec![],
            parent: None,
            grid,
            current: 'A',
            all_shortest_paths,
        }
    }

    fn shortest_paths_to(&self, to: char) -> Vec<Vec<char>> {
        self.all_shortest_paths
            .get(&(self.current, to))
            .unwrap()
            .clone()
    }

    fn shortest_paths_from_to(&self, from: char, to: char) -> Vec<Vec<char>> {
        self.all_shortest_paths.get(&(from, to)).unwrap().clone()
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

    fn move_in_x_direction(
        grid: &Grid,
        mut dx: i8,
        path: &mut Vec<char>,
        cur: &mut (i8, i8),
    ) -> i8 {
        while dx != 0 {
            let next = (cur.0, cur.1 + dx.signum());
            if !grid.has_pos(next) {
                break;
            }
            path.push(if dx > 0 { '>' } else { '<' });
            *cur = next;
            dx -= dx.signum();
        }
        dx
    }

    fn move_in_y_direction(
        grid: &Grid,
        mut dy: i8,
        path: &mut Vec<char>,
        cur: &mut (i8, i8),
    ) -> i8 {
        while dy != 0 {
            let next = (cur.0 + dy.signum(), cur.1);
            if !grid.has_pos(next) {
                break;
            }
            path.push(if dy > 0 { 'v' } else { '^' });
            *cur = next;
            dy -= dy.signum();
        }
        dy
    }
}

fn num_dir_changes(path: &[char]) -> usize {
    path.windows(2).filter(|w| w[0] != w[1]).count()
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
