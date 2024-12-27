FILENAME = "input.txt"

Conns = {} of String => Array(String)
File.read_lines(FILENAME).each do |line|
  a, b = line.split("-")
  (Conns[a] ||= [] of String).push(b)
  (Conns[b] ||= [] of String).push(a)
end

combinations_containing_t = Conns.keys.combinations(3).select do |comb|
  comb.any? { |n| n.starts_with?("t") }
end

def split_with_others(arr)
  arr.map_with_index do |item, i|
    {item, arr[0...i] + arr[i + 1..]}
  end
end

part1 = combinations_containing_t.count do |comb|
  split_with_others(comb).all? do |(x, others)|
    others.all? { |y| Conns[x].includes?(y) }
  end
end

# puts "part 1: #{part1}"

puts "part 2:"

res = Conns.keys.flat_map do |pick|
  Conns[pick].combinations(3).map do |(a, b, c)|
    ((Conns[pick] | [pick]) & (Conns[a] | [a]) & (Conns[b] | [b]) & (Conns[c] | [c])).to_set
  end
end.uniq

thirteen = res.group_by(&.size)[13]

# verify
res = thirteen.select do |group|
  group.to_a.combinations(2).all? do |(a, b)|
    Conns[a].includes?(b) && Conns[b].includes?(a)
  end
end

puts res.first.to_a.sort.join(",")