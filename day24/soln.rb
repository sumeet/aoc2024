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

init.split("\n").each do |line|
  lhs, rhs = line.split ": "
  names.push lhs
  eval "def #{lhs} ; #{rhs} ; end"
end

commands.split("\n").each do |line|
  code, name = line.split(" -> ")
  names.push name
  code = code.gsub("AND", "&").gsub("XOR", "^").gsub("OR", "|")
  eval "def #{name} ; #{code} ; end"
end

ZNames = names.select { |name| name.start_with? "z" }.sort!.reverse!

#puts "part 1:"
#puts ZNames.map { |name| eval name }.join.to_i(2)

x_names = names.select { |name| name.start_with? "x" }.sort!.reverse!
y_names = names.select { |name| name.start_with? "y" }.sort!.reverse!

def add(a, b)
  ("%045b" % a).chars.each_with_index do |b, i|
    puts "def x#{'%02d' % (44 - i)} ; #{b} ; end"
    eval "def x#{'%02d' % (44 - i)} ; #{b} ; end"
  end

  ("%045b" % b).chars.each_with_index do |b, i|
    puts "def y#{'%02d' % (44 - i)} ; #{b} ; end"
    eval "def y#{'%02d' % (44 - i)} ; #{b} ; end"
  end

  ZNames.map { |name| eval name }.join.to_i(2)
end

a = 500
b = 500
res = add(a, b)
puts "got:\t#{res}\t%046b" %  res
res = a + b
puts "want:\t#{res}\t%046b" % res

puts "                5432109876543210987654321098765432109876543210"
puts "                     4         3         2         1         0"

dbg x09
dbg z09
