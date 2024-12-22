class DirectonalPad

#     +---+---+
#     | ^ | A |
# +---+---+---+
# | < | v | > |
# +---+---+---+
  attr_reader :grid
  attr_accessor :current

  def pos
    grid.fetch current
  end

  def in_range?((y, x))
    @set ||= Set.new(@grid.values)
    @set.include? [y, x]
  end

  def initialize
    @grid = {
      '^' => [1, 1],
      'A' => [1, 2],
      '<' => [2, 1],
      'v' => [2, 2],
      '>' => [2, 3],
    }
    @current = 'A'
  end
end

class NumPad
# +---+---+---+
# | 7 | 8 | 9 |
# +---+---+---+
# | 4 | 5 | 6 |
# +---+---+---+
# | 1 | 2 | 3 |
# +---+---+---+
#     | 0 | A |
#     +---+---+
  attr_reader :grid
  attr_accessor :current

  def pos
    grid.fetch current
  end

  def in_range?((y, x))
    @set ||= Set.new(@grid.values)
    @set.include? [y, x]
  end

  def initialize
    @grid = {
      '7' => [0, 0],
      '8' => [0, 1],
      '9' => [0, 2],
      '4' => [1, 0],
      '5' => [1, 1],
      '6' => [1, 2],
      '1' => [2, 0],
      '2' => [2, 1],
      '3' => [2, 2],
      '0' => [3, 1],
      'A' => [3, 2],
    }
    @current = 'A'
  end
end

def diff((source_y, source_x), (dest_y, dest_x))
  [dest_y - source_y, dest_x - source_x]
end

#def manhattan((x1, y1), (x2, y2))
#  (x1 - x2).abs + (y1 - y2).abs
#end

def sample
  "029A
980A
179A
456A
379A"
end

def input
  "341A
803A
149A
683A
208A"
end

def can_go(dir_str, pad)
  dydx = case dir_str
    when '^' [-1, 0]
    when 'v' [1, 0]
    when '<' [0, -1]
    when '>' [0, 1]
    else raise "Invalid direction"
  end
  pad.in_range? pad.pos.zip(dydx).map(&:sum)
end

num_pad = NumPad.new
direct_pads = 3.times.map { DirectonalPad.new }
sample.split("\n").each do |code|
  pads = [num_pad] + direct_pads
  acc = ""
  puts 'code', code
  code.each_char do |code_section|
    code_section.each_char do |digit|
      next_code_section = ""

      pads.each_slice(2) do |(p1, p2)|
        diff_to_digit = diff p1.pos, p1.grid.fetch(digit)
        dy, dx = diff_to_digit
        while dy != 0 || dx != 0
          #if dy < 0 && p2.current == 'v' && can_go('v', p1)
          #  next_code_section += "A"*dy.abs
          #  dy = 0
          #elsif dy > 0 && p2.current == '^' && can_go('^', p1)
          #  next_code_section += "A"*dy
          #  dy = 0
          #elsif dx < 0 && p2.current == '>' && can_go('<', p1)
          #  next_code_section += "A"*dx.abs
          #  dx = 0
          #elsif dx > 0 && p2.current == '<' && can_go('>', p1)
          #  next_code_section += "A"*dx
          #  dx = 0
          #elsif dy == 0 && dx == 0 && p2.current == 'A'
          #  next_code_section += "A"
          #else
          #  # down -> left (go left)
          #  if dx < 0 && p2.current == 'v' && can_go('v', p1)
          #    next_code_section += "<"*dx.abs + "A"
          #  # right -> down (go left)
          #  elsif dy < 0 && p2.current == '>' && can_go('>', p1)
          #    next_code_section += "<"*dy.abs + "A"
          #  # A -> up (go left)
          #  elsif dy > 0 && p2.current == 'A'
          #    next_code_section += "<"*dy + "A"
          #  end
          #end
        end

        break
      end
    end

    acc += code_section
  end
end
