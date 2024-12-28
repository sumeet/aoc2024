use itertools::Itertools;
use rayon::iter::IntoParallelIterator;
use rayon::iter::ParallelIterator;
use rayon::prelude::{IntoParallelRefIterator, ParallelBridge};
use std::collections::BTreeSet;
use std::fs;

fn main() {
    let s = fs::read_to_string("../input.txt").unwrap();
    let mut pairs = BTreeSet::new();
    for line in s.lines() {
        pairs.insert(BTreeSet::from_iter(line.split("-")));
    }

    for i in 3.. {
        dbg!(i);

        let combos = pairs.iter().combinations(i);
        println!("combos: {}", combos.try_len().unwrap());
        pairs = combos
            .par_bridge()
            .filter_map(|comb| {
                let union = comb
                    .into_iter()
                    .flatten()
                    .copied()
                    .collect::<BTreeSet<&str>>();
                if union.len() == i {
                    Some(union)
                } else {
                    None
                }
            })
            .collect();

        if pairs.len() <= 1 {
            let result = pairs.iter().next().unwrap();
            println!("{}", result.iter().join("-"));
            break;
        }
    }
}
