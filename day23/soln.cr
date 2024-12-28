FILENAME = "input.txt"

Conns = {} of String => Set(String)
File.read_lines(FILENAME).each do |line|
  a, b = line.split("-")
  (Conns[a] ||= Set(String).new).add(b)
  (Conns[b] ||= Set(String).new).add(a)
  Conns[a].add(a)
  Conns[b].add(b)
end

combinations_containing_t = Conns.keys.combinations(3).select do |comb|
  comb.any? { |n| n.starts_with?("t") }
end

def split_with_others(arr)
  arr.map_with_index do |item, i|
    {item, arr[0...i] + arr[i + 1..]}
  end
end

puts "part 1"
part1 = combinations_containing_t.count do |comb|
  split_with_others(comb).all? do |(x, others)|
    others.all? { |y| Conns[x].includes?(y) }
  end
end
puts part1


puts "part 2:"

res = Conns.keys.flat_map do |pick|
  Conns[pick].to_a.combinations(3).map do |(a, b, c)|
    Conns[pick] & Conns[a] & Conns[b] & Conns[c]
    # ((Conns[pick] | [pick].to_set) & (Conns[a] | [a].to_set) & (Conns[b] | [b].to_) & (Conns[c] | [c]))
  end
end.uniq

thirteen = res.group_by(&.size)[13]

# verify
res = thirteen.select do |group|
  group.to_a.combinations(2).all? do |(a, b)|
    Conns[a].includes?(b) && Conns[b].includes?(a)
  end
end

raise "fail" unless res.size == 1
puts res.first.to_a.sort.join(",")