sample = "\
Register A: 729
Register B: 0
Register C: 0

Program: 0,1,5,4,3,0"

input = "\
Register A: 22571680
Register B: 0
Register C: 0

Program: 2,4,1,3,7,5,0,3,4,3,1,5,5,5,3,0"

registers, program = input.split "\n\n"

Registers = registers.split("\n").map { |r| r.scan(/\d+/).first.to_i }
program = program.scan(/\d+/).map(&:to_i)

def combo value
  case value
  when 0..3 # literal
    value
  when 4 # A
    Registers[0]
  when 5 # B
    Registers[1]
  when 6 # C
    Registers[2]
  else
    raise "Invalid combo: #{value}"
  end
end

def run program
  out = []
  i = 0
  while i < program.size
    case program[i]
    when 0 #adv
      Registers[0] /= 2**combo(program[i+1])
      i += 2
    when 1 #bxl
      Registers[1] ^= program[i+1]
      i += 2
    when 2 # bst
      Registers[1] = combo(program[i+1]) % 8
      i += 2
    when 3 # jnz
      if Registers[0] != 0
        i = program[i+1]
      else
        i += 2
      end
    when 4 # bxc
      Registers[1] ^= Registers[2]
      i += 2 # intentionally increment by 2
    when 5 # out
      out.push combo(program[i+1]) % 8
      i += 2
    when 6 # bdv
      Registers[1] = Registers[0] / 2**combo(program[i+1])
      i += 2
    when 7 # cdv
      Registers[2] = Registers[0] / 2**combo(program[i+1])
      i += 2
    else
      raise "Invalid instruction: #{program[i]}"
    end
  end
  out
end

puts "part 1:"
puts run(program).join(',')


# 2,4,1,3,7,5,0,3,4,3,1,5,5,5,3,0

# 2, 4 (bst register A)
# register[1] = register[0] % 8

# 1, 3 (bxl 3)
# register[1] ^= 3

# 7, 5 (cdv register A)
# register[2] = register[0] / 2**register[1]

# 0, 3 (adv 3)
# register[0] /= 2**3

# 4, 3 (bxc, ignores operand for legacy reasons)
# register[1] ^= register[2]

# 1, 5 (bxl 5)
# register[1] ^= 5

# 5, 5 (out register B)
# output register[1] % 8

puts "part 2:"
Registers[0] = ((2**3)**15)
Registers[1] = 0
Registers[2] = 0
puts "program: #{program.inspect} (#{program.length})"
output = run(program)
puts "output: #{output.inspect} (#{output.length})"
