conns = {} of String => Set(String)
File.read_lines("input.txt").each do |line|
  a, b = line.split("-")
  (conns[a] ||= Set(String).new).add(b)
  (conns[b] ||= Set(String).new).add(a)
end

combinations_containing_t = conns.keys.combinations(3).select do |comb|
  comb.any? { |n| n.starts_with?("t") }
end

def split_with_others(arr)
  arr.map_with_index do |item, i|
    {item, arr[0...i] + arr[i + 1..]}
  end
end

puts "part 1:"
part1 = combinations_containing_t.count do |comb|
  split_with_others(comb).all? do |(x, others)|
    others.all? { |y| conns[x].includes?(y) }
  end
end
p part1

prev_comps = [] of Array(String)
conns.keys.size.times do |i|
  puts "working on #{i}"

  all_combos = conns.keys.combinations(i)
  puts "got the combinations"
  comps = all_combos.select do |comb|
    comb.reduce(Set.new(comb)) { |acc, name| acc & (conns[name] | Set.new([name])) }.size == i
  end

  if comps.empty?
    raise "invalid" unless prev_comps.size == 1
    joined = prev_comps[0].sort.join(",")
    puts joined
    puts "part 2: #{joined}"
    break
  end
  prev_comps = comps
end
