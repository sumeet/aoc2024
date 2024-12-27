FILENAME = "sample.txt"

conns = {} of String => Array(String)
File.read_lines(FILENAME).each do |line|
  a, b = line.split("-")
  (conns[a] ||= [] of String).push(b)
  (conns[b] ||= [] of String).push(a)
end

combinations_containing_t = conns.keys.combinations(3).select do |comb|
  comb.any? { |n| n.starts_with?("t") }
end

def split_with_others(arr)
  arr.map_with_index do |item, i|
    {item, arr[0...i] + arr[i + 1..]}
  end
end

part1 = combinations_containing_t.count do |comb|
  split_with_others(comb).all? do |(x, others)|
    others.all? { |y| conns[x].includes?(y) }
  end
end

# puts "part 1: #{part1}"

puts "part 2:"

def part2
  pairs = File.read_lines(FILENAME).map do |line|
    line.split("-").to_set
  end.to_set

  puts "pairs: #{pairs.size}"

  (3..).each do |i|
    combos = pairs.to_a.combinations(i)
    puts "i: #{i}, combos: #{combos.size}"
    pairs = combos.map do |comb|
      union = comb.reduce { |a, b| a | b }
      union.size == i ? union : nil
    end.compact.to_set

    return pairs.to_a.first if pairs.size == 1
  end
end

p part2.to_a.sort.join(",")
