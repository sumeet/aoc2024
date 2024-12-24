#![feature(slice_partition_dedup)]

use itertools::Itertools;
use std::collections::BTreeMap;
use std::iter::{once, repeat_n};

#[derive(Debug)]
struct SolveResult {
    path: Vec<char>,
    parent_result: Option<Box<SolveResult>>,
}

impl SolveResult {
    fn len_of_last_parent(&self) -> usize {
        if let Some(parent) = &self.parent_result {
            parent.len_of_last_parent()
        } else {
            self.path.len()
        }
    }

    fn path_of_last_parent(&self) -> &[char] {
        if let Some(parent) = &self.parent_result {
            parent.path_of_last_parent()
        } else {
            &self.path
        }
    }
}

fn solve_part_1(pad: &Pad, code: &[char], prefix: char) -> SolveResult {
    let sequence = once(prefix).chain(code.iter().copied()).collect::<Vec<_>>();
    let paths = pad.all_paths(&sequence);
    let mut winner = None;
    for path in paths {
        if let Some(parent) = &pad.parent {
            let parent_result = solve_part_1(parent, &path, 'A');
            if parent_result.len_of_last_parent()
                < winner
                    .as_ref()
                    .map(|w: &SolveResult| w.len_of_last_parent())
                    .unwrap_or(usize::MAX)
            {
                winner = Some(SolveResult {
                    path,
                    parent_result: Some(Box::new(parent_result)),
                });
            }
        } else {
            if path.len()
                < winner
                    .as_ref()
                    .map(|w: &SolveResult| w.len_of_last_parent())
                    .unwrap_or(usize::MAX)
            {
                winner = Some(SolveResult {
                    path,
                    parent_result: None,
                });
            }
        }

        // let parent_result = pad.parent.as_ref().map(|parent| solve(&parent, &path));
        // if winner
        //     .as_ref()
        //     .map(|w: &Vec<_>| w.len())
        //     .unwrap_or(usize::MAX)
        //     > parent_result.map(|r| r.len_of_last_parent()).unwrap_or(usize::MAX)
        // {
        //     winner = Some((parent_path.clone(), path));
        // }
    }

    // println!("winner: {}", winner.iter().flatten().collect::<String>());
    winner.unwrap()
}

// part 2
fn main() {
    return part1();

    let pad_depth_2 = Pad::nested_dir_pads_only(2);
    let pad_depth_3 = Pad::nested_dir_pads_only(3);
    let all_dir_chars = "A<>^v";
    let mut shortest_paths_depth_2: BTreeMap<[Option<char>; 5], Vec<char>> = BTreeMap::new();
    let mut shortest_paths_depth_3: BTreeMap<[Option<char>; 5], Vec<char>> = BTreeMap::new();
    for a in all_dir_chars.chars() {
        for b in all_dir_chars.chars() {
            for c in all_dir_chars.chars() {
                for d in all_dir_chars.chars() {
                    for e in all_dir_chars.chars() {
                        for (pad, shortest_paths) in [
                            (&pad_depth_2, &mut shortest_paths_depth_2),
                            (&pad_depth_3, &mut shortest_paths_depth_3),
                        ] {
                            let result = solve_part_1(pad, &[b, c, d, e], a);
                            let path = result.path_of_last_parent();
                            shortest_paths.insert(
                                [Some(a), Some(b), Some(c), Some(d), Some(e)],
                                path.to_vec(),
                            );
                        }
                    }
                }
            }
        }
    }

    let num_pad = Pad::num();

    for code in SAMPLE.split("\n") {
        let all_paths = num_pad.all_paths(&once('A').chain(code.chars()).collect::<Vec<_>>());
        let shortest_path = all_paths
            .iter()
            .map(|path| {
                let mut final_path = vec![];
                for chars in &once('A').chain(path.iter().copied()).chunks(5) {
                    let mut lookup: [Option<char>; 5] = [None; 5];
                    for (i, c) in chars.enumerate() {
                        lookup[i] = Some(c);
                    }
                    let path = shortest_paths_depth_2.get(&lookup).unwrap();
                    final_path.extend(path);
                    final_path.push('A');
                }
                final_path
            })
            .min_by_key(|p| p.len())
            .unwrap();
        println!(
            "{}: {} ({})",
            code,
            shortest_path.iter().collect::<String>(),
            shortest_path.len()
        );
    }

    return;

    // return part1();
    let num_pad = Pad::full_init(2);
    let all_chars = "A0123456789";
    let mut shortest_paths = BTreeMap::new();
    for a in all_chars.chars() {
        for b in all_chars.chars() {
            let result = solve_part_1(&num_pad, &[b], a);
            let path = result.path_of_last_parent();
            shortest_paths.insert((a, b), path.to_vec());
        }
    }

    let mut total = 0;
    for code in SAMPLE.split("\n") {
        let mut path: Vec<char> = vec![];
        for (a, b) in once('A').chain(code.chars()).zip(code.chars()) {
            let this_path = shortest_paths.get(&(a, b)).unwrap();
            // println!(
            //     "{a} -> {b}: {this_path}",
            //     a = a,
            //     b = b,
            //     this_path = this_path.iter().collect::<String>()
            // );
            path.extend(this_path);
        }
        let num_part_of_code = code[0..3].parse::<usize>().unwrap();
        let product = num_part_of_code * path.len();
        println!("{} * {num_part_of_code} = {product}", path.len());
        total += product;
    }
    println!("part 2: {total}");
}

fn part1() {
    let mut total = 0;
    for code in INPUT.split("\n") {
        let num_pad = Pad::full_init(2);
        // num_pad.go_to_path_via_shortest_path(&code.chars().collect::<Vec<_>>());
        // let path = num_pad.last_path();
        let result = solve_part_1(&num_pad, &code.chars().collect::<Vec<_>>(), 'A');
        let path = result.path_of_last_parent();
        let num_part_of_code = code[0..3].parse::<usize>().unwrap();
        total += num_part_of_code * path.len();
        println!(
            "{path_len} * {num_part_of_code} => {path}",
            path_len = path.len(),
            path = path.iter().collect::<String>()
        );

        let mut result = &result;
        println!("0: {}", result.path.iter().collect::<String>());
        let mut i = 0;
        while let Some(next) = &result.parent_result {
            i += 1;
            println!("{i}: {}", next.path.iter().collect::<String>());
            result = next;
        }
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

#[derive(Clone, Debug)]
struct Pad {
    grid: Grid,
    all_shortest_paths: BTreeMap<(char, char), Vec<Vec<char>>>,
    current: char,
    moves_so_far: Vec<char>,
    parent: Option<Box<Pad>>,
}

impl Pad {
    fn nested_dir_pads_only(n: usize) -> Self {
        let mut pads = repeat_n(Self::dir(), n).collect::<Vec<_>>();
        let mut prev_pad = pads.pop().unwrap();
        while let Some(mut pad) = pads.pop() {
            pad.parent = Some(Box::new(prev_pad));
            prev_pad = pad;
        }
        prev_pad
    }

    fn full_init(num_robots: usize) -> Self {
        let mut pads = once(Self::num())
            .chain(repeat_n(Self::dir(), num_robots))
            .collect::<Vec<_>>();
        let mut prev_pad = pads.pop().unwrap();
        while let Some(mut pad) = pads.pop() {
            pad.parent = Some(Box::new(prev_pad));
            prev_pad = pad;
        }
        prev_pad
    }

    // fn print(&self, depth: usize) {
    //     let moves = self.moves_so_far.iter().collect::<String>();
    //     println!("{depth}: {moves}");
    //     if let Some(parent) = &self.parent {
    //         parent.print(depth + 1);
    //     }
    // }

    fn last_path(&self) -> &[char] {
        if let Some(parent) = &self.parent {
            parent.last_path()
        } else {
            &self.moves_so_far
        }
    }

    // fn go_to_path_via_shortest_path(&mut self, path: &[char]) {
    //     let paths = self.all_paths(path);
    //     let path_to_follow = match (paths.len(), &self.parent) {
    //         (0, _) => unreachable!(),
    //         (1, _) => paths.first().unwrap(),
    //         (_, Some(parent)) => paths
    //             .iter()
    //             .min_by_key(|p| parent.distance_to_path(p))
    //             .unwrap(),
    //         // there's no parent, so it doesn't matter, just pick one
    //         (_, None) => paths.iter().next().unwrap(),
    //     };
    //     let path_to_follow = path_to_follow.iter().copied().chain(once('A'));
    //     self.moves_so_far.extend(path_to_follow.clone());
    //
    //     // TODO: gotta recomment this in to get parents working
    //     if let Some(parent) = &mut self.parent {
    //         parent.go_to_path_via_shortest_path(&path_to_follow.collect::<Vec<_>>());
    //     }
    // }

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
            // TODO: might have to consider this in path mode instead of char-by-char

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

        let first_char = to[0];
        let mut prev_char = to[1];
        let mut all_paths_to_char = self.shortest_paths_from_to(first_char, prev_char);
        for path in all_paths_to_char.iter_mut() {
            path.push('A');
        }

        for &char in to.iter().skip(2) {
            all_paths_to_char = all_paths_to_char
                .iter()
                .flat_map(move |path| {
                    let mut paths = vec![];
                    for next_path in self.shortest_paths_from_to(prev_char, char) {
                        let mut path = path.clone();
                        path.extend(next_path);
                        path.push('A');
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
