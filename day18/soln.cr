SIZE     = 7
FILENAME = "sample.txt"
TAKE     = 12
alias Point = Tuple(Int32, Int32)

GRID = SIZE.times.flat_map do |y|
  SIZE.times.map do |x|
    { {y, x}, '.' }
  end
end.to_h

File.read(FILENAME).lines.first(TAKE).each do |line|
  GRID[Point.from(line.split(",").map(&.to_i))] = '#'
end

START = {0, 0}
GOAL  = {SIZE - 1, SIZE - 1}

class State
  property pos
  property steps

  def initialize(@pos : Point, @steps = 0)
  end

  def heuristic
    @steps + GOAL.zip(@pos).map { |a, b| (a - b).abs }.sum
  end

  def next_states
    [{0, 1}, {1, 0}, {0, -1}, {-1, 0}].map do |dydx|
      new_pos = Point.from(@pos.zip(dydx).map(&.sum))
      next if GRID[new_pos]? == '#'
      State.new(new_pos, @steps + 1)
    end.compact
  end
end

def go
  visited = {START => 0}
  q = [State.new START]
  until q.empty?
    current = q.shift

    return current if current.pos == GOAL

    current.next_states.each do |next_state|
      next if visited.fetch(next_state.pos, Int32::MAX) <= next_state.steps
      visited[next_state.pos] = next_state.steps
      q << next_state
    end

    q.sort_by! { |state| state.heuristic }
  end
end

p go
