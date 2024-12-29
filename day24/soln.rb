def dbg(value)
  location = caller_locations(1, 1).first
  path = location.path
  lineno = location.lineno
  code_line = File.readlines(path)[lineno - 1].strip
  puts "#{code_line} => #{value.inspect}"
  value  # return the original value
end


init, commands = File.read("input.txt").split("\n\n")
names = []

swaps = {
  "z09" => "nnf",
  "z20" => "nhs",
  # near z30 / z31
  "kqh" => "ddn",
  #"ddt" => "ddn",
  # new one
  "z34" => "wrc",
}.flat_map { |k, v| [[k, v], [v, k]] }.to_h

init.split("\n").each do |line|
  lhs, rhs = line.split ": "
  names.push lhs
  eval "def #{lhs} ; #{rhs} ; end"
end

Deps = {}

commands.split("\n").each do |line|
  code, name = line.split(" -> ")
  names.push name
  code = code.gsub("AND", "&").gsub("XOR", "^").gsub("OR", "|")
  Deps[name] = [code.split(" ")[0], code.split(" ")[2]]
  eval "def #{swaps.fetch(name, name)} ; #{code} ; end"
end

def all_deps_of name, depth = 0
  return [] if depth == 3
  these_deps = Deps.fetch(name, []).filter do |dep|
    !dep.start_with?("x") && !dep.start_with?("y")
  end
  (these_deps.flat_map { |dep| all_deps_of dep, depth+1 } + these_deps + [name]).uniq
end

ZNames = names.select { |name| name.start_with? "z" }.sort!.reverse!

#puts "part 1:"
#puts ZNames.map { |name| eval name }.join.to_i(2)

x_names = names.select { |name| name.start_with? "x" }.sort!.reverse!
y_names = names.select { |name| name.start_with? "y" }.sort!.reverse!

def add(a, b)
  ("%045b" % a).chars.each_with_index do |b, i|
    #puts "def x#{'%02d' % (44 - i)} ; #{b} ; end"
    eval "def x#{'%02d' % (44 - i)} ; #{b} ; end"
  end

  ("%045b" % b).chars.each_with_index do |b, i|
    #puts "def y#{'%02d' % (44 - i)} ; #{b} ; end"
    eval "def y#{'%02d' % (44 - i)} ; #{b} ; end"
  end

  ZNames.map { |name| eval name }.join.to_i(2)
end

a = 1 << 34
b = 1 << 35
res = add(a, b)
puts "got:\t\t#{res}\t\t%046b" %  res
res = a + b
puts "want:\t\t#{res}\t\t%046b" % res

puts "\t\t\t\t\t5432109876543210987654321098765432109876543210"
puts "\t\t\t\t\t     4         3         2         1         0"


#i = 1
#while i < (1 << 31)
#  res = add(0, i)
#  fail "wanted #{i} but got #{res}" unless res == i
#  i <<= 1
#end

#tests = [1073741824, 1073741825, 1173741826, 9999741826, 9999941826]
#tests = [9999999999999]
#tests += tests.flat_map do |i|
#  (1..2).map { |j| i * j } 
#end


tests = 1000.times.map { [rand(1<<34..1 << 35), rand(1<<34..1 << 35)] }
#tests = [[999999999, 9999999999999]]


def swap_methods a, b
  a, b = a.to_sym, b.to_sym
  orig_a = method(a)
  orig_b = method(b)
  Object.send(:define_method, a, orig_b)
  Object.send(:define_method, b, orig_a)

  yield

  Object.send(:define_method, a, orig_a)
  Object.send(:define_method, b, orig_b)
end

["z34", "z35", "z36"].flat_map {|n| all_deps_of n }.uniq.combination(2).each do |a, b|
  swap_methods a, b do
    is_good = tests.all? do |(lhs, rhs)|
      begin
        res = add(lhs, rhs)
      rescue SystemStackError
        res = -1
      end
      res == lhs + rhs
    end
    if is_good
      puts "swapped #{a} and #{b} is good"
    end
  end
end
