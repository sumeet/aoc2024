# SIZE     = 7
# FILENAME = "sample.txt"
# TAKE     = 12

SIZE     = 71
FILENAME = "input.txt"
TAKE     = 1024

alias Point = Tuple(Int32, Int32)

GRID = SIZE.times.flat_map do |x|
  SIZE.times.map do |y|
    { {x, y}, '.' }
  end
end.to_h

POINTS = File.read(FILENAME).lines.map do |line|
  Point.from(line.split(",").map(&.to_i))
end

POINTS.first(TAKE).each { |point| GRID[point] = '#' }

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
      next unless GRID[new_pos]? == '.'
      State.new(new_pos, @steps + 1)
    end.compact
  end
end

def part1
  q = [State.new START]
  visited = {START => q[0].heuristic}
  until q.empty?
    current = q.shift
    return current if current.pos == GOAL

    current.next_states.each do |next_state|
      next if visited.fetch(next_state.pos, Int32::MAX) <= next_state.heuristic
      visited[next_state.pos] = next_state.heuristic
      q << next_state
    end

    q.sort_by! { |state| state.heuristic }
  end
end

puts "part 1: #{part1.not_nil!.steps}"

def is_end_reachable(pos, cache, seen)
  if (cached = cache[pos]?) != nil
    return cached
  end

  seen.add(pos)

  nexts = [{0, 1}, {1, 0}, {0, -1}, {-1, 0}].map do |dydx|
    new_pos = Point.from(pos.zip(dydx).map(&.sum))
    new_pos if GRID[new_pos]? == '.' && !seen.includes?(new_pos)
  end.compact
  return true if nexts.includes?(GOAL)
  nexts.any? { |n| is_end_reachable(n, cache, seen) }
end

POINTS.skip(TAKE).each do |point|
  GRID[point] = '#'
  seen = Set(Point).new
  if !is_end_reachable(START, {} of Point => Bool, seen)
    break puts "part 2: #{point.join(",")}"
  end
end
