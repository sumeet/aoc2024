puts "part1"

locks = []
keys = []

File.read('input.txt').split("\n\n").each do |group|
  lines = group.split("\n").map(&:chars)
  counts = lines[1...-1].transpose.map {|line| line.count("#")}
  (lines.first.all?("#") ? locks : keys).push counts
end

part1 = locks.product(keys).count do |lock, key|
  lock.zip(key).all? { _1 + _2 <= 5}
end

puts part1
