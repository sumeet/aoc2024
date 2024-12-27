require "big"

def mix(n, secret)
  n ^ secret
end

def prune(n)
  n % 16777216
end

def evolve(secret)
  secret = prune mix(64 * secret, secret)
  secret = prune mix(secret // 32, secret)
  prune mix(secret * 2048, secret)
end

nums = File.read("input.txt").lines.map { |line| BigInt.new line }

res = nums.sum do |num|
  2000.times.reduce(num) { |acc, _| evolve(acc) }
end

puts "part 1: #{res}"

alias Seq = Tuple(Int8, Int8, Int8, Int8)

hashes = nums.map do |num|
  first_by_seq = {} of Seq => Int8
  last_4 = [] of Int8
  2000.times do
    new_num = evolve(num)
    new_price = (new_num % 10).to_i8
    old_price = (num % 10).to_i8
    price_diff = (new_price - old_price).to_i8
    last_4 = last_4.push(price_diff).last(4)
    first_by_seq[Seq.from(last_4)] ||= new_price if last_4.size == 4
    num = new_num
  end
  first_by_seq
end

union_of_keys = hashes.reduce(Set(Seq).new) do |acc, h|
  acc |= h.keys.to_set
end

res = union_of_keys.max_of do |seq|
  hashes.sum { |h| h.fetch(seq, 0) }
end

# 1747 doesn't work

puts "part 2: #{res}"
