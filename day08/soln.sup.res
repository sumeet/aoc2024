open Js.String2
open Js.Array2

let part1 = (input: string): int => {
  let grid = input->trim->split("\n")->map(split(_, ""))
  let coords = Belt.HashMap.String.fromArray([])

  Belt.HashMap.String.set(coords, "X", 0)
  //coords := Belt.Map.String.set(coords.contents, "Y", [2, 3, 4])
  Js.log(coords)
  123
}

@module("fs")
external readFileSync: (string, string) => string = "readFileSync"
let sample = readFileSync("sample.txt", "utf-8")
Js.log(part1(sample))
