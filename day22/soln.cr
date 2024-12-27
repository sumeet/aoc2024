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

res = File.read("input.txt").lines.sum do |line|
  2000.times.reduce(BigInt.new line) { |acc, _| evolve(acc) }
end

puts "part 1: #{res}"
